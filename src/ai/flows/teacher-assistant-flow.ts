
'use server';
/**
 * @fileOverview An AI assistant for teachers, with tools for lesson planning and feedback.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateLessonPlan, type GenerateLessonPlanInput } from './generate-lesson-plan';
import { generateFeedback, type GenerateFeedbackInput } from './teacher-actions';
import { streamFlow } from 'genkit/experimental/streaming';

const generateLessonPlanTool = ai.defineTool(
    {
        name: 'generateLessonPlan',
        description: 'Creates a detailed lesson plan for a specific subject, topic, and grade level.',
        inputSchema: z.object({
            subject: z.string(),
            topic: z.string(),
            gradeLevel: z.string(),
            duration: z.number().optional().default(40),
            objectives: z.array(z.string()).optional().default([]),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const result = await generateLessonPlan(input as GenerateLessonPlanInput);
        return result.lessonPlan;
    }
);

const generateFeedbackTool = ai.defineTool(
    {
        name: 'generateFeedback',
        description: "Generates constructive feedback for a student's submission based on their answer and score.",
        inputSchema: z.object({
            studentName: z.string(),
            assignmentTitle: z.string(),
            question: z.string(),
            studentAnswer: z.string(),
            score: z.number(),
            grade: z.string(),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const result = await generateFeedback(input as GenerateFeedbackInput);
        return result.feedback;
    }
);


export const teacherAssistantFlow = ai.defineFlow(
  {
    name: 'teacherAssistantFlow',
    inputSchema: z.string().describe("The teacher's natural language command."),
    outputSchema: z.any(),
    stream: true,
  },
  async (prompt) => {
    return streamFlow({
        prompt: `You are a helpful AI assistant for a teacher. Your purpose is to help teachers with administrative and educational tasks.
- First, analyze the user's request.
- If the request is to generate a lesson plan or create feedback, use the available tools.
- If the user asks a general question, says hello, or makes a request that does not match a tool, answer it conversationally.
- When you respond, be professional and concise.`,
        tools: [generateLessonPlanTool, generateFeedbackTool],
        model: 'googleai/gemini-2.5-flash',
    },
    [prompt]
    );
  }
);
