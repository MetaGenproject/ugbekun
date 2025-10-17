/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContactRound, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Invoice, type Transaction, initialInvoices, initialTransactions } from '@/lib/finance-data';
import { useState, useMemo } from 'react';
import { PaymentGatewayDialog } from '../ui/payment-gateway-dialog';

export function Payments() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices-list', initialInvoices);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions-list', initialTransactions);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Mock: In a real app, student name would come from the parent's context
  const childName = "Aisha Bello";

  const outstandingInvoice = useMemo(() => 
    invoices.find(inv => inv.studentName === childName && (inv.status === 'Pending' || inv.status === 'Overdue')),
    [invoices, childName]
  );
  
  const lastPayment = useMemo(() => 
      [...transactions]
          .filter(t => t.studentName === childName && t.status === 'Paid')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
      [transactions, childName]
  );

  const handlePaymentSuccess = () => {
    if (!outstandingInvoice) return;
    setIsPaymentOpen(false);

    // 1. Update the invoice status
    setInvoices(prev => prev.map(inv => 
      inv.id === outstandingInvoice.id ? { ...inv, status: 'Paid' } : inv
    ));

    // 2. Create a new transaction record
    const newTransaction: Transaction = {
      id: `trn-${Date.now()}`,
      studentName: outstandingInvoice.studentName,
      type: "Tuition", // Assuming type, could be more dynamic
      amount: outstandingInvoice.amount,
      date: new Date().toISOString().split('T')[0],
      status: "Paid",
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // 3. Notify user
    toast({
      variant: 'success',
      title: "Payment Successful",
      description: `Payment for invoice ${outstandingInvoice.id} has been confirmed.`,
    });
  };

  const handlePaymentAction = (action: string) => {
    toast({
      title: "Action Submitted",
      description: `Your request to "${action}" has been received. A full payment gateway would be integrated here.`,
    });
  };

  return (
      <>
        <Card className="shadow-lg">
        <CardHeader className="p-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Payments</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast({description: "Payment history coming soon."})}>History</Button>
        </CardHeader>
        <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
                <div className="text-xs text-muted-foreground">Outstanding</div>
                {outstandingInvoice ? (
                    <>
                        <div className="mt-1 text-2xl font-semibold tracking-tight">₦{outstandingInvoice.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Due: {outstandingInvoice.dueDate}</div>
                    </>
                ) : (
                    <div className="mt-1 text-2xl font-semibold tracking-tight text-green-600">₦0</div>
                )}
            </Card>
            <Card className="p-4">
                <div className="text-xs text-muted-foreground">Last payment</div>
                {lastPayment ? (
                    <>
                        <div className="mt-1 text-2xl font-semibold tracking-tight">₦{lastPayment.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">on {lastPayment.date}</div>
                    </>
                ) : (
                    <div className="mt-1 text-2xl font-semibold tracking-tight">N/A</div>
                )}
            </Card>
            </div>
            <Card className="mt-4 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center text-secondary-foreground">
                <ContactRound className="h-5 w-5" />
                </div>
                <div>
                <div className="text-sm font-medium tracking-tight">Lunch Wallet</div>
                <div className="text-xs text-muted-foreground">Balance • ₦8,500</div>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handlePaymentAction("Top up Lunch Wallet")}>Top up</Button>
            </Card>
            <div className="mt-4">
            {outstandingInvoice ? (
                <Button className="w-full" onClick={() => setIsPaymentOpen(true)}>Pay Now</Button>
            ) : (
                <Button className="w-full" variant="secondary" disabled>
                    <CheckCircle className="mr-2 h-4 w-4"/> No Outstanding Fees
                </Button>
            )}
            </div>
        </CardContent>
        </Card>
         <PaymentGatewayDialog
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
            amount={outstandingInvoice?.amount || 0}
            description={`Payment for ${outstandingInvoice?.studentName}`}
        />
    </>
  );
}
