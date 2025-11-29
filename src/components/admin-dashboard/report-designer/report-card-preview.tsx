
'use client';

import Image from 'next/image';
import type { ReportCardData } from '@/lib/report-card-settings-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Check } from 'lucide-react';
import type { Student } from '@/lib/admin-data';

interface ReportCardPreviewProps {
    reportData: ReportCardData;
    student?: Student | null;
    schoolName: string;
    schoolMotto: string;
    schoolAddress: string;
    schoolContact: string;
    reportTitle: string;
    logoUrl?: string | null;
    signatureUrl?: string | null;
    aiRemarks?: { classTeacherRemark: string, headTeacherRemark: string } | null;
    isLoadingAi?: boolean;
}

const DEMO_STUDENT: Student = { 
    name: 'Aisha Bello', 
    initials: 'AB', 
    class: 'JSS 1A', 
    avatar: 'https://i.pravatar.cc/120?img=1', 
    id: 'UC-AB-2024',
    dateOfBirth: '2013-05-10',
    gender: 'Female',
    parentName: 'Mr. & Mrs. Bello',
    parentPhone: '08011112222',
    parentEmail: 'bello@example.com',
    address: '12, Freedom Way, Lagos',
    previousSchool: 'Greenfield Primary School',
};

export function ReportCardPreview({
    reportData,
    student,
    schoolName,
    schoolMotto,
    schoolAddress,
    schoolContact,
    reportTitle,
    logoUrl,
    signatureUrl,
    aiRemarks,
    isLoadingAi = false
}: ReportCardPreviewProps) {

    const targetStudent = student || DEMO_STUDENT;

    const { personalData, attendance, performanceSummary, cognitiveData, affectiveDomain, psychomotorSkills, gradeScale, status, nextSessionBegins, reportDate } = reportData;
    
    return (
        <div className="bg-white dark:bg-card text-card-foreground shadow-2xl rounded-lg print:shadow-none print:border font-serif print:text-black min-w-[800px] w-[800px] mx-auto">
            {/* Header */}
            <header className="p-8 border-b border-border/50 flex items-center gap-6 print:p-4">
                 {logoUrl && (
                    <Image src={logoUrl} alt={`${schoolName} logo`} width={80} height={80} className="h-20 w-20 object-contain shrink-0 print:h-16 print:w-16" />
                 )}
                <div className="text-left flex-1">
                    <h1 className="text-3xl font-bold text-primary uppercase tracking-wide print:text-xl">{schoolName}</h1>
                    <p className="text-sm font-medium text-muted-foreground print:text-xs">{schoolMotto}</p>
                    <p className="text-xs text-muted-foreground mt-1 print:text-xs">{schoolAddress}</p>
                    <p className="text-xs text-muted-foreground print:text-xs">{schoolContact}</p>
                </div>
                <div className="ml-auto shrink-0">
                    <div className="h-28 w-28 border-4 border-muted rounded-md overflow-hidden bg-muted/50 print:h-24 print:w-24">
                        <Image src={targetStudent.avatar || `https://i.pravatar.cc/120?u=${targetStudent.id}`} alt={targetStudent.name} width={112} height={112} className="object-cover h-full w-full"/>
                    </div>
                </div>
            </header>

            <div className="p-8 print:p-4">
                <div className="text-center mb-6 border-b-2 border-primary/20 pb-2 print:mb-4">
                    <h2 className="text-lg font-semibold uppercase tracking-wider print:text-sm">{reportTitle}</h2>
                </div>

                {/* Personal Data & Attendance */}
                <div className="grid grid-cols-12 gap-4 text-sm print:text-xs">
                    <div className="col-span-8 grid grid-cols-2 gap-x-4 gap-y-1.5 border p-3 rounded-lg bg-muted/20">
                        <strong className="text-muted-foreground">NAME:</strong> <span className="font-semibold">{personalData.name}</span>
                        <strong className="text-muted-foreground">ADMISSION NO:</strong> <span>{personalData.adminNo}</span>
                        <strong className="text-muted-foreground">GENDER:</strong> <span>{personalData.gender}</span>
                        <strong className="text-muted-foreground">CLASS:</strong> <span>{personalData.class}</span>
                        <strong className="text-muted-foreground">D.O.B:</strong> <span>{personalData.dob}</span>
                        <strong className="text-muted-foreground">CLUB/SOCIETY:</strong> <span>{personalData.club}</span>
                    </div>
                     <div className="col-span-4 space-y-2">
                        <div className="grid grid-cols-3 gap-1 border p-3 rounded-lg text-center bg-muted/20">
                            <div><strong className="block text-muted-foreground text-xs">School Opened</strong><span className="font-semibold">{attendance.schoolOpened}</span></div>
                            <div><strong className="block text-muted-foreground text-xs">Present</strong><span className="font-semibold">{attendance.present}</span></div>
                            <div><strong className="block text-muted-foreground text-xs">Absent</strong><span className="font-semibold">{attendance.absent}</span></div>
                        </div>
                        <div className="border p-3 rounded-lg text-center bg-muted/20">
                            <strong className="block text-muted-foreground text-xs mb-1">Terminal Duration</strong>
                            <div className="flex justify-around">
                                <span>{attendance.termBeginning}</span> - <span>{attendance.termEnding}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Performance Summary */}
                 <div className="mt-4 border p-2 rounded-lg text-sm bg-muted/20 print:text-xs">
                     <h3 className="font-semibold text-center mb-2 uppercase text-xs text-muted-foreground">Performance Summary</h3>
                     <div className="grid grid-cols-6 gap-2 text-center">
                        <div><strong className="block text-muted-foreground text-xs">Total Score</strong><span className="font-semibold">{performanceSummary.totalScoreObtained} / {performanceSummary.totalScoreObtainable}</span></div>
                        <div><strong className="block text-muted-foreground text-xs">%tage</strong><span className="font-semibold">{performanceSummary.percentage}%</span></div>
                        <div><strong className="block text-muted-foreground text-xs">Grade</strong><span className="font-semibold">{performanceSummary.grade}</span></div>
                        <div><strong className="block text-muted-foreground text-xs">Position</strong><span className="font-semibold">{performanceSummary.position}</span></div>
                        <div><strong className="block text-muted-foreground text-xs">Class Size</strong><span className="font-semibold">{performanceSummary.classSize}</span></div>
                        <div><strong className="block text-muted-foreground text-xs">Class Avg.</strong><span className="font-semibold">{performanceSummary.classAverage}%</span></div>
                     </div>
                </div>

                {/* Cognitive Domain */}
                <div className="mt-6 overflow-x-auto">
                    <h3 className="font-semibold mb-2 uppercase text-sm">Cognitive Domain</h3>
                    <table className="w-full text-xs border">
                        <thead className="bg-muted text-muted-foreground">
                            <tr className="text-center">
                                <th rowSpan={2} className="p-1 border-r align-middle text-left w-1/4">Subjects</th>
                                <th colSpan={3} className="p-1 border-b border-r">3rd Term</th>
                                <th colSpan={3} className="p-1 border-b border-r">Session</th>
                                <th colSpan={2} className="p-1 border-b">Summary</th>
                            </tr>
                            <tr className="text-center font-medium">
                                <th className="p-1 border-r">1st CA</th>
                                <th className="p-1 border-r">2nd CA</th>
                                <th className="p-1 border-r">Exam</th>
                                <th className="p-1 border-r">Total</th>
                                <th className="p-1 border-r">Average</th>
                                <th className="p-1 border-r">Grade</th>
                                <th className="p-1 border-r">Position</th>
                                <th className="p-1 border-r">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cognitiveData.map(sub => (
                                <tr key={sub.subject} className="border-t text-center">
                                    <td className="p-1.5 border-r font-medium text-left">{sub.subject}</td>
                                    <td className="p-1.5 border-r">{sub.firstCA}</td>
                                    <td className="p-1.5 border-r">{sub.secondCA}</td>
                                    <td className="p-1.5 border-r">{sub.exam}</td>
                                    <td className="p-1.5 border-r font-semibold">{sub.thirdTerm}</td>
                                    <td className="p-1.5 border-r font-semibold">{sub.sessionAverage}</td>
                                    <td className="p-1.5 border-r">{sub.grade}</td>
                                    <td className="p-1.5 border-r">{sub.subjPosition}</td>
                                    <td className="p-1.5">{sub.remarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Affective & Psychomotor */}
                <div className="mt-6 grid grid-cols-12 gap-6 text-sm print:text-xs">
                    <div className="col-span-4">
                        <h3 className="font-semibold mb-2 uppercase text-sm">Affective Domain</h3>
                        <div className="border rounded-lg">
                           {affectiveDomain.map(trait => (
                                <div key={trait.trait} className="flex justify-between items-center px-2 py-1.5 border-b last:border-b-0">
                                    <span className="text-muted-foreground">{trait.trait}</span>
                                    <div className="flex gap-1.5">
                                        {[5,4,3,2,1].map(val => (
                                            <div key={val} className="h-4 w-4 border grid place-items-center">{trait.value === val && <Check className="h-3 w-3"/>}</div>
                                        ))}
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                     <div className="col-span-4">
                        <h3 className="font-semibold mb-2 uppercase text-sm">Psychomotor Skills</h3>
                         <div className="border rounded-lg">
                           {psychomotorSkills.map(skill => (
                                <div key={skill.skill} className="flex justify-between items-center px-2 py-1.5 border-b last:border-b-0">
                                    <span className="text-muted-foreground">{skill.skill}</span>
                                    <div className="flex gap-1.5">
                                        {[5,4,3,2,1].map(val => (
                                            <div key={val} className="h-4 w-4 border grid place-items-center">{skill.value === val && <Check className="h-3 w-3"/>}</div>
                                        ))}
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                     <div className="col-span-4">
                        <h3 className="font-semibold mb-2 uppercase text-sm">Grade Scale</h3>
                         <div className="border rounded-lg">
                            {gradeScale.map(scale => (
                                 <div key={scale.grade} className="flex justify-between items-center px-2 py-1.5 border-b last:border-b-0">
                                    <span className="font-semibold w-8">{scale.grade}</span>
                                    <span className="text-muted-foreground w-20">{scale.rangeStart}-{scale.rangeEnd}</span>
                                    <span className="text-muted-foreground text-right flex-1">{scale.remark}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* Remarks & Signature */}
                <div className="mt-8 text-sm space-y-4">
                    <div className="p-3 border rounded-lg bg-muted/30 min-h-[6rem]">
                        <strong className="text-muted-foreground">Class Teacher's Remark:</strong>
                         {isLoadingAi ? (
                            <div className="space-y-2 mt-1">
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                         ) : (
                            <p className="italic">{aiRemarks?.classTeacherRemark || reportData.classTeacherRemark}</p>
                         )}
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/30 min-h-[4rem]">
                        <strong className="text-muted-foreground">Head Teacher's Remark:</strong>
                         {isLoadingAi ? (
                             <Skeleton className="h-4 w-1/2 mt-1" />
                         ) : (
                            <p className="italic">{aiRemarks?.headTeacherRemark || reportData.headTeacherRemark}</p>
                         )}
                    </div>
                </div>

                <div className="mt-12 flex justify-between items-end text-sm print:text-xs">
                    <div>
                        <p><strong>Status:</strong> <span className="font-semibold text-green-600">{status}</span></p>
                        <p><strong>Next Session Begins:</strong> {nextSessionBegins}</p>
                    </div>
                     <div className="text-center">
                        <div className="w-32 h-16 mx-auto relative">
                           {signatureUrl && <Image src={signatureUrl} alt="Head Teacher's Signature" fill style={{objectFit:"contain"}} />}
                        </div>
                        <p className="border-t mt-1 pt-1 text-xs">Head Teacher's Signature</p>
                    </div>
                </div>
            </div>
             <div className="text-center text-xs text-muted-foreground py-2 border-t mt-4 bg-muted/20 rounded-b-lg print:bg-gray-100">
                Powered by Ugbekun
            </div>
        </div>
    );
}