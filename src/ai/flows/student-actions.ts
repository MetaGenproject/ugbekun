
'use server';

/**
 * @fileOverview A collection of server-side actions for students or related to student data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as DataStore from '@/lib/data-store';

// //////////////////////////////////////////////////////////////////
//  SCRATCH CARD RESULT CHECKING
// //////////////////////////////////////////////////////////////////

const CheckResultInputSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  pin: z.string().min(12, "A 12-digit PIN is required").max(12, "A 12-digit PIN is required"),
});
export type CheckResultInput = z.infer<typeof CheckResultInputSchema>;

const CheckResultOutputSchema = z.object({
  success: z.boolean(),
  studentId: z.string(),
  error: z.string().optional(),
});
export type CheckResultOutput = z.infer<typeof CheckResultOutputSchema>;


export async function checkResultWithPin(input: CheckResultInput): Promise<CheckResultOutput> {
  const parsedInput = CheckResultInputSchema.safeParse(input);
  if (!parsedInput.success) {
    const error = parsedInput.error.flatten().fieldErrors;
    const errorMessage = error.studentId?.[0] || error.pin?.[0] || 'Invalid input.';
    return { success: false, studentId: input.studentId || '', error: errorMessage };
  }
  
  try {
    const result = await checkResultWithPinFlow(parsedInput.data);
    return result;
  } catch (e: any) {
    return { success: false, studentId: input.studentId, error: e.message || "An unexpected error occurred." };
  }
}

const checkResultWithPinFlow = ai.defineFlow(
  {
    name: 'checkResultWithPinFlow',
    inputSchema: CheckResultInputSchema,
    outputSchema: CheckResultOutputSchema,
  },
  async ({ studentId, pin }) => {
    // 1. Check if the student exists
    const students = await DataStore.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
        throw new Error("Student ID not found.");
    }

    // 2. Check if the scratch card exists and is valid
    const card = await DataStore.getScratchCardByPin(pin);
    if (!card) {
        throw new Error("Invalid PIN. Please check and try again.");
    }
    
    // 3. Check if the card is tied to a specific student
    if (card.studentId && card.studentId !== studentId) {
        throw new Error("This PIN is not valid for the specified Student ID.");
    }

    // 4. Check if the card has uses left
    if (card.uses <= 0) {
        throw new Error("This scratch card has been fully used.");
    }

    // 5. Decrement card uses and save
    const updatedCard = { ...card, uses: card.uses - 1 };
    await DataStore.updateScratchCard(updatedCard);

    // 6. If all checks pass, return success
    return { success: true, studentId };
  }
);
