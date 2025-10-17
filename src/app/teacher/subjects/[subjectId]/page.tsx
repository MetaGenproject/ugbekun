
"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialSubjects as initialSchoolSubjects, type Subject } from "@/lib/school-data";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Circle, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { initialAssignments } from "@/lib/student-data";
import type { Assignment } from "@/lib/student-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TeacherSubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('school-subjects', initialSchoolSubjects);
  const [assignments] = useLocalStorage<Assignment[]>("student-assignments", initialAssignments);
  const [subject, setSubject] = useState<Subject | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    const foundSubject = subjects.find((s) => s.id === subjectId);
    setSubject(foundSubject);
    if (subjects.length > 0 && !foundSubject) {
      router.replace('/teacher/subjects');
    }
  }, [subjectId, subjects, router]);

  if (!subject) {
    return <div>Loading...</div>; // Or a skeleton loader
  }
  
  const handleToggleComplete = (topicTitle: string) => {
      setSubjects(prev => prev.map(s => {
          if (s.id === subject.id) {
              const updatedSyllabus = s.syllabus.map(topic => 
                  topic.topic === topicTitle ? { ...topic, completed: !topic.completed } : topic
              );
              const completedCount = updatedSyllabus.filter(t => t.completed).length;
              const newProgress = updatedSyllabus.length > 0 ? Math.round((completedCount / updatedSyllabus.length) * 100) : 0;

              return { ...s, syllabus: updatedSyllabus, progress: newProgress };
          }
          return s;
      }));
  };
  
  const handleAddTopic = () => {
    if (!newTopic.trim()) return;
    setSubjects(prev => prev.map(s => {
        if (s.id === subject.id) {
            // Check for duplicates
            if (s.syllabus.some(topic => topic.topic.toLowerCase() === newTopic.trim().toLowerCase())) {
                 toast({ variant: 'destructive', title: "Duplicate Topic", description: "This topic already exists in the syllabus." });
                 return s;
            }
            const newSyllabus = [...s.syllabus, { topic: newTopic.trim(), completed: false }];
            const completedCount = newSyllabus.filter(t => t.completed).length;
            const newProgress = newSyllabus.length > 0 ? Math.round((completedCount / newSyllabus.length) * 100) : 0;
            return { ...s, syllabus: newSyllabus, progress: newProgress };
        }
        return s;
    }));
    setNewTopic("");
    toast({ variant: 'success', title: "Topic Added" });
  };
  
  const handleDeleteTopic = (topicTitle: string) => {
     setSubjects(prev => prev.map(s => {
        if (s.id === subject.id) {
            const newSyllabus = s.syllabus.filter(topic => topic.topic !== topicTitle);
            const completedCount = newSyllabus.filter(t => t.completed).length;
            const newProgress = newSyllabus.length > 0 ? Math.round((completedCount / newSyllabus.length) * 100) : 0;
            return { ...s, syllabus: newSyllabus, progress: newProgress };
        }
        return s;
    }));
    toast({ variant: 'destructive', title: "Topic Removed" });
  }

  const subjectAssignments = assignments.filter(a => a.course === subject.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Syllabus</CardTitle>
                    <CardDescription>Add, remove, and update the status of syllabus topics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[28rem]">
                        <div className="space-y-4 pr-4">
                            {subject.syllabus.map(topic => (
                                <div key={topic.topic} className="flex items-center gap-3 group">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleToggleComplete(topic.topic)}>
                                        {topic.completed ? <Check className="h-5 w-5 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                                    </Button>
                                    <span className={cn("flex-1", topic.completed && "text-muted-foreground line-through")}>{topic.topic}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteTopic(topic.topic)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))}
                            {subject.syllabus.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">The syllabus for this subject has not been published yet.</p>
                            )}
                        </div>
                    </ScrollArea>
                     <div className="mt-6 flex gap-2 pt-6 border-t">
                        <Input 
                            placeholder="Add a new syllabus topic..."
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                        />
                        <Button onClick={handleAddTopic}><PlusCircle className="mr-2 h-4 w-4" /> Add Topic</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Syllabus Progress</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>Syllabus Completion</span>
                        <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} />
                    <p className="text-xs text-muted-foreground mt-2">{subject.syllabus.filter(t=>t.completed).length} of {subject.syllabus.length} topics covered.</p>
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
