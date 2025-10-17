
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from "next/navigation";
import { recentStudents as initialStudents, type Student } from "@/lib/admin-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, Edit, User, GraduationCap, Wallet, Printer, CheckCircle, BarChart2, ShieldCheck, Hash, Calendar, Home, School } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AddStudentDialog } from "@/components/admin-dashboard/add-student-dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Invoice } from "@/lib/finance-data";
import { format } from "date-fns";
import * as DataStore from '@/lib/data-store';

const statusStyles = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
};

interface StudentProfileClientProps {
    student: Student;
    transactions: Transaction[];
    invoices: Invoice[];
}

export default function StudentProfileClient({ student: initialStudent, transactions, invoices }: StudentProfileClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    const [students, setStudents] = useLocalStorage<Student[]>("students", initialStudents);
    const [note, setNote] = useState("");

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    const student = students.find(s => s.id === initialStudent.id) || initialStudent;

    const handleUpdateStudent = async (updatedStudentData: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => {
        if (!student) return;
        const updatedStudent = { ...student, ...updatedStudentData };
        await DataStore.updateStudent(updatedStudent);
        setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
        toast({
            variant: "success",
            title: "Student Updated",
            description: "The student's details have been saved."
        });
    };

    const studentTransactions = transactions.filter(t => t.studentName === student.name);
    const studentInvoices = invoices.filter(i => i.studentName === student.name);

    return (
        <>
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4"/>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
                </div>
            </div>

            <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                 <div className="p-6 sm:p-7">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <Avatar className="h-16 w-16 rounded-lg ring-1 ring-border">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                             <div>
                                <h2 className="text-xl font-semibold tracking-tight">{student.name}</h2>
                                 <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>{student.status || 'Active'}</Badge>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Hash className="h-3 w-3" />Student ID</div>
                                <div className="text-sm font-mono">{student.id}</div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><GraduationCap className="h-3 w-3" />Class</div>
                                <div className="text-sm">{student.class}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" />Date of Birth</div>
                                <div className="text-sm">{student.dateOfBirth ? format(new Date(student.dateOfBirth), 'PPP') : 'N/A'}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-2 mt-4 lg:mt-0">
                            <Button variant="outline"><Printer className="h-4 w-4 mr-2"/>Print ID</Button>
                            <Button onClick={() => setIsEditDialogOpen(true)}><Edit className="mr-2 h-4"/>Edit</Button>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview">
                    <div className="px-6 sm:px-7 border-t">
                        <TabsList className="bg-transparent p-0 -mx-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="guardian">Guardian Info</TabsTrigger>
                            <TabsTrigger value="fees">Fees</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview">
                         <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 border-t">
                            <Card className="p-4"><CardContent className="p-0"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Attendance</span><CheckCircle className="h-4 w-4 text-emerald-600"/></div><div className="mt-2 text-2xl font-semibold">98.2%</div></CardContent></Card>
                            <Card className="p-4"><CardContent className="p-0"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Average Score</span><BarChart2 className="h-4 w-4 text-blue-600"/></div><div className="mt-2 text-2xl font-semibold">89.5%</div></CardContent></Card>
                            <Card className="p-4"><CardContent className="p-0"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Behavioral</span><ShieldCheck className="h-4 w-4 text-emerald-600"/></div><div className="mt-2 text-2xl font-semibold">A</div></CardContent></Card>
                             <Card className="p-4"><CardContent className="p-0"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Fees</span><Wallet className="h-4 w-4 text-emerald-600"/></div><div className="mt-2 text-2xl font-semibold">Paid</div></CardContent></Card>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="guardian">
                        <div className="p-6 sm:p-7 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><User className="h-3 w-3" />Parent/Guardian Name</div>
                                <div className="text-sm font-medium">{student.parentName}</div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" />Phone Number</div>
                                <div className="text-sm font-medium">{student.parentPhone}</div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="h-3 w-3" />Email Address</div>
                                <div className="text-sm font-medium">{student.parentEmail}</div>
                            </div>
                             <div className="space-y-1">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Home className="h-3 w-3" />Home Address</div>
                                <div className="text-sm font-medium">{student.address}</div>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5"><School className="h-3 w-3" />Previous School</div>
                                <div className="text-sm font-medium">{student.previousSchool || 'N/A'}</div>
                            </div>
                        </div>
                    </TabsContent>

                     <TabsContent value="fees">
                        <div className="p-6 sm:p-7 border-t">
                            <Card>
                                <CardHeader><CardTitle>Fee Payment History</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Invoice ID</TableHead><TableHead>Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {studentInvoices.map(invoice => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell>{invoice.id}</TableCell>
                                                    <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                                                    <TableCell>{invoice.dueDate}</TableCell>
                                                    <TableCell><Badge className={statusStyles[invoice.status]}>{invoice.status}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="notes">
                         <div className="p-6 sm:p-7 border-t">
                            <Card>
                                <CardHeader><CardTitle>Internal Notes</CardTitle><CardDescription>Visible to staff only.</CardDescription></CardHeader>
                                <CardContent>
                                    <Textarea placeholder="Add a note about this student..." rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
                                    <div className="mt-2 flex justify-end"><Button size="sm" onClick={() => toast({title: "Note Saved"}) }><Edit className="mr-2 h-4"/>Save Note</Button></div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
         <AddStudentDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onAddStudent={() => {}} // Not used for editing
            onUpdateStudent={handleUpdateStudent}
            studentToEdit={student}
        />
        </>
    )
}
