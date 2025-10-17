
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialSubjects as initialSchoolSubjects, type Subject } from "@/lib/school-data";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [subjects] = useLocalStorage<Subject[]>('school-subjects', initialSchoolSubjects);
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [isLoading, setIsLoading] = useState(true);

  const subject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    // If subjects are loaded and the specific subject is not found, redirect.
    if (subjects.length > 0 && !subject) {
      router.replace('/teacher/subjects');
    }
    if (subject) {
      setIsLoading(false);
    }
  }, [subject, subjects, router]);

  if (isLoading || !subject) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/teacher/subjects')}>
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
