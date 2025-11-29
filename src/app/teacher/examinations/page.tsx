
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialExams, type Exam, type ExamStatus, statusStyles, statusIcons } from "@/lib/exam-data";
import type { Notification } from "@/lib/notifications-data";
import { studentNotifications, parentNotifications } from "@/lib/notifications-data";

export default function ExaminationsPage() {
  const [exams, setExams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
  const [, setStudentNotifications] = useLocalStorage<Notification[]>('student-notifications', studentNotifications);
  const [, setParentNotifications] = useLocalStorage<Notification[]>('parent-notifications', parentNotifications);
  const { toast } = useToast();

  // Mock: Filter for the logged-in teacher.
  const mySubjects = ["Mathematics", "Basic Science", "English Language", "History", "Data Processing", "Physics", "Literature in English"];
  const myExams = exams.filter(exam => mySubjects.includes(exam.subject) || exam.class === "JSS 1 - SSS 3");

  const handlePublishGrades = (exam: Exam) => {
    if (exam.status !== 'Completed') {
        toast({ variant: 'destructive', title: 'Cannot Publish', description: 'Grades can only be published for completed exams where all submissions are graded.'});
        return;
    };
    
    setExams(prev => prev.map(e => e.id === exam.id ? {...e, status: 'Graded' } : e));
    
    toast({
      variant: 'success',
      title: "Grades Published",
      description: `Students and parents can now view the results for ${exam.title}`,
    });

    const studentNotification: Notification = { id: Date.now(), title: "Grade Published", description: `Your result for '${exam.title}' is now available.`, icon: 'Award', read: false, href: `/student/examinations/${exam.id}/results` };
    const parentNotification: Notification = { id: Date.now() + 1, title: `New Grade for Maya`, description: `Maya's result for '${exam.title}' is available.`, icon: 'Award', read: false, href: `/parent/examinations` };

    setStudentNotifications(prev => [studentNotification, ...prev]);
    setParentNotifications(prev => [parentNotification, ...prev]);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Examinations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Examination</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myExams.map((exam) => {
                  const Icon = statusIcons[exam.status];
                  return (
                    <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.class}</TableCell>
                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                        <Badge variant="secondary" className={statusStyles[exam.status]}>
                            <Icon className="mr-1 h-3 w-3" />
                            {exam.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {exam.status === 'Completed' ? (
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/teacher/grading/exams/${exam.id}`}>Enter Grades</Link>
                                </Button>
                                <Button size="sm" onClick={() => handlePublishGrades(exam)}>Publish</Button>
                              </div>
                          ) : (
                            <Button 
                                variant="outline" 
                                size="sm"
                                disabled={exam.status !== 'Graded'}
                                asChild={exam.status === 'Graded'}
                            >
                              <Link href={`/teacher/grading/exams/${exam.id}`}>View Results</Link>
                            </Button>
                          )}
                        </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

    