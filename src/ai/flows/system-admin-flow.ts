
'use server';
/**
 * @fileOverview The central AI agent for the Ugbekun platform.
 * This flow uses tools to perform administrative actions based on natural language commands.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as DataStore from '@/lib/data-store';
import { streamFlow } from 'genkit/experimental/streaming';

import { promoteStudents } from './admin-actions';
import { runPayroll } from './hr-actions';
import { generateTimetable } from './timetable-actions';
import { recordPaymentForInvoice } from './finance-actions';

// Define tools that the AI can use to perform actions.

const promoteStudentsTool = ai.defineTool(
  {
    name: 'promoteStudents',
    description: 'Promotes students from one class to the next for a new academic session. You must provide a promotion map of the source class to the target class.',
    inputSchema: z.object({
      promotionMap: z.record(z.string()).describe("A map from the source class name to the target class name. Use 'graduate' to graduate students."),
    }),
    outputSchema: z.object({ success: z.boolean(), graduatedCount: z.number() }),
  },
  async (input) => {
    const students = await DataStore.getStudents();
    const { updatedStudents, graduatedCount, auditLog } = await promoteStudents({ students, ...input });
    
    await DataStore.saveStudents(updatedStudents);
    await DataStore.addAuditLog(auditLog);

    return { success: true, graduatedCount };
  }
);

const runPayrollTool = ai.defineTool(
    {
        name: 'runPayroll',
        description: 'Processes and pays salaries for all active staff members for the current month.',
        inputSchema: z.object({}),
        outputSchema: z.object({ success: z.boolean(), processedCount: z.number(), totalAmount: z.number() }),
    },
    async () => {
        const staff = await DataStore.getStaff();
        const transactions = await DataStore.getTransactions();

        const { newTransactions, auditLog, processedCount, totalAmount } = await runPayroll({ staff });
        
        await DataStore.saveTransactions([...newTransactions, ...transactions]);
        await DataStore.addAuditLog(auditLog);
        
        return { success: true, processedCount, totalAmount };
    }
);

const generateTimetableTool = ai.defineTool(
    {
        name: 'generateTimetable',
        description: 'Generates a new, conflict-free weekly timetable for all classes in the school.',
        inputSchema: z.object({}),
        outputSchema: z.any(),
    },
    async () => {
        const result = await generateTimetable({});
        await DataStore.saveTimetables(result.timetable);
        await DataStore.addAuditLog(result.auditLog);
        return { success: true };
    }
);

const recordPaymentTool = ai.defineTool(
    {
        name: 'recordPaymentForInvoice',
        description: 'Records a payment for a specific invoice and marks it as paid.',
        inputSchema: z.object({ invoiceId: z.string().describe("The ID of the invoice to mark as paid.") }),
        outputSchema: z.object({ success: z.boolean() }),
    },
    async (input) => {
        const invoices = await DataStore.getInvoices();
        const transactions = await DataStore.getTransactions();

        const { updatedInvoices, updatedTransactions, auditLog } = await recordPaymentForInvoice({ ...input, invoices, transactions });
        
        await DataStore.saveInvoices(updatedInvoices);
        await DataStore.saveTransactions(updatedTransactions);
        await DataStore.addAuditLog(auditLog);

        return { success: true };
    }
);

// Define the flow that orchestrates the AI agent.

export const systemAdminFlow = ai.defineFlow(
  {
    name: 'systemAdminFlow',
    inputSchema: z.string().describe('The user\'s natural language command.'),
    outputSchema: z.any(),
    stream: true,
  },
  async (prompt) => {
    return streamFlow({
        prompt: `You are the Ugbekun AI System Administrator, a helpful and powerful assistant for managing a school.
Your capabilities include running payroll, generating timetables, managing student promotions, and handling financial records.
- First, analyze the user's request.
- If the request matches one of your tools, use it.
- If the request is a general question, a greeting, or something that does not match a tool, answer it conversationally as a helpful AI assistant.
- When you respond after using a tool, be friendly, concise, and confirm what you have done.
- If you perform an action, end your response with a summary of the result (e.g., "Payroll for 54 staff members has been processed successfully.").
- If you need more information to use a tool, ask the user for it.`,
        tools: [promoteStudentsTool, runPayrollTool, generateTimetableTool, recordPaymentTool],
        model: 'googleai/gemini-2.5-flash',
    },
    [prompt]
    );
  }
);
