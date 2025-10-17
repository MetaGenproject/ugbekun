
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { initialAssignments } from '@/lib/student-data';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Assignment } from '@/lib/student-data';
import { format } from 'date-fns';
import Link from 'next/link';

export function AssignmentsDue() {
  const [assignments] = useLocalStorage<Assignment[]>('student-assignments', initialAssignments);
  const activeAssignments = assignments.filter(a => !a.completed);

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Assignments Due</CardTitle>
        <Button asChild variant="outline" size="sm">
            <Link href="/parent/assignments">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
            <div className="divide-y divide-border p-6 pt-0">
                {activeAssignments.map((item) => (
                <div key={item.id} className="py-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <div className="font-medium truncate">{item.title}</div>
                        <Badge variant="secondary">{format(new Date(item.date), "MMM d")}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.course}</div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2 h-9 w-9 rounded-lg">
                    <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
                ))}
                {activeAssignments.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        No upcoming assignments.
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
