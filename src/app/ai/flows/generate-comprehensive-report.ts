
'use server';
/**
 * @fileOverview An AI flow for generating comprehensive, Nigerian-style student reports.
 *
 * - generateComprehensiveReport - A function that generates the full report card remarks.
 * - GenerateComprehensiveReportInput - The input type for the function.
 * - GenerateComprehensiveReportOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ReportCardData } from '@/lib/report-card-data';

// We just need the raw data for the prompt, not the full Zod schema.
const GenerateComprehensiveReportInputSchema = z.object({
  reportData: z.any().describe('The full report card data object for the student.'),
});
export type GenerateComprehensiveReportInput = z.infer<typeof GenerateComprehensiveReportInputSchema>;

const GenerateComprehensiveReportOutputSchema = z.object({
  classTeacherRemark: z.string().describe("The class teacher's overall remark for the student, written in a constructive and professional tone, suitable for a Nigerian school report card."),
  headTeacherRemark: z.string().describe("The head teacher's final, brief, and encouraging remark on the student's performance."),
});
export type GenerateComprehensiveReportOutput = z.infer<typeof GenerateComprehensiveReportOutputSchema>;

export async function generateComprehensiveReport(input: { reportData: ReportCardData }): Promise<GenerateComprehensiveReportOutput | null> {
  const result = await generateComprehensiveReportFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateComprehensiveReportPrompt',
  input: { schema: GenerateComprehensiveReportInputSchema },
  output: { schema: GenerateComprehensiveReportOutputSchema },
  prompt: `You are an expert Nigerian educator with years of experience in writing end-of-term student reports.
  Your task is to generate a Class Teacher's Remark and a Head Teacher's Remark based on the detailed student performance data provided.
  The tone should be professional, encouraging, and culturally relevant for a top-tier Nigerian secondary school.

  **Student Performance Data:**
  - Name: {{{reportData.personalData.name}}}
  - Class: {{{reportData.personalData.class}}}
  - Overall Percentage: {{{reportData.performanceSummary.percentage}}}%
  - Class Position: {{{reportData.performanceSummary.position}}} out of {{{reportData.performanceSummary.classSize}}}

  **Subject Performance Breakdown (This Term):**
  {{#each reportData.cognitiveData}}
  - {{{subject}}}: {{{thirdTerm}}}% (Grade: {{{grade}}}, Remark: {{{remarks}}})
  {{/each}}

  **Behavioral Traits (Affective Domain):**
  {{#each reportData.affectiveDomain}}
  - {{{trait}}}: {{{value}}} (out of 5)
  {{/each}}
  
  **Skills (Psychomotor Domain):**
  {{#each reportData.psychomotorSkills}}
  - {{{skill}}}: {{{value}}} (out of 5)
  {{/each}}

  **Instructions:**

  1.  **Class Teacher's Remark:**
      - Write a comprehensive remark (2-3 sentences).
      - Acknowledge the student's overall performance, mentioning their percentage or position if it's noteworthy (either very good or needing improvement).
      - Identify specific strengths by looking at subjects with high scores (e.g., above 80%) or positive remarks ("EXCELLENT", "VERY GOOD").
      - Identify specific areas for improvement by looking at subjects with lower scores (e.g., below 60%) or remarks like "AVERAGE" or "FAIR".
      - Comment on their character based on the Affective Domain ratings (e.g., a high score in 'Attentiveness' or 'Honesty').
      - Conclude with an encouraging and forward-looking statement.
      - Example: "[Student Name] put up a [positive/fair/etc.] performance this term, placing [position]. He/She shows great strength in [Strong Subject 1] and [Strong Subject 2] but needs to apply more effort in [Weak Subject]. With improved focus, a better result is achievable next term."

  2.  **Head Teacher's Remark:**
      - Write a very brief, final comment (1 sentence).
      - This should be a high-level, encouraging statement.
      - Examples: "A very good result, keep it up!", "A satisfactory performance, but there is room for improvement.", "An excellent term's work. Well done!"

  Generate the remarks based *only* on the data provided.`,
});

const generateComprehensiveReportFlow = ai.defineFlow(
  {
    name: 'generateComprehensiveReportFlow',
    inputSchema: GenerateComprehensiveReportInputSchema,
    outputSchema: GenerateComprehensiveReportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
