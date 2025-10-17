
"use client";
import { notFound, useParams } from "next/navigation";
import * as DataStore from "@/lib/data-store";
import GradeSubmissionClient from "./grade-submission-client";
import { useEffect, useState } from "react";
import type { Exam } from "@/lib/exam-data";
import type { Submission } from "@/lib/submission-data";

export default function GradeStudentSubmissionPage() {
    const params = useParams();
    const assignmentId = params.assignmentId as string;
    const studentId = params.studentId as string;

    const [assignment, setAssignment] = useState<Exam | undefined>(undefined);
    const [submission, setSubmission] = useState<Submission | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [exams, submissions] = await Promise.all([
                DataStore.getExams(),
                DataStore.getSubmissions()
            ]);
            setAssignment(exams.find(a => a.id === assignmentId));
            setSubmission(submissions.find(s => s.examId === assignmentId && s.studentId === studentId));
            setIsLoading(false);
        };
        fetchData();
    }, [assignmentId, studentId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!assignment || !submission) {
        return notFound();
    }
    
    const questionText = assignment?.questions.map(q => q.text).join('\n') || 'Assignment questions';

    return (
       <GradeSubmissionClient 
        assignment={assignment}
        submission={submission}
        questionText={questionText}
       />
    );
}
