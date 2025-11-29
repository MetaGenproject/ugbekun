"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Submission } from "@/lib/submission-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, WandSparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { type Notification, studentNotifications, parentNotifications } from "@/lib/notifications-data";
import { generateFeedback, submitGrade } from "@/ai/flows/teacher-actions";
import { useState, useEffect } from "react";
import { type Exam } from "@/lib/exam-data";

type FormValues = {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    feedback: string;
}

interface GradeSubmissionClientProps {
  assignment: Exam;
  submission: Submission;
  questionText: string;
}

export default function GradeSubmissionClient({ assignment, submission, questionText }: GradeSubmissionClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [, setStudentNotifications] = useLocalStorage<Notification[]>('student-notifications', studentNotifications);
    const [, setParentNotifications] = useLocalStorage<Notification[]>('parent-notifications', parentNotifications);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormValues>();
    
    useEffect(() => {
        if (submission) {
            reset({
                score: submission.score,
                grade: submission.grade as FormValues['grade'],
                feedback: submission.feedback
            })
        }
    }, [submission, reset])
    
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            await submitGrade({
                submissionId: submission.id,
                score: data.score,
                grade: data.grade,
                feedback: data.feedback,
            });

            const studentNotification: Notification = {
                id: Date.now(),
                title: "Grade Published",
                description: `You received a ${data.grade} on '${assignment.title}'.`,
                icon: 'Award',
                read: false,
                href: `/student/grades`
            };
            const parentNotification: Notification = {
                id: Date.now() + 1,
                title: `New Grade for ${submission.studentName}`,
                description: `${submission.studentName} received a ${data.grade} on '${assignment.title}'.`,
                icon: 'Award',
                read: false,
                href: `/parent/grades`
            };

            setStudentNotifications(prev => [studentNotification, ...prev]);
            setParentNotifications(prev => [parentNotification, ...prev]);
            
            toast({
                variant: "success",
                title: "Grade Submitted",
                description: `${submission.studentName}'s grade has been recorded and they have been notified.`,
            });

            router.push(`/teacher/grading/assignments/${assignment.id}`);
            router.refresh(); // Refresh server-side data on the previous page
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Submission Failed", description: "Could not save the grade."});
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleAiGrade = async () => {
        setIsAiGenerating(true);
        const { score, grade } = getValues();
        if (!score || !grade) {
             toast({ variant: "destructive", title: "Score & Grade Required", description: "Please enter a score and grade before using AI assist." });
             setIsAiGenerating(false);
             return;
        }

        toast({ title: "AI Grading in Progress", description: "Please wait while the submission is analyzed." });
        try {
            const result = await generateFeedback({
                studentName: submission.studentName,
                assignmentTitle: assignment.title,
                question: questionText,
                studentAnswer: submission.answers.map(a => `Question: ${a.questionId}\nAnswer: ${a.value}`).join('\n\n'),
                score: score,
                grade: grade
            });

            setValue('feedback', result.feedback);
            
            toast({ variant: "success", title: "AI Feedback Complete", description: "Review the generated feedback." });

        } catch (error) {
            console.error("AI Grading failed", error);
            toast({ variant: "destructive", title: "AI Grading Failed", description: "An error occurred. Please grade manually." });
        } finally {
            setIsAiGenerating(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4"/>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Grading: {submission.studentName}</h1>
                    <p className="text-muted-foreground">{assignment.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student's Answers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {submission.answers.map(ans => (
                                <div key={ans.questionId}>
                                    <p className="font-semibold">Question {ans.questionId.slice(1)}</p>
                                    <p className="text-muted-foreground mt-1 p-4 border rounded-md bg-muted/50">{ans.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Grade</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="score">Score (%)</Label>
                                        <Input id="score" type="number" {...register('score', { required: true, min: 0, max: 100, valueAsNumber: true })} />
                                        {errors.score && <p className="text-xs text-destructive">Score is required.</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="grade">Grade</Label>
                                        <Input id="grade" {...register('grade', { required: true })} />
                                        {errors.grade && <p className="text-xs text-destructive">Grade is required.</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="feedback">Feedback</Label>
                                    <Textarea id="feedback" {...register('feedback')} rows={8} />
                                </div>
                                <Button variant="outline" className="w-full mt-2" type="button" onClick={handleAiGrade} disabled={isAiGenerating || isSubmitting}>
                                    {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4"/>}
                                    {isAiGenerating ? "Generating..." : "Generate Feedback with AI"}
                                </Button>
                                 <Button className="w-full mt-2" disabled={isSubmitting || isAiGenerating}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                    {isSubmitting ? 'Submitting...' : 'Submit Grade'}
                                 </Button>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    )
}
