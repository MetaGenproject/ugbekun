
"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialSubjects as initialSchoolSubjects, type Subject } from "@/lib/school-data";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";
import { initialAssignments } from "@/lib/student-data";
import type { Assignment } from "@/lib/student-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [subjects] = useLocalStorage<Subject[]>('school-subjects', initialSchoolSubjects);
  const [assignments] = useLocalStorage<Assignment[]>("student-assignments", initialAssignments);
  const router = useRouter();

  const subject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    if (subjects.length > 0 && !subject) {
      router.replace('/student/subjects');
    }
  }, [subject, subjects, router]);

  if (!subject) {
    return null; // or a loading skeleton
  }

  const subjectAssignments = assignments.filter(a => a.course === subject.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Syllabus</CardTitle>
                    <CardDescription>Topics to be covered in this subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[28rem]">
                        <div className="space-y-4 pr-4">
                            {subject.syllabus.map(topic => (
                                <div key={topic.topic} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <div className="h-6 w-6 rounded-full bg-background border grid place-items-center shrink-0">
                                        {topic.completed ? <Check className="h-4 w-4 text-primary" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                                    </div>
                                    <span className={topic.completed ? "text-muted-foreground line-through" : ""}>{topic.topic}</span>
                                </div>
                            ))}
                            {subject.syllabus.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">The syllabus for this subject has not been published yet.</p>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Syllabus Completion</span>
                        <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    {subjectAssignments.length > 0 ? (
                        <div className="space-y-3">
                            {subjectAssignments.map(assignment => (
                                <div key={assignment.id} className="text-sm text-muted-foreground">{assignment.title}</div>
                            ))}
                        </div>
                    ) : <p className="text-sm text-muted-foreground">No assignments for this subject yet.</p>}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
