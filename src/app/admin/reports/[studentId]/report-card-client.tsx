
"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReportCardPreview } from "@/components/admin-dashboard/report-designer/report-card-preview";
import { Button } from "@/components/ui/button";
import { WandSparkles, Printer, Share2, Loader2, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateComprehensiveReport } from "@/ai/flows/generate-comprehensive-report";
import { generateReportCardData } from "@/lib/results-engine";
import type { ReportCardData, GradeScaleItem, AffectiveTrait, PsychomotorSkill } from "@/lib/report-card-settings-data";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Student } from "@/lib/admin-data";
import React from 'react';
import type { ClassResults } from "@/lib/results-data";


interface AdminReportCardClientProps {
    student: Student;
    designerData: ReportCardData;
    gradeScaleSettings: GradeScaleItem[];
    affectiveTraitsSettings: AffectiveTrait[];
    psychomotorSkillsSettings: PsychomotorSkill[];
    classResults: ClassResults;
}

function AdminReportCardClientInternal({ student, designerData, gradeScaleSettings, affectiveTraitsSettings, psychomotorSkillsSettings, classResults }: AdminReportCardClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const isPreview = searchParams.get('preview') === 'true';

    const [aiRemarks, setAiRemarks] = useState<{classTeacherRemark: string, headTeacherRemark: string} | null>(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    
    // This generates the final, calculated report card data
    const finalReportData = useMemo(() => {
        const studentClassResults = classResults[student.class] || {};
        const studentSubjectResults = Object.keys(studentClassResults).flatMap(subjectId => 
            studentClassResults[subjectId].filter(r => r.studentId === student.id)
        );
            
        return generateReportCardData(student.name, {
            ...designerData,
            gradeScale: gradeScaleSettings,
            affectiveDomain: affectiveTraitsSettings.map(t => ({...t, value: (Math.floor(Math.random() * 3) + 3) as (3|4|5) })),
            psychomotorSkills: psychomotorSkillsSettings.map(s => ({...s, value: (Math.floor(Math.random() * 3) + 3) as (3|4|5) })),
        }, studentSubjectResults);
    }, [student, designerData, gradeScaleSettings, affectiveTraitsSettings, psychomotorSkillsSettings, classResults]);
    
    const handleGenerateRemarks = async () => {
        setIsLoadingAi(true);
        setAiRemarks(null);
        toast({ title: "Generating AI Remarks...", description: "Please wait while the AI analyzes the student's performance." });
        
        try {
            const result = await generateComprehensiveReport({ reportData: finalReportData });
            if (result) {
                setAiRemarks(result);
                toast({ variant: "success", title: "Remarks Generated!", description: "The AI-powered remarks have been added to the report card." });
            } else {
                 throw new Error("AI returned no output.");
            }
        } catch (error) {
            console.error("AI remark generation failed:", error);
            toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate AI remarks at this time." });
        } finally {
            setIsLoadingAi(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    }
    
    const reportCardComponent = (
         <div className="w-full overflow-auto">
             <div className="w-[800px] mx-auto">
                <ReportCardPreview 
                    reportData={finalReportData}
                    student={student}
                    schoolName={designerData.schoolName}
                    schoolMotto={designerData.schoolMotto}
                    schoolAddress={designerData.schoolAddress}
                    schoolContact={designerData.schoolContact}
                    reportTitle={designerData.reportTitle}
                    logoUrl={designerData.schoolLogoUrl}
                    signatureUrl={designerData.headTeacherSignatureUrl}
                    aiRemarks={aiRemarks}
                    isLoadingAi={isLoadingAi}
                />
            </div>
        </div>
    );

    if (isPreview) {
        return (
             <div className="bg-background p-4 print:p-0">
                 {reportCardComponent}
             </div>
        );
    }
    
    return (
        <div className="space-y-6 print:space-y-0">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Report Card: {student.name}</h1>
                        <p className="text-muted-foreground">Class: {student.class}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Button onClick={handleGenerateRemarks} disabled={isLoadingAi}>
                        {isLoadingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
                        {isLoadingAi ? 'Generating...' : 'Generate AI Remarks'}
                    </Button>
                    <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print/PDF</Button>
                    <Button variant="outline" onClick={() => toast({description: "Sharing options coming soon."})}><Share2 className="mr-2 h-4 w-4"/>Share</Button>
                </div>
            </div>
            {reportCardComponent}
        </div>
    );
}

export default function AdminReportCardClient(props: AdminReportCardClientProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminReportCardClientInternal {...props} />
        </Suspense>
    )
}
