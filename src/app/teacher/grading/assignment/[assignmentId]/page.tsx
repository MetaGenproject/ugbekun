
"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import Link from "next/link";
import { type Submission } from "@/lib/submission-data";
import { type Exam } from "@/lib/exam-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Student } from "@/lib/admin-data";
import * as DataStore from "@/lib/data-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function GradingSubmissionsPage() {
    const router = useRouter();
    const params = useParams();
    const assignmentId = params.assignmentId as string;
    
    const [exams, setExams] = useState<Exam[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const assignment = useMemo(() => exams.find(a => a.id === assignmentId), [exams, assignmentId]);

    const studentsInClass = useMemo(() => 
        assignment ? students.filter(s => s.class === assignment.class) : [], 
    [students, assignment]);

    const submissionStatusMap = useMemo(() => {
        const map = new Map<string, Submission>();
        submissions.filter(s => s.examId === assignmentId).forEach(sub => {
            map.set(sub.studentId, sub);
        });
        return map;
    }, [submissions, assignmentId]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedExams, fetchedSubmissions, fetchedStudents] = await Promise.all([
                DataStore.getExams(),
                DataStore.getSubmissions(),
                DataStore.getStudents()
            ]);
            setExams(fetchedExams);
            setSubmissions(fetchedSubmissions);
            setStudents(fetchedStudents);
            setIsLoading(false);
        };
        fetchData();
    }, [assignmentId]);

    useEffect(() => {
        if (!isLoading && exams.length > 0 && !assignment) {
            router.replace('/teacher/grading/assignments');
        }
    }, [isLoading, exams, assignment, router]);


    if (isLoading || !assignment) {
        return (
            <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <div>
                        <Skeleton className="h-8 w-48 bg-muted rounded-md animate-pulse"></Skeleton>
                        <Skeleton className="h-4 w-32 bg-muted rounded-md animate-pulse mt-2"></Skeleton>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Submissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 bg-muted rounded-md animate-pulse"></Skeleton>
                    </CardContent>
                </Card>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4"/>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Grade Submissions</h1>
                    <p className="text-muted-foreground">{assignment.title} - {assignment.class}</p>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsInClass.map(student => {
                                const submission = submissionStatusMap.get(student.id);
                                const status = submission ? submission.status : 'Not Submitted';
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={student.avatar} />
                                                    <AvatarFallback>{student.initials}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{student.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{submission ? new Date(submission.startedAt).toLocaleString() : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={status === 'graded' ? 'default' : 'secondary'} className={
                                                status === 'graded' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' :
                                                status === 'submitted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300' : ''
                                            }>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{submission?.score ?? 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" asChild disabled={!submission}>
                                                <Link href={submission ? `/teacher/grading/assignments/${assignment.id}/${student.id}` : '#'}>
                                                    {status === 'graded' ? 'View' : 'Grade'}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

    