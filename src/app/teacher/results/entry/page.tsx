
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import * as DataStore from "@/lib/data-store";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Staff } from "@/lib/hr-data";
import type { Student } from "@/lib/admin-data";
import type { Subject } from "@/lib/school-data";
import type { ClassResults } from "@/lib/results-data";

export default function ResultsEntryPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [results, setResults] = useLocalStorage<ClassResults>("student-results", {});
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Mock teacher login
    const loggedInTeacherName = "Mr. Adebayo";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedStaff, fetchedStudents, fetchedSubjects] = await Promise.all([
                DataStore.getStaff(),
                DataStore.getStudents(),
                DataStore.getSubjects(),
            ]);
            setStaff(fetchedStaff);
            setStudents(fetchedStudents);
            setSubjects(fetchedSubjects);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const myClasses = useMemo(() => {
        const teacher = staff.find(s => s.name === loggedInTeacherName);
        if (!teacher) return [];
        return Array.from(new Set(teacher.assignedClasses.map(c => c.class)));
    }, [staff, loggedInTeacherName]);

    const [selectedClass, setSelectedClass] = useState<string | undefined>(myClasses[0]);
    const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
    
    useEffect(() => {
        if(myClasses.length > 0 && !selectedClass) {
            setSelectedClass(myClasses[0])
        }
    }, [myClasses, selectedClass])

    const subjectsInClass = useMemo(() => {
        const teacher = staff.find(s => s.name === loggedInTeacherName);
        if (!teacher || !selectedClass) return [];
        const subjectNames = teacher.assignedClasses
            .filter(ac => ac.class === selectedClass)
            .map(ac => ac.subject);
        return subjects.filter(s => subjectNames.includes(s.name));
    }, [staff, selectedClass, subjects, loggedInTeacherName]);

    useEffect(() => {
        if(subjectsInClass.length > 0 && !selectedSubject) {
            setSelectedSubject(subjectsInClass[0].id)
        }
    }, [subjectsInClass, selectedSubject])

    const studentsInClass = useMemo(() => 
        selectedClass ? students.filter(s => s.class === selectedClass) : [],
        [students, selectedClass]
    );

    const handleScoreChange = (studentId: string, assessment: 'firstCA' | 'secondCA' | 'exam', value: string) => {
        if (!selectedClass || !selectedSubject) return;

        const score = value === '' ? undefined : parseInt(value, 10);
        
        setResults(prev => {
            const newResults = { ...prev };
            if (!newResults[selectedClass]) newResults[selectedClass] = {};
            if (!newResults[selectedClass][selectedSubject]) newResults[selectedClass][selectedSubject] = [];

            const studentResults = newResults[selectedClass][selectedSubject];
            const studentIndex = studentResults.findIndex(r => r.studentId === studentId);
            
            let updatedStudentResult;
            if (studentIndex > -1) {
                updatedStudentResult = { ...studentResults[studentIndex], [assessment]: score };
            } else {
                updatedStudentResult = { studentId, subjectId: selectedSubject, [assessment]: score };
            }

            // Recalculate total
            const { firstCA = 0, secondCA = 0, exam = 0 } = updatedStudentResult;
            updatedStudentResult.total = firstCA + secondCA + exam;

            if (studentIndex > -1) {
                studentResults[studentIndex] = updatedStudentResult;
            } else {
                studentResults.push(updatedStudentResult);
            }

            return newResults;
        });
    };

    const getScore = (studentId: string, assessment: 'firstCA' | 'secondCA' | 'exam' | 'total') => {
        if (!selectedClass || !selectedSubject) return '';
        const score = results[selectedClass]?.[selectedSubject]?.find(r => r.studentId === studentId)?.[assessment];
        return score === undefined ? '' : score;
    };
    
    const handleSaveChanges = () => {
        toast({
            variant: "success",
            title: "Results Saved",
            description: `Scores for ${subjects.find(s => s.id === selectedSubject)?.name} in ${selectedClass} have been saved.`
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Results Entry Broadsheet</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {myClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                             {subjectsInClass.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSaveChanges} className="w-full sm:w-auto sm:ml-auto" disabled={!selectedClass || !selectedSubject}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
                
                {selectedClass && selectedSubject ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="text-center">1st CA (20)</TableHead>
                                <TableHead className="text-center">2nd CA (20)</TableHead>
                                <TableHead className="text-center">Exam (60)</TableHead>
                                <TableHead className="text-center font-bold">Total (100)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studentsInClass.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="text-center"
                                            max={20}
                                            min={0}
                                            value={getScore(student.id, 'firstCA')}
                                            onChange={(e) => handleScoreChange(student.id, 'firstCA', e.target.value)}
                                        />
                                    </TableCell>
                                     <TableCell>
                                        <Input
                                            type="number"
                                            className="text-center"
                                            max={20}
                                            min={0}
                                            value={getScore(student.id, 'secondCA')}
                                            onChange={(e) => handleScoreChange(student.id, 'secondCA', e.target.value)}
                                        />
                                    </TableCell>
                                     <TableCell>
                                        <Input
                                            type="number"
                                            className="text-center"
                                            max={60}
                                            min={0}
                                            value={getScore(student.id, 'exam')}
                                            onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                                        />
                                    </TableCell>
                                     <TableCell className="text-center font-bold text-lg">
                                        {getScore(student.id, 'total') || '–'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <p>Please select a class and subject to begin entering results.</p>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
