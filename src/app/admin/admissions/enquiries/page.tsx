
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight, MoreHorizontal, Trash2, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Enquiry, type Applicant, enquiryStatusConfig } from "@/lib/admissions-data";
import { AddEnquiryDialog } from "@/components/admin-dashboard/add-enquiry-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { EnquiryStatus } from "@/lib/admissions-data";
import { generateStudentId } from "@/lib/did";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialApplicants, initialEnquiries } from "@/lib/admissions-data";

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useLocalStorage<Enquiry[]>("enquiries", initialEnquiries);
    const [applicants, setApplicants] = useLocalStorage<Applicant[]>("applicants", initialApplicants);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddEnquiryOpen, setIsAddEnquiryOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Simulate initial data loading
        setIsLoading(false);
    }, []);

    const handleAddEnquiry = (newEnquiry: Omit<Enquiry, "id" | "status" | "enquiryDate">) => {
        const enquiryToAdd: Enquiry = {
            ...newEnquiry,
            id: `enq-${Date.now()}`,
            status: "New",
            enquiryDate: new Date().toISOString().split("T")[0],
        };
        setEnquiries(prev => [enquiryToAdd, ...prev]);
        toast({
            variant: "success",
            title: "Enquiry Logged",
            description: `Enquiry for ${newEnquiry.studentName} has been saved.`,
        });
    };

    const handleStatusChange = (enquiryId: string, status: EnquiryStatus) => {
        setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status } : e));
        toast({
            title: "Status Updated",
            description: `Enquiry status changed to "${status}".`,
        });
    }
    
    const handleConvertToApplication = (enquiry: Enquiry) => {
        const studentId = generateStudentId("UC");
        const newApplicant: Applicant = {
            id: studentId,
            name: enquiry.studentName,
            class: enquiry.classOfInterest,
            avatar: `https://i.pravatar.cc/40?u=${studentId}`,
            initials: enquiry.studentName.split(" ").map(n => n[0]).join("").toUpperCase(),
            submissionDate: new Date().toISOString().split('T')[0],
            status: "Applied",
            parentName: enquiry.parentName,
            parentEmail: enquiry.parentEmail,
            parentPhone: enquiry.parentPhone,
        };
        setApplicants(prev => [newApplicant, ...prev]);
        handleStatusChange(enquiry.id, 'Converted');
        
        toast({
            variant: "success",
            title: "Converted to Application",
            description: `${enquiry.studentName} is now in the application list.`,
        });
    }

    const handleDelete = (enquiryId: string) => {
        setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
        toast({
            variant: 'destructive',
            title: "Enquiry Deleted",
        });
    }

    return (
        <>
        <Tabs defaultValue="enquiries" className="h-full">
            <TabsList>
                <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
                <TabsTrigger value="applications" asChild><Link href="/admin/admissions">Applications</Link></TabsTrigger>
                <TabsTrigger value="screening" asChild><Link href="/admin/admissions/screening">Screening</Link></TabsTrigger>
                <TabsTrigger value="enrollment" asChild><Link href="/admin/admissions/enrollment">Enrollment</Link></TabsTrigger>
            </TabsList>
            <div className="mt-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Admission Enquiries</CardTitle>
                        </div>
                        <Button onClick={() => setIsAddEnquiryOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Log Enquiry</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class of Interest</TableHead>
                                    <TableHead>Parent Contact</TableHead>
                                    <TableHead>Enquiry Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="h-48 text-center text-muted-foreground">Loading enquiries...</TableCell></TableRow>
                                ) : enquiries.map(enquiry => {
                                    const statusInfo = enquiryStatusConfig[enquiry.status];
                                    const Icon = statusInfo.icon;
                                    return (
                                     <TableRow key={enquiry.id}>
                                         <TableCell className="font-medium">{enquiry.studentName}</TableCell>
                                         <TableCell>{enquiry.classOfInterest}</TableCell>
                                         <TableCell>
                                            <div>{enquiry.parentName}</div>
                                            <div className="text-xs text-muted-foreground">{enquiry.parentPhone}</div>
                                         </TableCell>
                                         <TableCell>{enquiry.enquiryDate}</TableCell>
                                         <TableCell>
                                            <Badge variant="secondary" className={statusInfo.color}>
                                                <Icon className="mr-2 h-3 w-3"/>
                                                {enquiry.status}
                                            </Badge>
                                         </TableCell>
                                         <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleConvertToApplication(enquiry)} disabled={enquiry.status === 'Converted'}>
                                                        <ArrowRight className="mr-2 h-4 w-4" /> Convert to Application
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'Contacted')}>
                                                        <Phone className="mr-2 h-4 w-4" /> Mark as Contacted
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(enquiry.id, 'Follow-up')}>
                                                        <MessageSquare className="mr-2 h-4 w-4" /> Mark for Follow-up
                                                    </DropdownMenuItem>
                                                     <DropdownMenuSeparator/>
                                                    <DropdownMenuItem onClick={() => handleDelete(enquiry.id)} className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                             </DropdownMenu>
                                         </TableCell>
                                     </TableRow>
                                    )
                                })}
                                {!isLoading && enquiries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                                            No enquiries logged yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Tabs>
        <AddEnquiryDialog
            isOpen={isAddEnquiryOpen}
            onClose={() => setIsAddEnquiryOpen(false)}
            onAddEnquiry={handleAddEnquiry}
        />
        </>
    )
}

    