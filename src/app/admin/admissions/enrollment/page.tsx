
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Applicant, initialApplicants } from "@/lib/admissions-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/lib/admissions-data";
import { useToast } from "@/components/ui/use-toast";
import type { Student } from "@/lib/admin-data";
import { recentStudents as initialStudents } from "@/lib/admin-data";

export default function EnrollmentPage() {
    const [applicants, setApplicants] = useLocalStorage<Applicant[]>("applicants", initialApplicants);
    const [students, setStudents] = useLocalStorage<Student[]>("students", initialStudents);
    const { toast } = useToast();

    const acceptedApplicants = applicants.filter(app => app.status === 'Accepted');

    const handleEnroll = (applicant: Applicant) => {
        // Create a new student record
        const newStudent: Student = {
            id: applicant.id,
            name: applicant.name,
            class: applicant.class,
            avatar: applicant.avatar,
            initials: applicant.initials,
            status: 'Active',
            dateOfBirth: '2010-01-01', // Mock data
            gender: 'Female', // Mock data
            parentName: applicant.parentName,
            parentPhone: applicant.parentPhone,
            parentEmail: applicant.parentEmail,
            address: '123 Mock Street', // Mock data
        };
        setStudents(prev => [newStudent, ...prev]);

        // Remove from the applicant list
        setApplicants(prev => prev.filter(a => a.id !== applicant.id));

        toast({
            variant: "success",
            title: "Student Enrolled!",
            description: `${applicant.name} has been officially enrolled in ${applicant.class}.`
        });
    };
    
    const handleEnrollAll = () => {
        if (acceptedApplicants.length === 0) return;
        
        const newStudents: Student[] = acceptedApplicants.map(applicant => ({
            id: applicant.id,
            name: applicant.name,
            class: applicant.class,
            avatar: applicant.avatar,
            initials: applicant.initials,
            status: 'Active' as const,
            dateOfBirth: '2010-01-01', // Mock data
            gender: 'Female', // Mock data
            parentName: applicant.parentName,
            parentPhone: applicant.parentPhone,
            parentEmail: applicant.parentEmail,
            address: '123 Mock Street', // Mock data
        }));
        
        setStudents(prev => [...newStudents, ...prev]);
        setApplicants(prev => prev.filter(a => a.status !== 'Accepted'));
        
        toast({
            variant: "success",
            title: "All Students Enrolled!",
            description: `${newStudents.length} students have been enrolled.`
        });
    }

    return (
        <Tabs defaultValue="enrollment" className="h-full">
            <TabsList>
                <TabsTrigger value="enquiries" asChild><Link href="/admin/admissions/enquiries">Enquiries</Link></TabsTrigger>
                <TabsTrigger value="applications" asChild><Link href="/admin/admissions">Applications</Link></TabsTrigger>
                <TabsTrigger value="screening" asChild><Link href="/admin/admissions/screening">Screening</Link></TabsTrigger>
                <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            </TabsList>
            <div className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Finalize Enrollment</CardTitle>
                        </div>
                        <Button onClick={handleEnrollAll} disabled={acceptedApplicants.length === 0}>
                            <CheckCircle className="mr-2 h-4 w-4"/> Enroll All ({acceptedApplicants.length})
                        </Button>
                    </CardHeader>
                    <CardContent>
                       {acceptedApplicants.length > 0 ? (
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Applied To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {acceptedApplicants.map(applicant => (
                                        <TableRow key={applicant.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarFallback>{applicant.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-medium">{applicant.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{applicant.class}</TableCell>
                                            <TableCell>
                                                <Badge className={statusConfig[applicant.status].color}>
                                                    <statusConfig.Accepted.icon className="mr-1 h-3 w-3" />
                                                    {applicant.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => handleEnroll(applicant)}>
                                                    Enroll Student <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                           </Table>
                       ) : (
                        <div className="h-[calc(100vh-24rem)] flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                             <div className="h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold">Ready for Enrollment</h3>
                            <p className="text-muted-foreground mt-1">Accepted applicants will appear here for final enrollment.</p>
                        </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </Tabs>
    )
}

    