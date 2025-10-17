
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PlusCircle,
  FileDown,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlan } from "@/context/plan-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Student } from "@/lib/admin-data";
import { type Applicant, initialApplicants, statusConfig } from "@/lib/admissions-data";
import { AddStudentDialog } from "@/components/admin-dashboard/add-student-dialog";
import { useToast } from "@/components/ui/use-toast";
import { generateStudentId } from "@/lib/did";

const SkeletonPage = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-56 mt-2" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
        </div>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                    <TableHead className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(6)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
)

export default function AdmissionsPage() {
  const [applicants, setApplicants] = useLocalStorage<Applicant[]>("applicants", initialApplicants);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const { hasFeature, openUpgradeDialog, isLoading } = usePlan();
  const { toast } = useToast();

  if (isLoading) {
      return <SkeletonPage />
  }

  const handleAddApplication = () => {
    if (!hasFeature('ADMISSIONS')) {
      openUpgradeDialog('ADMISSIONS');
    } else {
      setIsAddStudentOpen(true);
    }
  };

  const setApplicantStatus = (id: string, status: Applicant["status"]) => {
    if (!hasFeature('ADMISSIONS')) {
        openUpgradeDialog('ADMISSIONS');
        return;
    }
    setApplicants(
      applicants.map((app) => (app.id === id ? { ...app, status } : app))
    );
     toast({
        variant: "success",
        title: "Status Updated",
        description: `Applicant status has been changed to ${status}.`,
    });
  };
  
  const handleAddNewApplicant = (newStudent: Omit<Student, "id" | "avatar" | "initials" | "status">) => {
    const studentId = generateStudentId("UC");
    const newApplicant: Applicant = {
        id: studentId,
        name: newStudent.name,
        class: newStudent.class,
        avatar: `https://i.pravatar.cc/40?u=${studentId}`,
        initials: newStudent.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        submissionDate: new Date().toISOString().split('T')[0],
        status: "Applied",
        parentName: newStudent.parentName || "N/A", // Mock data for now
        parentEmail: newStudent.parentEmail || "N/A",
        parentPhone: newStudent.parentPhone || "N/A",
    };
    setApplicants(prev => [newApplicant, ...prev]);
    toast({ variant: "success", title: "Application Added", description: `${newStudent.name}'s application has been logged.` });
  }

  return (
    <>
    <Tabs defaultValue="applications" className="h-full">
        <TabsList>
            <TabsTrigger value="enquiries" asChild><Link href="/admin/admissions/enquiries">Enquiries</Link></TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="screening" asChild><Link href="/admin/admissions/screening">Screening</Link></TabsTrigger>
            <TabsTrigger value="enrollment" asChild><Link href="/admin/admissions/enrollment">Enrollment</Link></TabsTrigger>
        </TabsList>
        <div className="mt-6">
            <TabsContent value="applications" className="m-0">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Applications</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => toast({description: "Your export is being prepared."})}>
                            <FileDown className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button onClick={handleAddApplication}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Application
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <ScrollArea className="h-[calc(100vh-24rem)]">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Applied To</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants.map((applicant) => {
                            const config = statusConfig[applicant.status];
                            return (
                                <TableRow key={applicant.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                      <Avatar>
                                        <AvatarImage src={applicant.avatar} alt={applicant.name} />
                                        <AvatarFallback>{applicant.initials}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p>{applicant.name}</p>
                                        <p className="text-xs text-muted-foreground">{applicant.parentName}</p>
                                      </div>
                                  </div>
                                </TableCell>
                                <TableCell>{applicant.class}</TableCell>
                                <TableCell>{applicant.submissionDate}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={config.color}>
                                    <config.icon className="mr-1 h-3 w-3" />
                                    {applicant.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setApplicantStatus(applicant.id, "Screening")
                                            }
                                            >
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            Move to Screening
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setApplicantStatus(applicant.id, "Accepted")
                                            }
                                            >
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Accept
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setApplicantStatus(applicant.id, "Rejected")
                                            }
                                            className="text-destructive focus:text-destructive"
                                            >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                </TableRow>
                            );
                            })}
                        </TableBody>
                        </Table>
                    </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    </Tabs>
    <AddStudentDialog 
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddNewApplicant}
        onUpdateStudent={() => {}}
        studentToEdit={null}
        title="Log New Application"
        description="Fill in the applicant's details to add them to the admissions list."
    />
    </>
  );
}

    