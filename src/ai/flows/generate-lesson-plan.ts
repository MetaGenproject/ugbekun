
'use server';

/**
 * @fileOverview A flow for generating lesson plans using AI.
 *
 * - generateLessonPlan - A function that generates a lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson (e.g., Mathematics, History).'),
  topic: z.string().describe('The specific topic for the lesson.'),
  gradeLevel: z.string().describe('The grade level of the students (e.g., JSS 2, SSS 1).'),
  duration: z.number().describe('The duration of the lesson in minutes.'),
  objectives: z.array(z.string()).describe('A list of learning objectives for the lesson.'),
  materials: z.string().optional().describe('A comma-separated list of available materials.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The generated, well-structured lesson plan in markdown format.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async ({ subject, topic, gradeLevel, duration, objectives, materials }) => {
    const objectivesList = objectives.map(obj => `- ${obj}`).join('\n');
    const prompt = `You are an expert curriculum developer. Create a detailed and engaging lesson plan based on the following information. The lesson plan should be structured in Markdown format.

    **Subject:** ${subject}
    **Topic:** ${topic}
    **Grade Level:** ${gradeLevel}
    **Duration:** ${duration} minutes

    **Learning Objectives:**
    ${objectivesList}

    ${materials ? `**Available Materials:** ${materials}` : ''}

    Structure the lesson plan with the following sections:
    1.  **Introduction (Hook):** An engaging activity or question to capture students' interest.
    2.  **Instructional Activities:** Step-by-step activities to teach the concept.
    3.  **Guided Practice:** An activity for students to practice with teacher support.
    4.  **Independent Practice:** An assignment or activity for students to complete on their own.
    5.  **Assessment (Check for Understanding):** How to measure if the objectives were met.
    6.  **Conclusion:** A summary or wrap-up of the lesson.

    Ensure the activities are appropriate for the specified grade level and can be completed within the given duration.
    `;

    const {output} = await ai.generate({ prompt, output: { schema: GenerateLessonPlanOutputSchema } });
    return output!;
  }
);
