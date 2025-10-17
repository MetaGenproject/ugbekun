'use server';
/**
 * @fileOverview A collection of server-side actions for administrators.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Student } from '@/lib/admin-data';
import type { Message, Conversation } from '@/lib/chat-data';
import type { AuditLog } from '@/lib/audit-log-data';

// //////////////////////////////////////////////////////////////////
//  STUDENT PROMOTION LOGIC
// //////////////////////////////////////////////////////////////////

const PromotionMapSchema = z.record(z.string()); // Maps from current class to target class

const PromoteStudentsInputSchema = z.object({
    students: z.any().describe("The array of all students"),
    promotionMap: PromotionMapSchema,
});
type PromoteStudentsInput = z.infer<typeof PromoteStudentsInputSchema>;

const PromoteStudentsOutputSchema = z.object({
  updatedStudents: z.any(),
  graduatedCount: z.number(),
  auditLog: z.any(),
});
export type PromoteStudentsOutput = z.infer<typeof PromoteStudentsOutputSchema>;

export async function promoteStudents(input: PromoteStudentsInput): Promise<PromoteStudentsOutput> {
    return promoteStudentsFlow(input);
}

const promoteStudentsFlow = ai.defineFlow(
  {
    name: 'promoteStudentsFlow',
    inputSchema: PromoteStudentsInputSchema,
    outputSchema: PromoteStudentsOutputSchema,
  },
  async ({ students, promotionMap }) => {
    let graduatedCount = 0;

    const updatedStudents = students.map((student: Student) => {
        const promotionTarget = promotionMap[student.class];
        if (promotionTarget) {
            if (promotionTarget === 'graduate') {
                graduatedCount++;
                return { ...student, class: 'Graduated', status: 'Alumni' as const };
            }
            if (promotionTarget !== 'none') {
                return { ...student, class: promotionTarget };
            }
        }
        return student;
    });

    const auditLog: Omit<AuditLog, 'id' | 'timestamp'> = {
        actorId: 'admin-nabila',
        actorName: 'Nabila A.',
        actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
        action: 'Student Promotion',
        details: `Promoted students to new classes and graduated ${graduatedCount} students.`,
        icon: 'GraduationCap',
    };

    return { updatedStudents, graduatedCount, auditLog };
  }
);


// //////////////////////////////////////////////////////////////////
//  SEND MESSAGE LOGIC
// /// ///////////////////////////////////////////////////////////////
const SendMessageInputSchema = z.object({
    studentId: z.string(),
    messageText: z.string().min(1),
    conversations: z.any(),
});
type SendMessageInput = z.infer<typeof SendMessageInputSchema>;

export async function sendMessageToStudent(input: SendMessageInput): Promise<{ updatedConversations: Conversation }> {
  const { studentId, messageText, conversations } = input;
  
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    from: 'me', // 'me' is from the admin's perspective
    text: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const updatedConversations = { ...conversations };
  if (!updatedConversations[studentId]) {
    updatedConversations[studentId] = [];
  }
  updatedConversations[studentId].push(newMessage);

  return { updatedConversations };
}
