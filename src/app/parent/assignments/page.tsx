
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialAssignments, type Assignment } from "@/lib/student-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function AssignmentItem({ assignment }: { assignment: Assignment }) {
    return (
        <div className="py-4 flex items-center gap-4 border-b last:border-b-0">
             <div className="h-5 w-5 rounded-full bg-muted grid place-items-center shrink-0">
                {assignment.completed ? <Check className="h-3 w-3 text-muted-foreground" /> : <Circle className="h-2 w-2 text-muted-foreground" />}
            </div>
            <div className={cn("flex-1 min-w-0", assignment.completed && "text-muted-foreground")}>
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium tracking-tight truncate">{assignment.title}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                    {assignment.course}
                </div>
            </div>
        </div>
    );
}


export default function ParentAssignmentsPage() {
    const [assignments] = useLocalStorage<Assignment[]>('student-assignments', initialAssignments);

    const activeAssignments = assignments.filter(a => !a.completed);
    const completedAssignments = assignments.filter(a => a.completed);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Maya's Assignments</CardTitle>
                <CardDescription>An overview of your child's upcoming and completed tasks.</CardDescription>
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
                                        <AssignmentItem key={assignment.id} assignment={assignment} />
                                    )
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No upcoming assignments.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="completed">
                        <ScrollArea className="h-[60vh]">
                            <div className="divide-y pr-4">
                                {completedAssignments.length > 0 ? (
                                    completedAssignments.map(assignment => 
                                        <AssignmentItem key={assignment.id} assignment={assignment} />
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
    );
}
