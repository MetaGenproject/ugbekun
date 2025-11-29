
"use client";

import { useState } from "react";
import { usePlan } from "@/context/plan-context";
import { Lock, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GradeScaleManager } from "@/components/admin-dashboard/report-designer/grade-scale-manager";
import { TraitManager } from "@/components/admin-dashboard/report-designer/trait-manager";
import type { ReportCardData } from '@/lib/report-card-data';
import { initialReportCardData } from '@/lib/report-card-data';
import { ReportCardPreview } from "@/components/admin-dashboard/report-designer/report-card-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AffectiveTrait, GradeScaleItem, PsychomotorSkill } from "@/lib/report-card-settings-data";
import { initialAffectiveTraits, initialGradeScale, initialPsychomotorSkills } from "@/lib/report-card-settings-data";
import { recentStudents } from "@/lib/admin-data";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";


export default function ReportDesignerPage() {
    const { hasFeature, openUpgradeDialog } = usePlan();
    const [reportData, setReportData] = useLocalStorage<ReportCardData>('report-card-data', initialReportCardData);
    const [gradeScaleSettings, setGradeScaleSettings] = useLocalStorage<GradeScaleItem[]>("grade-scale-settings", initialGradeScale);
    const [affectiveTraitsSettings, setAffectiveTraitsSettings] = useLocalStorage<AffectiveTrait[]>("affective-traits-settings", initialAffectiveTraits);
    const [psychomotorSkillsSettings, setPsychomotorSkillsSettings] = useLocalStorage<PsychomotorSkill[]>("psychomotor-skills-settings", initialPsychomotorSkills);

    const { toast } = useToast();
    const student = recentStudents[0];

    const handleFieldChange = (field: keyof ReportCardData, value: any) => {
        setReportData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = () => {
        toast({
            variant: "success",
            title: "Settings Saved",
            description: "Your report card customizations have been saved."
        })
    }

    if (!hasFeature('ADVANCED')) {
        return (
            <div className="h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed bg-muted/50">
                 <div className="h-16 w-16 rounded-full bg-background grid place-items-center mb-4">
                    <Lock className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="font-semibold text-xl">Unlock the Report Card Designer</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">Full customization of report cards is an exclusive feature of the Enterprise plan.</p>
                <Button onClick={() => openUpgradeDialog('ADVANCED')} className="mt-6">Upgrade to Enterprise</Button>
            </div>
        )
    }

    const settingsPanel = (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="px-4">
                    <Accordion type="multiple" defaultValue={['branding']} className="w-full">
                        <AccordionItem value="branding">
                            <AccordionTrigger>School Branding</AccordionTrigger>
                            <AccordionContent>
                               <Card className="border-none shadow-none">
                                    <CardContent className="pt-4 space-y-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="schoolName">School Name</Label>
                                            <Input id="schoolName" value={reportData.schoolName} onChange={e => handleFieldChange('schoolName', e.target.value)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="schoolMotto">School Motto</Label>
                                            <Input id="schoolMotto" value={reportData.schoolMotto} onChange={e => handleFieldChange('schoolMotto', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="schoolAddress">School Address</Label>
                                            <Input id="schoolAddress" value={reportData.schoolAddress} onChange={e => handleFieldChange('schoolAddress', e.target.value)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="schoolContact">School Contact</Label>
                                            <Input id="schoolContact" value={reportData.schoolContact} onChange={e => handleFieldChange('schoolContact', e.target.value)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="reportTitle">Report Title</Label>
                                            <Input id="reportTitle" value={reportData.reportTitle} onChange={e => handleFieldChange('reportTitle', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="logoUrl">School Logo URL</Label>
                                            <Input id="logoUrl" placeholder="https://..." value={reportData.schoolLogoUrl} onChange={e => handleFieldChange('schoolLogoUrl', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="signatureUrl">Signature URL</Label>
                                            <Input id="signatureUrl" placeholder="https://..." value={reportData.headTeacherSignatureUrl} onChange={e => handleFieldChange('headTeacherSignatureUrl', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="grading">
                            <AccordionTrigger>Grading Scale</AccordionTrigger>
                            <AccordionContent>
                               <GradeScaleManager />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="domains">
                             <AccordionTrigger>Domains & Skills</AccordionTrigger>
                            <AccordionContent className="space-y-6">
                                 <TraitManager domain="affective" title="Affective Domain Traits" description="Manage traits related to student behavior and character." />
                                 <TraitManager domain="psychomotor" title="Psychomotor Skills" description="Manage skills related to physical coordination and abilities." />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </ScrollArea>
             <div className="p-4 border-t mt-auto">
                <Button onClick={handleSaveChanges} className="w-full">Save All Changes</Button>
            </div>
        </div>
    );

    return (
        <div className="relative w-full overflow-auto py-8">
             <Drawer>
                <DrawerTrigger asChild>
                    <Button
                        variant="secondary"
                        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-20"
                    >
                        <SlidersHorizontal className="h-6 w-6" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh]">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Report Card Designer</DrawerTitle>
                        <DrawerDescription>Customize your school's report card settings. Changes are previewed live.</DrawerDescription>
                    </DrawerHeader>
                    {settingsPanel}
                </DrawerContent>
            </Drawer>
            <div className="w-full overflow-auto">
                 <div className="w-[800px] mx-auto">
                    <ReportCardPreview 
                        reportData={{
                            ...reportData,
                            gradeScale: gradeScaleSettings,
                            affectiveDomain: affectiveTraitsSettings.map(t => ({...t, value: 4})),
                            psychomotorSkills: psychomotorSkillsSettings.map(s => ({...s, value: 4})),
                        }}
                        student={student}
                        schoolName={reportData.schoolName}
                        schoolMotto={reportData.schoolMotto}
                        schoolAddress={reportData.schoolAddress}
                        schoolContact={reportData.schoolContact}
                        reportTitle={reportData.reportTitle}
                        logoUrl={reportData.schoolLogoUrl}
                        signatureUrl={reportData.headTeacherSignatureUrl}
                    />
                 </div>
            </div>
        </div>
    )
}

    