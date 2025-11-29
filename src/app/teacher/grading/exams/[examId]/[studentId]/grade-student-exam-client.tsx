
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Submission, initialSubmissions } from "@/lib/submission-data";
import { type Exam, initialExams } from "@/lib/exam-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, WandSparkles, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { type Notification, studentNotifications, parentNotifications } from "@/lib/notifications-data";
import { generateFeedback } from "@/ai/flows/teacher-actions";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type FormValues = {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    feedback: string;
}

interface GradeStudentExamPageClientProps {
    exam: Exam;
    submission: Submission;
}

export default function GradeStudentExamPageClient({ exam, submission }: GradeStudentExamPageClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [, setExams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
    const [submissions, setSubmissions] = useLocalStorage<Submission[]>("exam-submissions", initialSubmissions);
    const [, setStudentNotifications] = useLocalStorage<Notification[]>('student-notifications', studentNotifications);
    const [, setParentNotifications] = useLocalStorage<Notification[]>('parent-notifications', parentNotifications);
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<FormValues>();
    
    useEffect(() => {
        if (submission) {
            reset({
                score: submission.score || 0,
                grade: (submission.grade as FormValues['grade']) || 'F',
                feedback: submission.feedback || '',
            });
        }
    }, [submission, reset]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const updatedSubmission = { ...submission, ...data, status: 'graded' as const };
        
        setSubmissions(prev => {
            const updated = prev.map(s => s.id === submission.id ? updatedSubmission : s);
            const allSubmissionsForExam = updated.filter(s => s.examId === exam.id);
            const allGraded = allSubmissionsForExam.every(s => s.status === 'graded');

            if (allGraded) {
                setExams(prevExams => prevExams.map(e => e.id === exam.id ? { ...e, status: 'Completed' } : e));
                toast({ title: "All Graded!", description: `All submissions for ${exam.title} have been graded.`});
            }
            return updated;
        });

        toast({
            variant: "success",
            title: "Grade Submitted",
            description: `${submission.studentName}'s grade has been recorded.`,
        });

        router.push(`/teacher/grading/exams/${exam.id}`);
    };

    const handleGenerateFeedback = async () => {
        setIsAiGenerating(true);
        toast({ title: "AI Assistant is thinking...", description: "Generating feedback suggestion..." });
        
        const currentValues = getValues();
        if (currentValues.score === undefined || !currentValues.grade) {
             toast({ variant: "destructive", title: "Missing Information", description: "Please enter a score and grade before generating feedback." });
             setIsAiGenerating(false);
             return;
        }

        try {
            const result = await generateFeedback({
                studentName: submission.studentName,
                assignmentTitle: exam.title,
                question: "This exam had multiple questions. Please review the student's answers and provide overall feedback based on the rubric.",
                studentAnswer: submission.answers.map(a => `Question: ${exam.questions.find(q=>q.id === a.questionId)?.text}\nAnswer: ${a.value}`).join('\n\n'),
                score: currentValues.score,
                grade: currentValues.grade
            });

            setValue('feedback', result.feedback);
            toast({ variant: "success", title: "Feedback Generated", description: "The AI's suggestion has been added to the feedback box." });

        } catch (error) {
            console.error("AI Feedback generation failed", error);
            toast({ variant: "destructive", title: "AI Failed", description: "An error occurred. Please write feedback manually." });
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
                    <h1 className="text-2xl font-bold tracking-tight capitalize">Grading: {submission.studentName}</h1>
                    <p className="text-muted-foreground">{exam.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student's Answers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {exam.questions && exam.questions.length > 0 ? submission.answers.map((ans, index) => {
                                const question = exam.questions.find(q => q.id === ans.questionId);
                                if (!question) return null;
                                const isCorrect = question.type === 'multiple-choice' && ans.value === question.correctAnswer;
                                return (
                                <div key={ans.questionId}>
                                    <div className="flex items-start justify-between">
                                        <p className="font-semibold">{index + 1}. {question.text}</p>
                                         {question.type === 'multiple-choice' && (
                                            isCorrect 
                                                ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0"/> 
                                                : <XCircle className="h-5 w-5 text-destructive shrink-0"/>
                                         )}
                                    </div>
                                    <p className={cn(
                                        "text-muted-foreground mt-2 p-3 border rounded-md bg-muted/50",
                                        question.type === 'multiple-choice' && isCorrect && "border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-300",
                                        question.type === 'multiple-choice' && !isCorrect && "border-destructive/30 bg-destructive/10 text-destructive"
                                    )}>
                                        {ans.value}
                                    </p>
                                     {question.type === 'multiple-choice' && !isCorrect && (
                                        <p className="text-xs text-green-600 mt-1 pl-1">Correct answer: {question.correctAnswer}</p>
                                    )}
                                </div>
                            )}) : <p className="text-muted-foreground text-center py-8">No questions found for this exam.</p>}
                             {submission.answers.length === 0 && <p className="text-muted-foreground text-center py-8">This student did not submit any answers.</p>}
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
                                        <Label htmlFor="score">Final Score (%)</Label>
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
                                     <div className="flex justify-between items-center">
                                        <Label htmlFor="feedback">Feedback</Label>
                                        <Button variant="outline" size="sm" type="button" onClick={handleGenerateFeedback} disabled={isAiGenerating} className="h-7">
                                            {isAiGenerating ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <WandSparkles className="mr-2 h-3 w-3"/>}
                                            AI Assist
                                        </Button>
                                    </div>
                                    <Textarea id="feedback" {...register('feedback')} rows={8} />
                                </div>
                                <Button className="w-full mt-2">
                                    <Check className="mr-2 h-4 w-4"/> Submit Final Grade
                                </Button>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    )
}
