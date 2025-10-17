"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Transaction, initialTransactions, type Invoice, initialInvoices } from "@/lib/finance-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentGatewayDialog } from "@/components/ui/payment-gateway-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusStyles = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
};

export default function ParentPaymentsPage() {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions-list", initialTransactions);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices-list", initialInvoices);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const { toast } = useToast();

    // Mock: In a real app, student name would come from the parent's context
    const childName = "Aisha Bello";
    const outstandingInvoice = invoices.find(inv => inv.studentName === childName && (inv.status === 'Pending' || inv.status === 'Overdue'));

    const handlePaymentSuccess = () => {
        if (!outstandingInvoice) return;
        setIsPaymentOpen(false);
        setInvoices(prev => prev.map(inv => inv.id === outstandingInvoice.id ? { ...inv, status: 'Paid' } : inv));
        const newTransaction: Transaction = {
          id: `trn-${Date.now()}`,
          studentName: outstandingInvoice.studentName,
          type: "Tuition",
          amount: outstandingInvoice.amount,
          date: new Date().toISOString().split('T')[0],
          status: "Paid",
        };
        setTransactions(prev => [newTransaction, ...prev]);
        toast({ variant: 'success', title: "Payment Successful", description: `Payment for invoice ${outstandingInvoice.id} has been confirmed.` });
    };

    return (
        <>
            <Tabs defaultValue="invoices">
                <TabsList>
                    <TabsTrigger value="invoices">Outstanding Invoices</TabsTrigger>
                    <TabsTrigger value="history">Payment History</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fee Invoices</CardTitle>
                            <CardDescription>View and pay outstanding school fees for your child.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.filter(inv => inv.studentName === childName).map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium font-mono">{invoice.id}</TableCell>
                                        <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                                        <TableCell>{invoice.dueDate}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={statusStyles[invoice.status]}>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {invoice.status !== 'Paid' && (
                                                <Button size="sm" onClick={() => setIsPaymentOpen(true)}>Pay Now</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>A record of all payments made.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.filter(t => t.studentName === childName).map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.date}</TableCell>
                                        <TableCell>{transaction.type}</TableCell>
                                        <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={statusStyles[transaction.status]}>
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <PaymentGatewayDialog
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                amount={outstandingInvoice?.amount || 0}
                description={`Payment for ${outstandingInvoice?.studentName}`}
            />
        </>
    )
}
