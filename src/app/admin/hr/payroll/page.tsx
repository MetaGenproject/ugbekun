
"use client";

import { useState } from "react";
import type { Staff } from "@/lib/hr-data";
import { staff as initialStaff } from "@/lib/hr-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { runPayroll } from "@/ai/flows/hr-actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Transaction } from "@/lib/finance-data";
import type { AuditLog } from "@/lib/audit-log-data";
import { initialTransactions } from "@/lib/finance-data";
import { initialAuditLogs } from "@/lib/audit-log-data";

export default function PayrollPage() {
    const [staff, setStaff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions-list', initialTransactions);
    const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('audit-log', initialAuditLogs);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleRunPayroll = async () => {
        setIsProcessing(true);
        try {
            const result = await runPayroll({ staff }); 
            if (result) {
                // Update local storage with the new data from the flow
                setTransactions(prev => [...result.newTransactions, ...prev]);
                setAuditLogs(prev => [{...result.auditLog, id: `log-${Date.now()}`, timestamp: new Date().toISOString() }, ...prev]);
                
                toast({
                    variant: "success",
                    title: "Payroll for August Submitted",
                    description: `Processed salaries for ${result.processedCount} active staff members.`
                });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Payroll Failed' });
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Staff Payroll</CardTitle>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => toast({description: "Your payroll data is being prepared for export."})}><FileDown className="mr-2 h-4 w-4"/> Export</Button>
                    <Button onClick={handleRunPayroll} disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {isProcessing ? "Processing Payroll..." : "Run Payroll for August"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Staff Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Monthly Salary</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.map(s => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={s.avatar} alt={s.name} />
                                            <AvatarFallback>{s.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        {s.name}
                                    </div>
                                </TableCell>
                                <TableCell>{s.role}</TableCell>
                                <TableCell>₦{s.salary.toLocaleString()}</TableCell>
                                <TableCell>
                                     <Badge variant={s.status === "Active" ? "default" : "outline"} className={s.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" : ""}>
                                        {s.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

    