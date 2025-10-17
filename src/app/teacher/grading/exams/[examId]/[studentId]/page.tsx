
"use client";
import { notFound, useParams } from "next/navigation";
import * as DataStore from "@/lib/data-store";
import GradeStudentExamPageClient from "./grade-student-exam-client"; // Assuming you'll create this
import { useEffect, useState } from "react";
import { type Exam } from "@/lib/exam-data";
import { type Submission } from "@/lib/submission-data";

export default function GradeStudentExamPage() {
    const params = useParams();
    const examId = params.examId as string;
    const studentId = params.studentId as string;

    const [exam, setExam] = useState<Exam | undefined>(undefined);
    const [submission, setSubmission] = useState<Submission | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [exams, submissions] = await Promise.all([
                DataStore.getExams(),
                DataStore.getSubmissions()
            ]);

            setExam(exams.find(e => e.id === examId));
            setSubmission(submissions.find(s => s.examId === examId && s.studentId === studentId));
            setIsLoading(false);
        };
        fetchData();
    }, [examId, studentId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!exam || !submission) {
        return notFound();
    }
    
    return (
       <GradeStudentExamPageClient 
        exam={exam}
        submission={submission}
       />
    );
}
