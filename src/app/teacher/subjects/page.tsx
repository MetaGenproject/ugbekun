
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { type Subject, initialSubjects } from "@/lib/school-data";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { CourseCard } from "@/components/student-dashboard/course-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function TeacherSubjectsPage() {
  const [allSubjects, setAllSubjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);
  const [staff, setStaff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
      setIsLoading(false);
  }, []);

  const loggedInTeacherName = "Mr. Adebayo"; // Mock login

  const mySubjects = useMemo(() => {
    if (isLoading) return [];
    const teacher = staff.find(s => s.name === loggedInTeacherName);
    if (!teacher) return [];
    const subjectNames = new Set(teacher.assignedClasses.map(c => c.subject));
    return allSubjects.filter(sub => subjectNames.has(sub.name));
  }, [isLoading, allSubjects, staff, loggedInTeacherName]);


  const filteredSubjects = useMemo(() => {
    return mySubjects.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sub.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mySubjects, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 max-w-sm">
            <Input 
                placeholder="Search by subject name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
                <Link href={`/teacher/subjects/${subject.id}`} key={subject.id}>
                <CourseCard course={{
                    ...subject,
                    title: subject.name,
                    credits: 3 // Mock credits
                }} />
                </Link>
            ))}
            </div>
        )}
        {!isLoading && filteredSubjects.length === 0 && (
            <p className="text-center text-muted-foreground py-16">You have not been assigned any subjects.</p>
        )}
      </CardContent>
    </Card>
  );
}

    