

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useState } from "react";
import { WelcomeHeader } from "@/components/student-dashboard/welcome-header";
import { AssignmentList } from "@/components/student-dashboard/assignment-list";
import { GpaChart } from "@/components/student-dashboard/gpa-chart";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { StatCards } from "@/components/student-dashboard/stat-cards";
import { AddTaskDialog } from "@/components/student-dashboard/add-task-dialog";
import { initialAssignments, type Assignment } from "@/lib/student-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SchoolCalendar } from "@/components/dashboard/school-calendar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileCheck2, ExternalLink } from "lucide-react";

export default function StudentDashboardPage() {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [assignments, setAssignments] = useLocalStorage<Assignment[]>('student-assignments', initialAssignments);
    const studentId = "UC-AB-2024"; // Mock logged-in student ID

    const handleAddTask = (newTaskData: { title: string; course: string; date?: Date }) => {
        const newTask: Assignment = {
            id: `task-${Date.now()}`,
            title: newTaskData.title,
            course: newTaskData.course,
            points: 0,
            completed: false,
            date: newTaskData.date?.toISOString() || new Date().toISOString(),
        };
        setAssignments(prev => [newTask, ...prev]);
    };

    return (
        <>
            <div className="space-y-6">
                <WelcomeHeader />
                
                <StatCards />

                <Card className="shadow-lg h-full">
                    <CardHeader>
                        <CardTitle>Term Average</CardTitle>
                        <CardDescription>Your academic performance trend for this term vs. last term.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                    <GpaChart />
                    </CardContent>
                </Card>

                <div className="h-[500px]">
                    <SchoolCalendar view="student" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AssignmentList onAddTask={() => setIsAddTaskOpen(true)} />
                    <Card>
                        <CardHeader>
                            <CardTitle>My Credential</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center p-8 bg-green-50 dark:bg-green-500/10 rounded-xl">
                            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-500/20 grid place-items-center">
                                 <FileCheck2 className="h-8 w-8 mx-auto text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold mt-4">SMSUP+ Verifiable Credential</h3>
                            <p className="text-sm text-muted-foreground mt-1">Your academic identity is secured on-chain. View your public profile.</p>
                            <Button variant="outline" size="sm" asChild className="mt-4">
                                <Link href={`/p/${studentId}`} target="_blank">
                                    View Publicly <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
             <AddTaskDialog
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                onAddTask={handleAddTask}
            />
        </>
    );
}
