
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialAssignments, type Assignment } from "@/lib/student-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { AddTaskDialog } from '@/components/student-dashboard/add-task-dialog';
import Link from "next/link";
import { initialSubjects, type Subject } from "@/lib/school-data";

function AssignmentItem({ assignment, onCheckedChange, subjectId }: { assignment: Assignment, onCheckedChange: (id: string, checked: boolean) => void, subjectId?: string }) {
    return (
        <div className="py-4 flex items-center gap-4 border-b last:border-b-0">
            <Checkbox 
                id={`assignment-${assignment.id}`} 
                checked={assignment.completed}
                onCheckedChange={(checked) => onCheckedChange(assignment.id, !!checked)}
                aria-label={`Mark ${assignment.title} as ${assignment.completed ? 'incomplete' : 'complete'}`}
            />
            <label 
                htmlFor={`assignment-${assignment.id}`} 
                className={cn("flex-1 min-w-0 cursor-pointer", assignment.completed && "line-through text-muted-foreground")}
            >
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium tracking-tight truncate">{assignment.title}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                    {assignment.course} {assignment.points > 0 ? `• ${assignment.points} pts` : ''}
                </div>
            </label>
             <Button variant="outline" size="sm" asChild>
                <Link href={subjectId ? `/student/subjects/${subjectId}` : '#'}>Details</Link>
            </Button>
        </div>
    );
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useLocalStorage<Assignment[]>('student-assignments', initialAssignments);
    const [subjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const { toast } = useToast();

    const subjectIdMap = new Map(subjects.map(s => [s.name, s.id]));

    const handleCheckedChange = (id: string, checked: boolean) => {
        setAssignments(prev => 
            prev
                .map(a => a.id === id ? { ...a, completed: checked } : a)
        );
    }

    const handleAddTask = (newTaskData: { title: string; course: string; }) => {
        const newTask: Assignment = {
            id: `task-${Date.now()}`,
            title: newTaskData.title,
            course: newTaskData.course,
            points: 0,
            completed: false,
            date: new Date().toISOString(), // Add a date for personal tasks
        };
        setAssignments(prev => [newTask, ...prev]);
    };

    const activeAssignments = assignments.filter(a => !a.completed);
    const completedAssignments = assignments.filter(a => a.completed);

  return (
      <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Assignments</CardTitle>
                </div>
                 <Button onClick={() => setIsAddTaskOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="upcoming">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
                        <ScrollArea className="h-[60vh]">
                            <div className="divide-y pr-4">
                                {activeAssignments.length > 0 ? (
                                    activeAssignments.map(assignment => 
                                        <AssignmentItem 
                                            key={assignment.id} 
                                            assignment={assignment} 
                                            onCheckedChange={handleCheckedChange}
                                            subjectId={subjectIdMap.get(assignment.course)}
                                        />
                                    )
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No upcoming assignments. You're all caught up!</p>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="completed">
                        <ScrollArea className="h-[60vh]">
                            <div className="divide-y pr-4">
                                {completedAssignments.length > 0 ? (
                                    completedAssignments.map(assignment => 
                                        <AssignmentItem 
                                            key={assignment.id} 
                                            assignment={assignment} 
                                            onCheckedChange={handleCheckedChange}
                                            subjectId={subjectIdMap.get(assignment.course)}
                                        />
                                    )
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No completed assignments yet.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        <AddTaskDialog
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            onAddTask={handleAddTask}
        />
    </>
  );
}

    