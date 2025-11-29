
'use server';
/**
 * @fileOverview A collection of server-side actions for teachers.
 * This includes both AI-powered assists and core business logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as DataStore from '@/lib/data-store';
import type { Submission } from '@/lib/submission-data';

// //////////////////////////////////////////////////////////////////
//  1. AI-POWERED FEEDBACK GENERATION
// //////////////////////////////////////////////////////////////////

const GenerateFeedbackInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  assignmentTitle: z.string().describe("The title of the assignment or exam."),
  question: z.string().describe("The specific question or a summary of the questions asked."),
  studentAnswer: z.string().describe("The student's answer(s) to the question(s)."),
  score: z.number().describe("The score the teacher has given the student (out of 100)."),
  grade: z.string().describe("The letter grade the teacher has assigned."),
});
export type GenerateFeedbackInput = z.infer<typeof GenerateFeedbackInputSchema>;

const GenerateFeedbackOutputSchema = z.object({
    feedback: z.string().describe("Constructive, encouraging feedback for the student, explaining why they received the score and suggesting improvements based on their answers."),
});
export type GenerateFeedbackOutput = z.infer<typeof GenerateFeedbackOutputSchema>;

export async function generateFeedback(input: GenerateFeedbackInput): Promise<GenerateFeedbackOutput> {
  return generateFeedbackFlow(input);
}

const generateFeedbackFlow = ai.defineFlow(
  {
    name: 'generateFeedbackFlow',
    inputSchema: GenerateFeedbackInputSchema,
    outputSchema: GenerateFeedbackOutputSchema,
  },
  async (input) => {
    const prompt = `You are an expert teacher providing feedback on a student's submission. The teacher has already graded the work. Your task is to provide the written feedback only.
    
    Student: ${input.studentName}
    Assignment/Exam: ${input.assignmentTitle}
    Score: ${input.score}/100
    Grade: ${input.grade}

    The Question(s) Asked:
    "${input.question}"

    Student's Answer(s):
    "${input.studentAnswer}"

    Based on the score and the student's answer(s), write brief, constructive, and encouraging feedback. Explain the score, highlight what they did well, and help them understand how they can improve next time. Be specific if possible.
    `;
    const {output} = await ai.generate({ prompt, output: { schema: GenerateFeedbackOutputSchema }});
    return output!;
  }
);


// //////////////////////////////////////////////////////////////////
//  2. CORE GRADING LOGIC
// //////////////////////////////////////////////////////////////////

const SubmitGradeInputSchema = z.object({
    submissionId: z.string(),
    score: z.number(),
    grade: z.string(),
    feedback: z.string(),
});
type SubmitGradeInput = z.infer<typeof SubmitGradeInputSchema>;

export async function submitGrade(input: SubmitGradeInput): Promise<Submission> {
    const submissions = await DataStore.getSubmissions();
    const submission = submissions.find(s => s.id === input.submissionId);

    if (!submission) {
        throw new Error("Submission not found");
    }

    const updatedSubmission: Submission = {
        ...submission,
        score: input.score,
        grade: input.grade,
        feedback: input.feedback,
        status: 'graded',
    };

    await DataStore.updateSubmission(updatedSubmission);
    
    // In a real app, this would trigger notifications via a pub/sub system.
    // For now, we simulate this by just returning the updated submission.
    console.log(`Grade submitted for ${submission.studentName}. Notifications would be sent.`);

    return updatedSubmission;
}
