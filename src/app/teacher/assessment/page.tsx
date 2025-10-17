
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import * as DataStore from '@/lib/data-store';
import type { Staff, Student, AffectiveTrait, PsychomotorSkill } from '@/lib/types';

export default function AssessmentPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [affectiveTraits, setAffectiveTraits] = useState<AffectiveTrait[]>([]);
    const [psychomotorSkills, setPsychomotorSkills] = useState<PsychomotorSkill[]>([]);
    const [assessments, setAssessments] = useState<Record<string, any>>({});
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    
    // Mock teacher login
    const loggedInTeacherName = "Mr. Adebayo";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [staffData, studentData, affectiveData, psychomotorData, assessmentData] = await Promise.all([
                DataStore.getStaff(),
                DataStore.getStudents(),
                DataStore.getAffectiveTraitsSettings(),
                DataStore.getPsychomotorSkillsSettings(),
                DataStore.getStudentAssessments(),
            ]);
            setStaff(staffData);
            setStudents(studentData);
            setAffectiveTraits(affectiveData);
            setPsychomotorSkills(psychomotorData);
            setAssessments(assessmentData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const myClasses = useMemo(() => {
        const teacher = staff.find(s => s.name === loggedInTeacherName);
        return teacher ? teacher.assignedClasses : [];
    }, [staff, loggedInTeacherName]);
    
    const [selectedClass, setSelectedClass] = useState<string | undefined>(myClasses[0]?.class);
    
    useEffect(() => {
        if (myClasses.length > 0 && !selectedClass) {
            setSelectedClass(myClasses[0].class);
        }
    }, [myClasses, selectedClass]);

    const studentsInClass = useMemo(() => 
        selectedClass ? students.filter(s => s.class === selectedClass) : [],
        [students, selectedClass]
    );

    const handleRatingChange = (studentId: string, domain: 'affective' | 'psychomotor', traitId: string, value: number) => {
        if (!selectedClass) return;

        setAssessments(prev => {
            const newAssessments = JSON.parse(JSON.stringify(prev));
            if (!newAssessments[selectedClass]) newAssessments[selectedClass] = [];
            
            let studentAssessment = newAssessments[selectedClass].find((a: any) => a.studentId === studentId);
            
            if (!studentAssessment) {
                studentAssessment = { studentId, affective: {}, psychomotor: {} };
                newAssessments[selectedClass].push(studentAssessment);
            }

            if (domain === 'affective') {
                studentAssessment.affective[traitId] = value;
            } else {
                studentAssessment.psychomotor[traitId] = value;
            }

            return newAssessments;
        });
    };

    const handleSave = async () => {
        await DataStore.saveStudentAssessments(assessments);
        toast({
            variant: "success",
            title: "Assessments Saved",
            description: `Behavioral and skills ratings for ${selectedClass} have been updated.`
        });
    };

    const getStudentAssessment = (studentId: string) => {
        if (!selectedClass) return { affective: {}, psychomotor: {} };
        return assessments[selectedClass]?.find((a: any) => a.studentId === studentId) || { affective: {}, psychomotor: {} };
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Student Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <Select onValueChange={setSelectedClass} value={selectedClass}>
                            <SelectTrigger className="w-full sm:w-[240px]">
                            <SelectValue placeholder="Select a class..." />
                            </SelectTrigger>
                            <SelectContent>
                            {myClasses.map(cls => (
                                <SelectItem key={cls.class} value={cls.class}>
                                {cls.class}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                         <Button onClick={handleSave} disabled={!selectedClass}>
                            <Save className="mr-2 h-4 w-4" /> Save All Changes
                        </Button>
                    </div>

                    {selectedClass && studentsInClass.map(student => {
                        const studentData = getStudentAssessment(student.id);
                        return (
                            <Card key={student.id} className="mb-4">
                                <CardHeader className="flex flex-row items-center gap-4 bg-muted/50">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={student.avatar} />
                                        <AvatarFallback>{student.initials}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold">{student.name}</h3>
                                </CardHeader>
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                     <div>
                                        <h4 className="font-medium text-sm mb-3">Affective Domain</h4>
                                        <div className="space-y-4">
                                            {affectiveTraits.map(trait => (
                                                <div key={trait.id} className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <Label>{trait.trait}</Label>
                                                        <span className="font-semibold text-primary">{studentData.affective[trait.id] || 'N/A'}</span>
                                                    </div>
                                                    <Slider
                                                        defaultValue={[studentData.affective[trait.id] || 3]}
                                                        max={5}
                                                        min={1}
                                                        step={1}
                                                        onValueChange={(value) => handleRatingChange(student.id, 'affective', trait.id, value[0])}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm mb-3">Psychomotor Skills</h4>
                                         <div className="space-y-4">
                                            {psychomotorSkills.map(skill => (
                                                <div key={skill.id} className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <Label>{skill.skill}</Label>
                                                         <span className="font-semibold text-primary">{studentData.psychomotor[skill.id] || 'N/A'}</span>
                                                    </div>
                                                    <Slider
                                                         defaultValue={[studentData.psychomotor[skill.id] || 3]}
                                                        max={5}
                                                        min={1}
                                                        step={1}
                                                        onValueChange={(value) => handleRatingChange(student.id, 'psychomotor', skill.id, value[0])}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {selectedClass && studentsInClass.length === 0 && (
                        <div className="text-center text-muted-foreground py-12">
                            No students found in this class.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

    