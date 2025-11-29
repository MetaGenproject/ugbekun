
"use client";

import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { type Exam } from "@/lib/exam-data";
import { type Submission } from "@/lib/submission-data";
import * as DataStore from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@/lib/notifications-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Student } from "@/lib/admin-data";
import { Skeleton } from "@/components/ui/skeleton";
import { statusIcons, statusStyles } from "@/lib/exam-data";


export default function ExamGradingPage() {
    const router = useRouter();
    const params = useParams();
    const examId = params.examId as string;
    const { toast } = useToast();
    
    const [exams, setExams] = useLocalStorage<Exam[]>("examinations-list", []);
    const [submissions] = useLocalStorage<Submission[]>("exam-submissions", []);
    const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [, setStudentNotifications] = useLocalStorage<Notification[]>('student-notifications', []);
    const [, setParentNotifications] = useLocalStorage<Notification[]>('parent-notifications', []);

    const exam = useMemo(() => exams.find(e => e.id === examId), [exams, examId]);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedExams, allStudents] = await Promise.all([
                DataStore.getExams(),
                DataStore.getStudents()
            ]);
            
            setExams(fetchedExams);
            
            const currentExam = fetchedExams.find(e => e.id === examId);
            if (currentExam) {
                setStudentsInClass(allStudents.filter(s => s.class === currentExam.class));
            }

            setIsLoading(false);
        };
        fetchData();
    }, [examId, setExams]);

    if (!exam && !isLoading) {
        return notFound();
    }
    
    const examSubmissions = submissions.filter(s => s.examId === examId);
    
    const handlePublishAll = async () => {
        if (!exam) return;
        const allGraded = studentsInClass.length > 0 && examSubmissions.length === studentsInClass.length && examSubmissions.every(s => s.status === 'graded');
        if (exam.status !== 'Completed' || !allGraded) {
            toast({ variant: 'destructive', title: 'Cannot Publish', description: 'Grades can only be published for completed exams where all submissions are graded.'});
            return;
        };

        const updatedExams = exams.map(e => e.id === exam.id ? {...e, status: 'Graded' } : e)
        setExams(updatedExams);
        await DataStore.saveExams(updatedExams); // Persist change
        
        toast({
        variant: 'success',
        title: "Grades Published",
        description: `Students and parents can now view the results for ${exam.title}.`,
        });

        const studentNotification: Notification = { id: Date.now(), title: "Result Published", description: `Your result for '${exam.title}' is now available.`, icon: 'Award', read: false, href: `/student/examinations/${exam.id}/results` };
        const parentNotification: Notification = { id: Date.now() + 1, title: `New Result for Maya`, description: `Maya's result for '${exam.title}' is available.`, icon: 'Award', read: false, href: `/parent/examinations` };
        setStudentNotifications(prev => [studentNotification, ...prev]);
        setParentNotifications(prev => [parentNotification, ...prev]);
    }
    
    if (isLoading || !exam) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <div>
                        <Skeleton className="h-7 w-48 mb-2" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-64" />
                        <Skeleton className="h-5 w-80 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const allGraded = studentsInClass.length > 0 && examSubmissions.length === studentsInClass.length && examSubmissions.every(s => s.status === 'graded');

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Grade Submissions</h1>
                        <p className="text-muted-foreground">{exam.title} - {exam.class}</p>
                    </div>
                </div>
                 {allGraded && exam.status === 'Completed' && (
                    <Button onClick={handlePublishAll}>Publish All Grades</Button>
                 )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Submissions for {exam.title}</CardTitle>
                    <CardDescription>Review and grade each student's submission for this examination.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Auto-Score</TableHead>
                                <TableHead>Final Score</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsInClass.map(student => {
                                const submission = examSubmissions.find(s => s.studentId === student.id);
                                const status = submission?.status || 'Not Submitted';
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium capitalize">{student.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={status === 'graded' ? 'default' : 'secondary'} className={status === 'graded' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'}>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{submission?.score ?? 'N/A'}</TableCell>
                                        <TableCell className="font-semibold">{status === 'graded' ? submission?.score : 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" asChild disabled={!submission}>
                                                <Link href={submission ? `/teacher/grading/exams/${exam.id}/${student.id}` : '#'}>
                                                    {status === 'graded' ? 'View/Edit' : 'Grade'}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                             {studentsInClass.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No students found in this class.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
