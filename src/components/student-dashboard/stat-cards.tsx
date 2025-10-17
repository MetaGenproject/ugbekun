
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { Award, Book, Clock4, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialGrades, type RecentGrade } from "@/lib/student-data";
import { type Subject, initialSubjects } from "@/lib/school-data";
import { useMemo } from "react";

// Helper to convert percentage to GPA
const toGPA = (grade: number) => {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.5;
    if (grade >= 70) return 3.0;
    if (grade >= 60) return 2.5;
    if (grade >= 50) return 2.0;
    return 1.0;
};

export function StatCards() {
    const [grades] = useLocalStorage<RecentGrade[]>('student-grades', initialGrades);
    const [subjects] = useLocalStorage<Subject[]>('school-subjects', initialSubjects);

    const statsData = useMemo(() => {
        const totalGpaPoints = grades.reduce((acc, grade) => {
            const gradeValue = parseFloat(grade.grade.replace('%', ''));
            return acc + toGPA(gradeValue);
        }, 0);
        const averageGpa = grades.length > 0 ? (totalGpaPoints / grades.length).toFixed(2) : "N/A";
        
        const totalCredits = subjects.reduce((acc, subject) => acc + (subject.syllabus?.length || 0), 0); // Assuming 1 credit per topic

        return [
            { title: "GPA", value: averageGpa, icon: <Award className="h-5 w-5" /> },
            { title: "Courses", value: `${subjects.length}`, icon: <Book className="h-5 w-5" /> },
            { title: "Study Hours (wk)", value: "14.2", icon: <Clock4 className="h-5 w-5" /> },
            { title: "Streak", value: "7 days", icon: <Flame className="h-5 w-5" /> },
        ];
    }, [grades, subjects]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map(stat => (
                <div key={stat.title}>
                    <Card className="p-4 shadow-lg h-full">
                        <CardContent className="p-0 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-secondary-foreground shrink-0">
                                {stat.icon}
                            </div>
                            <div>
                                <div className="text-xs opacity-80">{stat.title}</div>
                                <div className="text-xl font-semibold tracking-tight">{stat.value}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
