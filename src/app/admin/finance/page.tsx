
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, FileDown, TrendingUp, TrendingDown, CircleDot, Lock, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinanceChart } from "@/components/dashboard/finance-chart";
import { initialTransactions, initialInvoices, initialExpenses } from "@/lib/finance-data";
import type { Transaction, Invoice, Expense } from "@/lib/finance-data";
import { useToast } from "@/hooks/use-toast";
import { AddExpenseDialog } from "@/components/admin-dashboard/add-expense-dialog";
import { AddInvoiceDialog } from "@/components/admin-dashboard/add-invoice-dialog";
import { usePlan } from "@/context/plan-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AddPaymentDialog } from "@/components/admin-dashboard/add-payment-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const statusStyles = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
};


export default function FinancePage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions-list",
    initialTransactions
  );
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>(
    "invoices-list",
    initialInvoices
  );
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(
    "expenses-list",
    initialExpenses
  );
  const { toast } = useToast();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [receiptToShow, setReceiptToShow] = useState<Transaction | null>(null);
  
  const { hasFeature, openUpgradeDialog } = usePlan();

  const totalRevenue = transactions
        .filter(t => t.status === 'Paid')
        .reduce((acc, t) => acc + t.amount, 0);
  
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const outstandingFees = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((acc, i) => acc + i.amount, 0);
  
  const finStats = [
    { title: "Total Revenue (Term)", value: `₦${(totalRevenue / 1000).toFixed(0)}k`, icon: TrendingUp },
    { title: "Total Expenses (Term)", value: `₦${(totalExpenses / 1000).toFixed(0)}k`, icon: TrendingDown },
    { title: "Outstanding Fees", value: `₦${(outstandingFees / 1000).toFixed(0)}k`, icon: CircleDot },
  ]

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...newExpense, id: `exp-${Date.now()}` }, ...prev]);
    toast({ variant: 'success', title: 'Expense Logged', description: `${newExpense.item} has been recorded.` });
  };
  
  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    toast({ variant: 'success', title: 'Expense Updated', description: `${updatedExpense.item} has been updated.` });
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    toast({ variant: 'destructive', title: 'Expense Deleted' });
  };
  
  const handleAddInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    setInvoices(prev => [{...newInvoice, id: `INV-${Date.now()}`}, ...prev]);
    toast({ variant: 'success', title: 'Invoice Created', description: `Invoice for ${newInvoice.studentName} has been created.` });
  };
  
  const handleMarkAsPaid = (invoiceId: string) => {
    const invoiceToPay = invoices.find(inv => inv.id === invoiceId);
    if (!invoiceToPay) return;
    
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv));
    
     const newTransaction: Transaction = {
      id: `trn-${Date.now()}`,
      studentName: invoiceToPay.studentName,
      type: "Tuition",
      amount: invoiceToPay.amount,
      date: new Date().toISOString().split('T')[0],
      status: "Paid",
    };
    setTransactions(prev => [newTransaction, ...prev]);

    toast({
        variant: "success",
        title: "Payment Recorded",
        description: `Invoice ${invoiceId} has been marked as paid.`
    })
  }

  const handleAddPayment = (newPayment: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{...newPayment, id: `trn-${Date.now()}`}, ...prev]);
    toast({ variant: 'success', title: 'Payment Added', description: 'The new transaction has been recorded.' });
  }
  
  const handleUpdatePayment = (updatedPayment: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedPayment.id ? updatedPayment : t));
    toast({ variant: 'success', title: 'Payment Updated', description: 'The transaction has been updated.' });
  }

  const handleDeletePayment = () => {
    if (!transactionToDelete) return;
    setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
    toast({ variant: 'destructive', title: 'Transaction Deleted' });
    setTransactionToDelete(null);
  }

  const openEditExpenseDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseDialogOpen(true);
  }

  const openEditPaymentDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsPaymentDialogOpen(true);
  }

  const handleExport = (type: 'transactions' | 'invoices') => {
    toast({
      title: "Export Started",
      description: `Your ${type} data is being prepared for download.`
    })
  }
  
  if (!hasFeature('FINANCE')) {
     return (
        <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed bg-muted/50">
             <div className="h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
                <Lock className="h-8 w-8 text-primary"/>
            </div>
            <h3 className="font-semibold text-xl">Unlock the Finance Module</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">Track income, manage expenses, send invoices, and get a complete financial overview with the Growth plan.</p>
            <Button onClick={() => openUpgradeDialog('FINANCE')} className="mt-6">Upgrade to Growth</Button>
        </div>
    )
  }


  return (
    <>
    <Tabs defaultValue="overview" className="h-full">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <div className="mt-6 space-y-6">
            <TabsContent value="overview">
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {finStats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue vs. Expenses</CardTitle>
                        </CardHeader>
                        <CardContent className="h-96">
                            <FinanceChart/>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="transactions">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Fee Transactions</CardTitle>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleExport('transactions')}><FileDown className="mr-2 h-4 w-4"/> Export</Button>
                        <Button onClick={() => { setEditingTransaction(null); setIsPaymentDialogOpen(true); }}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Payment
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.studentName}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>₦{transaction.amount.toLocaleString()}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>
                                <Badge variant="secondary" className={statusStyles[transaction.status]}>
                                    {transaction.status}
                                </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => setReceiptToShow(transaction)}>
                                            View Receipt
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEditPaymentDialog(transaction)}>
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTransactionToDelete(transaction)} className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="invoices">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => handleExport('invoices')}><FileDown className="mr-2 h-4 w-4"/> Export</Button>
                        <Button onClick={() => setIsInvoiceDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium font-mono">{invoice.id}</TableCell>
                                <TableCell>{invoice.studentName}</TableCell>
                                <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                                <TableCell>{invoice.dueDate}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusStyles[invoice.status]}>
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" disabled={invoice.status === 'Paid'}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)} disabled={invoice.status === 'Paid'}>
                                                <CheckCircle className="mr-2 h-4 w-4"/> Mark as Paid
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
             <TabsContent value="expenses">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Expenses</CardTitle>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => { setEditingExpense(null); setIsExpenseDialogOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Log Expense
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.item}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>₦{expense.amount.toLocaleString()}</TableCell>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => openEditExpenseDialog(expense)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)} className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    </Tabs>
     <AddExpenseDialog 
        isOpen={isExpenseDialogOpen}
        onClose={() => setIsExpenseDialogOpen(false)}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        expenseToEdit={editingExpense}
    />
     <AddInvoiceDialog
        isOpen={isInvoiceDialogOpen}
        onClose={() => setIsInvoiceDialogOpen(false)}
        onAddInvoice={handleAddInvoice}
    />
     <AddPaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onAddPayment={handleAddPayment}
        onUpdatePayment={handleUpdatePayment}
        transactionToEdit={editingTransaction}
    />
    <ConfirmationDialog
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDeletePayment}
        title={`Delete Transaction?`}
        description="This action cannot be undone. This will permanently remove this transaction record."
        confirmText="Delete"
      />
    {receiptToShow && (
        <AlertDialog open={!!receiptToShow} onOpenChange={() => setReceiptToShow(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Transaction Receipt</AlertDialogTitle>
                    <AlertDialogDescription>Details for transaction ID: {receiptToShow.id}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Student:</strong> {receiptToShow.studentName}</p>
                    <p><strong>Amount:</strong> ₦{receiptToShow.amount.toLocaleString()}</p>
                    <p><strong>Date:</strong> {receiptToShow.date}</p>
                    <p><strong>Type:</strong> {receiptToShow.type}</p>
                    <p><strong>Status:</strong> <Badge variant="secondary" className={statusStyles[receiptToShow.status]}>{receiptToShow.status}</Badge></p>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setReceiptToShow(null)}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
    </>
  );
}

    