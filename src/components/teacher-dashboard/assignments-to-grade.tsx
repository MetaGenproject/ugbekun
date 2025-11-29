

"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assignmentsToGrade as initialAssignments, AssignmentToGrade } from '@/lib/teacher-data';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Link from 'next/link';

export function AssignmentsToGrade() {
  const [assignments] = useLocalStorage<AssignmentToGrade[]>('assignments-to-grade', initialAssignments);

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Assignments to Grade</CardTitle>
         <Button variant="outline" size="sm" asChild>
          <Link href="/teacher/grading">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-border">
                {assignments.length > 0 ? assignments.map((item) => (
                <div key={item.id} className="py-4 px-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            <span>{item.class}</span> • <span className="text-destructive">{item.dueDate}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <Progress value={(item.submissions / item.totalStudents) * 100} className="h-2 w-24" />
                            <span className="text-xs text-muted-foreground">{item.submissions}/{item.totalStudents} submitted</span>
                        </div>
                    </div>
                     <Button asChild>
                        <Link href={`/teacher/grading/assignments/${item.id}`}>Grade Now</Link>
                    </Button>
                </div>
                )) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No assignments to grade. All caught up!
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
