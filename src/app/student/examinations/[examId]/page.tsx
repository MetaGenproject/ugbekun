
"use client";
import { notFound, useParams } from "next/navigation";
import * as DataStore from "@/lib/data-store";
import TakeExamClient from "./take-exam-client";
import { useEffect, useState } from "react";
import type { Exam } from "@/lib/exam-data";

export default function TakeExamPage() {
    const params = useParams();
    const examId = params.examId as string;
    const [exam, setExam] = useState<Exam | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExam = async () => {
            const exams = await DataStore.getExams();
            setExam(exams.find(e => e.id === examId));
            setIsLoading(false);
        };
        fetchExam();
    }, [examId]);

    if (isLoading) {
        return <div>Loading Exam...</div>;
    }

    if (!exam) {
        return notFound();
    }
    
    return <TakeExamClient exam={exam} />;
}
