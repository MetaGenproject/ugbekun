
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialSubjects as initialSchoolSubjects, type Subject } from "@/lib/school-data";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { useEffect } from "react";

export default function SubjectDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [subjects] = useLocalStorage<Subject[]>('school-subjects', initialSchoolSubjects);
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;

  const subject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    if (subjects.length > 0 && !subject) {
      router.replace('/student/subjects');
    }
  }, [subject, subjects, router]);

  if (!subject) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/student/subjects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.code}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
