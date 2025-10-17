
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Applicant, initialApplicants, statusConfig } from "@/lib/admissions-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleTestDialog } from "@/components/admin-dashboard/schedule-test-dialog";
import type { Notification } from "@/lib/notifications-data";
import { parentNotifications, studentNotifications } from "@/lib/notifications-data";

export default function ScreeningPage() {
    const [applicants, setApplicants] = useLocalStorage<Applicant[]>("applicants", initialApplicants);
    const [isScheduleTestOpen, setIsScheduleTestOpen] = useState(false);
    const [, setStudentNotifications] = useLocalStorage<Notification[]>('student-notifications', studentNotifications);
    const [, setParentNotifications] = useLocalStorage<Notification[]>('parent-notifications', parentNotifications);
    const screeningApplicants = applicants.filter(app => app.status === "Screening");
    const { toast } = useToast();

    const handleSetStatus = (applicantName: string, newStatus: "Accepted" | "Rejected") => {
        setApplicants(prev => prev.map(app => app.name === applicantName ? { ...app, status: newStatus } : app));
        toast({
            variant: newStatus === "Accepted" ? "success" : "default",
            title: "Screening Result Recorded",
            description: `${applicantName} has been marked as '${newStatus === 'Accepted' ? 'Passed' : 'Failed'}'.`,
        })
    };

    const handleScheduleTest = (date: Date, instructions: string) => {
        const title = "Entrance Examination Scheduled";
        const description = `Your test is scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}. ${instructions}`;

        // In a real app, this would be a targeted notification.
        // For now, we notify the first student/parent for demonstration.
        const studentNotification: Notification = {
            id: Date.now(),
            title,
            description,
            icon: 'ClipboardCheck',
            read: false,
            href: "/student/examinations"
        };
        const parentNotification: Notification = {
             id: Date.now() + 1,
            title: `Entrance Exam for ${screeningApplicants[0]?.name || 'your child'}`,
            description,
            icon: 'ClipboardCheck',
            read: false,
            href: "/parent/examinations"
        };

        setStudentNotifications(prev => [studentNotification, ...prev]);
        setParentNotifications(prev => [parentNotification, ...prev]);

        toast({
            variant: "success",
            title: "Test Scheduled & Applicants Notified",
            description: `All ${screeningApplicants.length} applicants for screening have been notified.`,
        });
    }

    return (
        <>
        <Tabs defaultValue="screening" className="h-full">
            <TabsList>
                <TabsTrigger value="enquiries" asChild><Link href="/admin/admissions/enquiries">Enquiries</Link></TabsTrigger>
                <TabsTrigger value="applications" asChild><Link href="/admin/admissions">Applications</Link></TabsTrigger>
                <TabsTrigger value="screening">Screening</TabsTrigger>
                <TabsTrigger value="enrollment" asChild><Link href="/admin/admissions/enrollment">Enrollment</Link></TabsTrigger>
            </TabsList>
            <div className="mt-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Applicant Screening</CardTitle>
                        </div>
                        <Button onClick={() => setIsScheduleTestOpen(true)} disabled={screeningApplicants.length === 0}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Schedule Test ({screeningApplicants.length})
                        </Button>
                    </CardHeader>
                    <CardContent>
                       {screeningApplicants.length > 0 ? (
                           <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Applicant</TableHead>
                                       <TableHead>Applied To</TableHead>
                                       <TableHead>Status</TableHead>
                                       <TableHead className="text-right">Screening Result</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {screeningApplicants.map(applicant => (
                                        <TableRow key={applicant.name}>
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
                                                <Badge variant="secondary" className={statusConfig[applicant.status].color}>
                                                    <statusConfig.Screening.icon className="mr-1 h-3 w-3" />
                                                    {applicant.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="outline" size="sm" onClick={() => handleSetStatus(applicant.name, 'Rejected')}>
                                                        <X className="mr-2 h-4 w-4"/> Fail
                                                    </Button>
                                                    <Button variant="default" size="sm" onClick={() => handleSetStatus(applicant.name, 'Accepted')}>
                                                        <Check className="mr-2 h-4 w-4"/> Pass
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                       ) : (
                        <div className="h-[calc(100vh-24rem)] flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                            <div className="h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
                                <statusConfig.Screening.icon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold">No Applicants for Screening</h3>
                            <p className="text-muted-foreground mt-1">Applicants moved to this stage will appear here.</p>
                        </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </Tabs>
        <ScheduleTestDialog 
            isOpen={isScheduleTestOpen}
            onClose={() => setIsScheduleTestOpen(false)}
            onSchedule={handleScheduleTest}
        />
        </>
    )
}

    