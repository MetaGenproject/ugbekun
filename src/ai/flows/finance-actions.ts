
'use server';

/**
 * @fileOverview Server-side actions for the finance module.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Invoice, Transaction } from '@/lib/finance-data';
import type { AuditLog } from '@/lib/audit-log-data';


const RecordPaymentInputSchema = z.object({
  invoiceId: z.string(),
  invoices: z.any(),
  transactions: z.any(),
});
type RecordPaymentInput = z.infer<typeof RecordPaymentInputSchema>;

const RecordPaymentOutputSchema = z.object({
    updatedInvoices: z.any(),
    updatedTransactions: z.any(),
    auditLog: z.any(),
});
export type RecordPaymentOutput = z.infer<typeof RecordPaymentOutputSchema>;


export async function recordPaymentForInvoice(input: RecordPaymentInput): Promise<RecordPaymentOutput> {
  return recordPaymentForInvoiceFlow(input);
}

const recordPaymentForInvoiceFlow = ai.defineFlow(
  {
    name: 'recordPaymentForInvoiceFlow',
    inputSchema: RecordPaymentInputSchema,
    outputSchema: RecordPaymentOutputSchema,
  },
  async ({ invoiceId, invoices, transactions }) => {
    const invoiceToPay = invoices.find((inv: Invoice) => inv.id === invoiceId);

    if (!invoiceToPay) {
      throw new Error("Invoice not found");
    }

    // 1. Update the invoice status
    const updatedInvoices = invoices.map((inv: Invoice) => 
        inv.id === invoiceId ? { ...inv, status: 'Paid' as const } : inv
    );

    // 2. Create a new transaction record
    const newTransaction: Transaction = {
      id: `trn-${Date.now()}`,
      studentName: invoiceToPay.studentName,
      type: "Tuition", // Assuming type, could be more dynamic
      amount: invoiceToPay.amount,
      date: new Date().toISOString().split('T')[0],
      status: "Paid",
      invoiceId: invoiceId, // Link transaction to invoice
    };
    const updatedTransactions = [newTransaction, ...transactions];

    // 3. Create an audit log entry
    const auditLog: Omit<AuditLog, 'id' | 'timestamp'> = {
        actorId: 'admin-nabila',
        actorName: 'Nabila A.',
        actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
        action: 'Payment Recorded',
        details: `Recorded payment for invoice ${invoiceId} for ${invoiceToPay.studentName}.`,
        icon: 'Wallet',
    };

    return { updatedInvoices, updatedTransactions, auditLog };
  }
);
