
"use client";

import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Exam } from "@/lib/exam-data";
import { initialExams } from "@/lib/exam-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function GradingAssignmentsPage() {
    const [exams] = useLocalStorage<Exam[]>("examinations-list", initialExams);

    // Filter assignments from exams that are not graded yet
    const assignmentsToGrade = exams.filter(e => e.status === 'Completed' || e.status === 'Scheduled' || e.status === 'Ongoing');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Grade Assignments</CardTitle>
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
    )
}

    