
'use server';
/**
 * @fileOverview An AI assistant for students, focused on learning and creativity.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { streamFlow } from 'genkit/experimental/streaming';

const creativeAssistantTool = ai.defineTool(
    {
        name: 'creativeAssistant',
        description: 'A creative tool to help with writing, brainstorming, and learning. Use it to explain concepts, summarize text, draft essays, or generate ideas.',
        inputSchema: z.object({
            request: z.string().describe("The student's creative or educational request, e.g., 'Explain photosynthesis' or 'Write a short story about a talking drum'"),
        }),
        outputSchema: z.string().describe("The generated text, explanation, or ideas."),
    },
    async ({ request }) => {
         const llmResponse = await ai.generate({
            prompt: `You are a helpful and encouraging academic assistant for a student. Fulfill the following request to the best of your ability. Keep your tone positive and educational. Request: "${request}"`,
            model: 'googleai/gemini-2.5-flash',
        });
        return llmResponse.text ?? "I couldn't generate a response. Please try again.";
    }
);


export const studentAssistantFlow = ai.defineFlow(
  {
    name: 'studentAssistantFlow',
    inputSchema: z.string().describe("The student's natural language command or question."),
    outputSchema: z.any(),
    stream: true,
  },
  async (prompt) => {
    return streamFlow(
      {
        prompt: `You are a helpful and friendly AI learning assistant for a student. Your goal is to be encouraging and supportive.
- First, analyze the user's request.
- If the user's request is clearly for creative help, writing, brainstorming, or learning a concept, use the 'creativeAssistant' tool.
- If the user is just having a conversation, asking a general question, or saying hello, respond conversationally as a friendly AI assistant without using any tools.
`,
        tools: [creativeAssistantTool],
        model: 'googleai/gemini-2.5-flash',
      },
      [prompt]
    );
  }
);
