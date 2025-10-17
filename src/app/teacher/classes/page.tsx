
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Percent } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Submission, initialSubmissions } from "@/lib/submission-data";
import { type Subject, initialSubjects } from "@/lib/school-data";
import { type Exam, initialExams } from "@/lib/exam-data";

export default function ClassesPage() {
    const [exams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
    const [subjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);

    // Filter assignments from exams that are not graded yet
    const assignmentsToGrade = exams.filter(e => e.status === 'Completed' || e.status === 'Scheduled' || e.status === 'Ongoing');


  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.slice(0,3).map(c => (
                 <Card key={c.id}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-medium">{c.name} • JSS 2A</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">85% avg. score</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><Users className="h-3 w-3"/> 30 students</div>
                        </div>
                         <div className="pt-2">
                            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                <span>Syllabus Coverage</span>
                                <span>{c.progress}%</span>
                            </div>
                            <Progress value={c.progress} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All My Assignments</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Assignment</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignmentsToGrade.map(a => (
                            <TableRow key={a.id}>
                                <TableCell className="font-medium">{a.title}</TableCell>
                                <TableCell>{a.class}</TableCell>
                                <TableCell>0/{a.class.includes('JSS 2') ? 30 : 25}</TableCell>
                                <TableCell>{new Date(a.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" asChild>
                                        <Link href={`/teacher/grading/assignments/${a.id}`}>Grade</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

    