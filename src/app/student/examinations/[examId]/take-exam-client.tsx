
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { initialExams, type Exam, type Question } from '@/lib/exam-data';
import { initialSubmissions, type Submission, type Answer } from '@/lib/submission-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { differenceInSeconds } from 'date-fns';

export default function TakeExamClient({ exam }: { exam: Exam }) {
    const router = useRouter();
    const { toast } = useToast();
    
    const [submissions, setSubmissions] = useLocalStorage<Submission[]>("exam-submissions", initialSubmissions);

    const [submission, setSubmission] = useState<Submission | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    
    // Hardcoded student ID for demo
    const studentId = 'UC-AB-2024';
    const studentName = 'Aisha Bello'; // Mock student name

    // Find the exam and initialize state
    useEffect(() => {
        if (!exam) {
            router.replace('/student/examinations');
            return;
        }

        let studentSubmission = submissions.find(s => s.examId === exam.id && s.studentId === studentId);
        if (!studentSubmission) {
            studentSubmission = {
                id: `sub-${Date.now()}`,
                examId: exam.id,
                studentId: studentId,
                studentName: studentName,
                status: 'in-progress',
                answers: [],
                startedAt: new Date().toISOString()
            };
            setSubmissions(prev => [...prev, studentSubmission!]);
        } else if (studentSubmission.status === 'submitted' || studentSubmission.status === 'graded') {
            toast({ variant: 'destructive', title: 'Exam Already Completed', description: 'You have already submitted this exam.' });
            router.replace('/student/examinations');
            return;
        }

        setSubmission(studentSubmission);
        
        const initialAnswers = studentSubmission.answers.reduce((acc, ans) => {
            acc[ans.questionId] = ans.value;
            return acc;
        }, {} as Record<string, string>);
        setAnswers(initialAnswers);

        if (exam.duration) {
            const startTime = new Date(studentSubmission.startedAt);
            const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);
            const remaining = differenceInSeconds(endTime, new Date());
            setTimeLeft(remaining > 0 ? remaining : 0);
        }

    }, [exam, submissions, setSubmissions, router, toast, studentId, studentName]);

    // Countdown timer
    useEffect(() => {
        if (!exam?.duration || !submission || submission?.status !== 'in-progress') return;

        if (timeLeft <= 0) {
             if (submission?.status === 'in-progress') {
                toast({
                    title: "Time's Up!",
                    description: "Your exam has been automatically submitted.",
                    variant: "destructive",
                });
                handleSubmit(true);
            }
            return;
        };

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, exam, submission]);


    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (autoSubmit = false) => {
        if (!submission || !exam) return;

        const finalAnswers: Answer[] = Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value
        }));

        // --- AUTO-GRADING LOGIC ---
        let autoScore = 0;
        let multiChoiceQuestions = 0;
        exam.questions.forEach(q => {
            if (q.type === 'multiple-choice' && q.correctAnswer) {
                multiChoiceQuestions++;
                const studentAnswer = finalAnswers.find(a => a.questionId === q.id);
                if (studentAnswer?.value.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                    autoScore++;
                }
            }
        });
        
        const mcqWeight = 0.5;
        const scoreFromAutoGrading = multiChoiceQuestions > 0 ? (autoScore / multiChoiceQuestions) * (100 * mcqWeight) : 0;

        setSubmissions(prev => prev.map(s => 
            s.id === submission.id ? { ...s, answers: finalAnswers, status: 'submitted', score: Math.round(scoreFromAutoGrading) } : s
        ));
        
        if (!autoSubmit) {
            toast({
                title: "Exam Submitted",
                description: "Your responses have been saved. Good luck!",
                variant: "success",
            });
            router.push('/student/examinations');
        } else {
            router.replace('/student/examinations');
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (!exam || !submission) {
        return <div>Loading exam...</div>;
    }
    
    if (!exam.questions) {
        return <div>Error: Exam data is corrupted. Questions not found.</div>
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <div>
                            <CardTitle>{exam.title}</CardTitle>
                            <CardDescription>{exam.subject} - {exam.duration} minutes</CardDescription>
                        </div>
                        <div className="text-lg font-mono font-semibold bg-destructive text-destructive-foreground rounded-md px-3 py-1">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    {exam.questions.map((q, index) => (
                        <div key={q.id}>
                            <p className="font-semibold mb-4">{index + 1}. {q.text}</p>
                            {q.type === 'multiple-choice' && q.options && (
                                <RadioGroup
                                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                                    value={answers[q.id] || ''}
                                >
                                    {q.options.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                                            <Label htmlFor={`${q.id}-${i}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                            {q.type === 'theory' && (
                                <Textarea
                                    placeholder="Type your answer here..."
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    rows={6}
                                />
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => setShowConfirmDialog(true)}>Submit Exam</Button>
                </CardFooter>
            </Card>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You cannot make any changes after submitting. Please review your answers before confirming.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleSubmit(false)}>Yes, Submit</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
