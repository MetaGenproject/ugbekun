
"use client";

import { Ellipsis } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { initialAssignments, type Assignment } from "@/lib/student-data";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";
import { initialSubjects, type Subject } from "@/lib/school-data";

export function AssignmentList({ onAddTask }: { onAddTask: () => void }) {
    const [assignments, setAssignments] = useLocalStorage<Assignment[]>('student-assignments', initialAssignments);
    const [subjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);
    const subjectIdMap = new Map(subjects.map(s => [s.name, s.id]));

    const handleCheckedChange = (id: string, checked: boolean) => {
        setAssignments(prev => 
            prev
                .map(a => a.id === id ? { ...a, completed: checked } : a)
        );
    }

    const activeAssignments = assignments.filter(a => !a.completed);

    return (
        <Card className="p-0 shadow-lg flex flex-col h-full">
            <CardHeader className="p-6 flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
                 <Button variant="outline" size="sm" asChild>
                    <Link href="/student/assignments">View All</Link>
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                 <ScrollArea className="h-full">
                    <div className="divide-y divide-border px-6">
                        {activeAssignments.length > 0 ? activeAssignments.slice(0, 4).map(assignment => (
                            <div key={assignment.id} className="py-4 flex items-center gap-4">
                                <Checkbox 
                                    id={`dashboard-assignment-${assignment.id}`}
                                    checked={assignment.completed}
                                    onCheckedChange={(checked) => handleCheckedChange(assignment.id, !!checked)}
                                />
                                <label htmlFor={`dashboard-assignment-${assignment.id}`} className={cn("flex-1 min-w-0 cursor-pointer", assignment.completed && "line-through text-muted-foreground")}>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium tracking-tight truncate">{assignment.title}</div>
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">{assignment.course} {assignment.points > 0 ? `• ${assignment.points} pts` : ''}</div>
                                </label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                                            <Ellipsis className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/student/subjects/${subjectIdMap.get(assignment.course)}`}>View Details</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleCheckedChange(assignment.id, !assignment.completed)}>
                                            {assignment.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )) : (
                            <div className="text-center py-16 text-muted-foreground">
                                All caught up! No upcoming assignments.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
