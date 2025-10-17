
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Submission, initialSubmissions } from "@/lib/submission-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initialExams, type Exam } from "@/lib/exam-data";
import { Badge } from "@/components/ui/badge";
import { statusIcons, statusStyles } from "@/lib/exam-data";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { recentStudents } from "@/lib/admin-data";


export default function GradingDashboardPage() {
    const [exams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
    const [submissions] = useLocalStorage<Submission[]>("exam-submissions", initialSubmissions);
    const { toast } = useToast();

    // Mock: Filter for the logged-in teacher.
    const mySubjects = ["Mathematics", "Basic Science", "English Language", "History", "Data Processing", "Physics", "Literature in English"];
    const myExams = exams.filter(exam => mySubjects.includes(exam.subject) || exam.class === "JSS 1 - SSS 3");

    const assignmentsToGrade = useMemo(() => {
        return myExams
            .map(exam => {
                const examSubmissions = submissions.filter(s => s.examId === exam.id);
                return {
                    id: exam.id,
                    title: exam.title,
                    class: exam.class,
                    submissions: examSubmissions.length,
                    totalStudents: recentStudents.filter(s => s.class === exam.class).length || 30, // Mock total students
                    dueDate: new Date(exam.date).toLocaleDateString(),
                };
            })
            .filter(a => myExams.find(e => e.id === a.id)?.status !== 'Graded');
    }, [myExams, submissions]);

    return (
        <Tabs defaultValue="assignments">
            <TabsList>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="exams">Examinations</TabsTrigger>
            </TabsList>
            <TabsContent value="assignments" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Grading</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Assignment</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Submissions</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignmentsToGrade.map(a => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.title}</TableCell>
                                        <TableCell>{a.class}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span>{a.submissions}/{a.totalStudents}</span>
                                                <Progress value={(a.submissions / a.totalStudents) * 100} className="w-20 h-2" />
                                            </div>
                                        </TableCell>
                                        <TableCell>{a.dueDate}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" asChild>
                                                <Link href={`/teacher/grading/assignments/${a.id}`}>Grade</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {assignmentsToGrade.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                                            No assignments currently need grading. Great job!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="exams" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Examination Grading</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Examination</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myExams.map((exam) => {
                                    const Icon = statusIcons[exam.status];
                                    return (
                                    <TableRow key={exam.id}>
                                        <TableCell className="font-medium">{exam.title}</TableCell>
                                        <TableCell>{exam.class}</TableCell>
                                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={statusStyles[exam.status]}>
                                                <Icon className="mr-1 h-3 w-3" />
                                                {exam.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant={(exam.status === "Completed") ? "default" : "outline"} 
                                                size="sm"
                                                disabled={exam.status === 'Scheduled' || exam.status === 'Ongoing'}
                                                asChild
                                            >
                                                <Link href={`/teacher/grading/exams/${exam.id}`}>
                                                    {exam.status === 'Graded' ? 'View Results' : 'Enter Grades'}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
