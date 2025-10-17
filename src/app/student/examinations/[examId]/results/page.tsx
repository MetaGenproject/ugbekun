
"use client";
import { notFound, useParams } from "next/navigation";
import * as DataStore from "@/lib/data-store";
import ExamResultsClient from "./exam-results-client";
import { useEffect, useState } from "react";
import type { Exam } from "@/lib/exam-data";
import type { Submission } from "@/lib/submission-data";

export default function ExamResultsPage() {
    const params = useParams();
    const examId = params.examId as string;
    const studentId = 'UC-AB-2024'; // Mock logged-in student ID for demo

    const [exam, setExam] = useState<Exam | undefined>(undefined);
    const [submission, setSubmission] = useState<Submission | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [exams, submissions] = await Promise.all([
                DataStore.getExams(),
                DataStore.getSubmissions()
            ]);

            const currentExam = exams.find(e => e.id === examId);
            const currentSubmission = submissions.find(s => s.examId === examId && s.studentId === studentId);
            
            setExam(currentExam);
            setSubmission(currentSubmission);
            setIsLoading(false);
        };
        fetchData();
    }, [examId, studentId]);

    if (isLoading) {
        return <div>Loading results...</div>;
    }

    if (!exam || !submission || submission.status !== 'graded') {
        return notFound();
    }

    return <ExamResultsClient exam={exam} submission={submission} />;
}
