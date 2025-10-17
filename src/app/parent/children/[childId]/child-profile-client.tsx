
"use client";

import { notFound, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, FileBarChart } from "lucide-react";
import { AssignmentsDue } from "@/components/parent-dashboard/assignments-due";
import { ClassTeachers } from "@/components/parent-dashboard/class-teachers";
import { RecentGrades } from "@/components/student-dashboard/recent-grades";
import { GpaChart } from "@/components/student-dashboard/gpa-chart";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Student, recentStudents } from "@/lib/admin-data";

interface ChildProfileClientProps {
    child: { id: string, name: string, class: string, avatar: string, initials: string, gpa: string, attendance: string };
    student: Student;
}

export default function ChildProfileClient({ child, student }: ChildProfileClientProps) {
    const router = useRouter();

    const handleMessageClick = () => {
        router.push('/parent/messages');
    }
    
    const handleViewReportCard = () => {
        router.push(`/admin/reports/${student.id}?preview=true`);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{child.name}'s Profile</h1>
                        <p className="text-muted-foreground">A detailed look at their academic journey.</p>
                    </div>
                </div>
                 <div className="flex gap-2 ml-auto">
                    <Button variant="outline" onClick={handleViewReportCard}><FileBarChart className="mr-2 h-4"/> View Report Card</Button>
                    <Button onClick={handleMessageClick}><MessageSquare className="mr-2 h-4"/> Message Teachers</Button>
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                 <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20">
                                <AvatarImage src={child.avatar} alt={child.name} />
                                <AvatarFallback className="text-3xl">{child.initials}</AvatarFallback>
                            </Avatar>
                            <h2 className="mt-4 text-xl font-bold tracking-tight">{student.name}</h2>
                            <p className="text-muted-foreground">{student.class}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Academic Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground">Current GPA</p>
                                <p className="text-2xl font-semibold">{child.gpa}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground">Attendance</p>
                                <p className="text-2xl font-semibold">{child.attendance}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <ClassTeachers />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Trend</CardTitle>
                            <CardDescription>Average GPA across recent terms.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-72">
                            <GpaChart />
                        </CardContent>
                    </Card>
                    <AssignmentsDue />
                    <RecentGrades />
                </div>
            </div>
        </div>
    )
}
