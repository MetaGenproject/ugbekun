
"use client";

import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialSubjects as initialSchoolSubjects, type Subject } from "@/lib/school-data";
import { CourseCard } from "@/components/student-dashboard/course-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

export default function SubjectsPage() {
  const [subjects] = useLocalStorage<Subject[]>('school-subjects', initialSchoolSubjects);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = useMemo(() => {
    return subjects.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sub.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Link href={`/student/subjects/${subject.id}`} key={subject.id}>
              <CourseCard course={{
                  ...subject,
                  title: subject.name,
                  credits: 3 // Mock credits
              }} />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

    