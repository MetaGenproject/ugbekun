
"use client";

import { useRouter } from 'next/navigation';
import { type Exam, type Question } from '@/lib/exam-data';
import { type Submission } from '@/lib/submission-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function QuestionResult({ question, answer }: { question: Question, answer?: string }) {
    const isCorrect = question.type === 'multiple-choice' ? answer === question.correctAnswer : undefined;
    
    return (
        <div className="p-4 border rounded-lg bg-card">
            <p className="font-semibold">{question.text}</p>
            <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-28 shrink-0">Your Answer:</span>
                    <p className={cn(
                        "text-sm font-medium", 
                        isCorrect === false && "text-destructive",
                        isCorrect === true && "text-green-600"
                    )}>
                        {answer || "Not answered"}
                    </p>
                </div>
                 {question.type === 'multiple-choice' && (
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-28 shrink-0">Correct Answer:</span>
                        <p className="text-sm font-medium text-green-600">{question.correctAnswer}</p>
                    </div>
                 )}
                 <div className="flex items-start gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-28 shrink-0">Status:</span>
                    {isCorrect === true && (
                        <span className="flex items-center text-sm text-green-600 font-semibold"><CheckCircle className="mr-2 h-4 w-4" /> Correct</span>
                    )}
                    {isCorrect === false && (
                        <span className="flex items-center text-sm text-destructive font-semibold"><XCircle className="mr-2 h-4 w-4" /> Incorrect</span>
                    )}
                     {isCorrect === undefined && (
                        <span className="flex items-center text-sm text-blue-600 font-semibold"><Info className="mr-2 h-4 w-4" /> Graded by Teacher</span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface ExamResultsClientProps {
    exam: Exam;
    submission: Submission;
}

export default function ExamResultsClient({ exam, submission }: ExamResultsClientProps) {
    const router = useRouter();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Results: {exam.title}</CardTitle>
                            <CardDescription>{exam.subject}</CardDescription>
                        </div>
                        <div className="text-right">
                             <div className="text-sm text-muted-foreground">Your Score</div>
                             <div className="text-3xl font-bold text-primary">{submission.score}%</div>
                             <div className="text-lg font-semibold text-primary">{submission.grade}</div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Feedback from Teacher</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Teacher's Remarks</AlertTitle>
                        <AlertDescription>
                            <p className="prose prose-sm dark:prose-invert">{submission.feedback || "No feedback provided."}</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                     <CardTitle>Question Breakdown</CardTitle>
                     <CardDescription>Review your answers and the correct solutions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {exam.questions.map(q => (
                        <QuestionResult 
                            key={q.id} 
                            question={q} 
                            answer={submission.answers.find(a => a.questionId === q.id)?.value} 
                        />
                    ))}
                    {exam.questions.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            Question breakdown is not available for this exam.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
