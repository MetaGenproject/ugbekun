
'use server';
/**
 * @fileOverview A collection of server-side actions for Human Resources.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Staff } from '@/lib/hr-data';
import type { AuditLog } from '@/lib/audit-log-data';
import type { Transaction } from '@/lib/finance-data';


const RunPayrollInputSchema = z.object({
  staff: z.any().describe("The array of all staff members"),
});

const RunPayrollOutputSchema = z.object({
  newTransactions: z.any(),
  auditLog: z.any(),
  processedCount: z.number(),
  totalAmount: z.number(),
});
export type RunPayrollOutput = z.infer<typeof RunPayrollOutputSchema>;

export async function runPayroll(input: { staff: Staff[] }): Promise<RunPayrollOutput> {
  return runPayrollFlow(input);
}

const runPayrollFlow = ai.defineFlow(
  {
    name: 'runPayrollFlow',
    inputSchema: RunPayrollInputSchema,
    outputSchema: RunPayrollOutputSchema,
  },
  async ({ staff }) => {
    const activeStaff = staff.filter(s => s.status === 'Active');
    let totalAmount = 0;

    const newTransactions: Transaction[] = activeStaff.map(staffMember => {
      totalAmount += staffMember.salary;
      return {
          id: `trn-salary-${staffMember.id}-${Date.now()}`,
          studentName: staffMember.name, // Using studentName field for staff name here
          type: "Salary",
          amount: staffMember.salary,
          date: new Date().toISOString().split('T')[0],
          status: "Paid"
      };
    });
    
    const auditLog: Omit<AuditLog, 'id' | 'timestamp'> = {
        actorId: 'admin-nabila', // Mock actor
        actorName: 'Nabila A.',
        actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
        action: 'Payroll Run',
        details: `Processed payroll for ${activeStaff.length} staff members, totaling ₦${totalAmount.toLocaleString()}.`,
        icon: 'HandCoins',
    };

    return {
      newTransactions,
      auditLog,
      processedCount: activeStaff.length,
      totalAmount,
    };
  }
);
