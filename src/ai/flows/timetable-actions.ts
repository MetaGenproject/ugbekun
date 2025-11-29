
'use server';
/**
 * @fileOverview AI flow for generating a school timetable.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as DataStore from '@/lib/data-store';
import type { AuditLog } from '@/lib/audit-log-data';

const GenerateTimetableOutputSchema = z.object({
  timetable: z.record(z.string(), z.array(z.array(z.string()))).describe('The generated timetable. The top-level keys are class names. The value is a 2D array representing the 5 school days (outer array) and 7 time slots (inner array).'),
  auditLog: z.any(),
});
export type GenerateTimetableOutput = z.infer<typeof GenerateTimetableOutputSchema>;

export async function generateTimetable(input: {}): Promise<GenerateTimetableOutput> {
  const classes = await DataStore.getClasses();
  const subjects = await DataStore.getSubjects();
  const staff = await DataStore.getStaff();
  
  const teachers = staff.filter(s => s.department === 'Academics').map(t => t.name);

  const prompt = `You are an expert school scheduler tasked with creating a weekly timetable.

  **Constraints & Rules:**
  1. The week has 5 days: Monday to Friday.
  2. Each day has 7 periods: 8am, 9am, 10am, 11am, 12pm, 1pm, 2pm.
  3. The 5th period (12pm) is ALWAYS "Break" for all classes.
  4. A teacher cannot be in two different classes at the same time slot on the same day.
  5. Core subjects like Mathematics and English should be spread out and not clustered on the same day for a class.
  6. Try to distribute subjects evenly throughout the week for each class.
  7. Use the provided list of classes and subjects. Each subject is taught by a specific teacher.
  8. Use "Assembly" and "Clubs" for some slots, preferably at the end of the day or week.

  **Available Data:**
  - Classes: ${JSON.stringify(classes.map(c => c.name))}
  - Subjects & Assigned Teachers: ${JSON.stringify(subjects.map(s => ({ name: s.name, teacher: s.teacher })))}
  - All Teachers: ${JSON.stringify(teachers)}
  
  **Output Instructions:**
  Generate a complete, conflict-free timetable object for all classes. The output must be a JSON object where keys are class names and the value is a 2D array (5 days x 7 slots).
  Also generate an auditLog object for this action.
  
  Example structure for one class:
  "JSS 1A": [
      ["Mathematics", "English", "Basic Science", "Social Studies", "Break", "Agric. Science", "Yoruba"],
      ["English", "Mathematics", "Basic Science", "P.H.E", "Break", "Business Studies", "Home Economics"],
      ... and so on for all 5 days.
  ]
  `;

  const { output } = await ai.generate({ prompt, output: { schema: GenerateTimetableOutputSchema }});
  
  if (!output) {
      throw new Error("AI failed to generate timetable.");
  }

  // Ensure the auditLog part of the response is correctly structured.
  const auditLog: Omit<AuditLog, 'id' | 'timestamp'> = {
    actorId: 'admin-nabila',
    actorName: 'Nabila A.',
    actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
    action: 'Timetable Generated',
    details: 'Generated a new weekly timetable for all classes using AI.',
    icon: 'CalendarClock',
  };

  return { timetable: output.timetable, auditLog };
}
