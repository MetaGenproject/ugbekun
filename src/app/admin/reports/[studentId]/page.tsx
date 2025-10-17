
"use client";

import * as DataStore from "@/lib/data-store";
import AdminReportCardClient from "./report-card-client";
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import type { ReportCardData, GradeScaleItem, AffectiveTrait, PsychomotorSkill } from "@/lib/report-card-settings-data";
import type { Student } from "@/lib/admin-data";
import type { ClassResults } from "@/lib/results-data";

export default function AdminReportCardPage() {
    const params = useParams();
    const studentId = params.studentId as string;
    
    const [studentData, setStudentData] = useState<Student | undefined>(undefined);
    const [designerData, setDesignerData] = useState<ReportCardData | null>(null);
    const [gradeScale, setGradeScale] = useState<GradeScaleItem[]>([]);
    const [affectiveTraits, setAffectiveTraits] = useState<AffectiveTrait[]>([]);
    const [psychomotorSkills, setPsychomotorSkills] = useState<PsychomotorSkill[]>([]);
    const [classResults, setClassResults] = useState<ClassResults>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const students = await DataStore.getStudents();
            const student = students.find(s => s.id === studentId);
            
            if (!student) {
                setIsLoading(false);
                return;
            }

            setStudentData(student);

            const [
                fetchedDesignerData, 
                fetchedGradeScale, 
                fetchedAffective, 
                fetchedPsychomotor,
                fetchedResults,
            ] = await Promise.all([
                DataStore.getReportCardData(),
                DataStore.getGradeScaleSettings(),
                DataStore.getAffectiveTraitsSettings(),
                DataStore.getPsychomotorSkillsSettings(),
                DataStore.getResults(),
            ]);

            // Add subjects from data store to the designer data
            const allSubjects = await DataStore.getSubjects();
            fetchedDesignerData.cognitiveData = allSubjects.map(s => ({
                subject: s.name,
                id: s.id, // Pass subject ID for matching with results
            })) as any;

            setDesignerData(fetchedDesignerData);
            setGradeScale(fetchedGradeScale);
            setAffectiveTraits(fetchedAffective);
            setPsychomotorSkills(fetchedPsychomotor);
            setClassResults(fetchedResults);

            setIsLoading(false);
        };

        fetchData();
    }, [studentId]);

    if (isLoading) {
        return <div>Loading report card...</div>;
    }

    if (!studentData || !designerData) {
        return notFound();
    }
    
    return (
        <AdminReportCardClient
            student={studentData}
            designerData={designerData}
            gradeScaleSettings={gradeScale}
            affectiveTraitsSettings={affectiveTraits}
            psychomotorSkillsSettings={psychomotorSkills}
            classResults={classResults}
        />
    );
}
