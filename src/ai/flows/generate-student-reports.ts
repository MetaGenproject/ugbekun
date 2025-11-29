
'use server';

/**
 * @fileOverview A flow for generating student performance reports using AI.
 *
 * - generateStudentReport - A function that generates student performance reports.
 * - GenerateStudentReportInput - The input type for the generateStudentReport function.
 * - GenerateStudentReportOutput - The return type for the generateStudentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentReportInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  className: z.string().describe('The name of the class.'),
  teacherName: z.string().describe('The name of the teacher.'),
  subjects: z.array(z.string()).describe('List of subjects taken by the student.'),
  grades: z.record(z.string(), z.number()).describe('A map of subject to grade (0-100).'),
  attendanceRate: z.number().describe('The student attendance rate (0-100).'),
  behavioralNotes: z.string().describe('Any behavioral notes about the student.'),
  strengths: z.string().describe('Areas where the student excels.'),
  weaknesses: z.string().describe('Areas where the student needs improvement.'),
});
export type GenerateStudentReportInput = z.infer<typeof GenerateStudentReportInputSchema>;

const GenerateStudentReportOutputSchema = z.object({
  report: z.string().describe('The generated student performance report.'),
});
export type GenerateStudentReportOutput = z.infer<typeof GenerateStudentReportOutputSchema>;

export async function generateStudentReport(input: GenerateStudentReportInput): Promise<GenerateStudentReportOutput> {
  return generateStudentReportFlow(input);
}

const generateStudentReportFlow = ai.defineFlow(
  {
    name: 'generateStudentReportFlow',
    inputSchema: GenerateStudentReportInputSchema,
    outputSchema: GenerateStudentReportOutputSchema,
  },
  async (input) => {
    const subjectsList = input.subjects.join(', ');
    const gradesList = Object.entries(input.grades).map(([key, value]) => `${key}: ${value}`).join(', ');

    const prompt = `You are an AI assistant tasked with generating student performance reports for principals.

    Based on the provided information, create a comprehensive and easy-to-understand report.
    Include the following sections:

    - Student Information: Name, Class
    - Academic Performance: Subject grades, overall grade average, strengths, and weaknesses.
    - Attendance: Attendance rate.
    - Behavioral Notes: Any relevant behavioral observations.
    - Recommendations: Suggestions for improvement.

    Student Name: ${input.studentName}
    Class: ${input.className}
    Teacher: ${input.teacherName}
    Subjects: ${subjectsList}
    Grades: ${gradesList}
    Attendance Rate: ${input.attendanceRate}%
    Behavioral Notes: ${input.behavioralNotes}
    Strengths: ${input.strengths}
    Weaknesses: ${input.weaknesses}

    Write the report in a professional and concise manner. The report should be no more than 200 words.
    `;

    const {output} = await ai.generate({ prompt, output: { schema: GenerateStudentReportOutputSchema } });
    return output!;
  }
);
