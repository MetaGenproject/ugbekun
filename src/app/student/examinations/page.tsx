"use client";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialExams, type Exam, statusStyles, statusIcons } from "@/lib/exam-data";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ExaminationsPage() {
    const [exams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
    const router = useRouter();

    // Mock: Filter for the parent's child's class.
    const childClass = "JSS 2B";
    const childExams = exams.filter(exam => exam.class.includes(childClass) || exam.class === "JSS 1 - SSS 3");

    const handleAction = (exam: Exam) => {
        if (exam.status === 'Scheduled') {
            router.push(`/student/examinations/${exam.id}`);
        } else if (exam.status === 'Graded') {
            router.push(`/student/examinations/${exam.id}/results`);
        }
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Examinations</CardTitle>
          <CardDescription>
            View your upcoming exams and past results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Examination Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {childExams.map((exam) => {
                const Icon = statusIcons[exam.status];
                return (
                    <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className={statusStyles[exam.status]}>
                                <Icon className="mr-1 h-3 w-3" />
                                {exam.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <Button 
                                variant={exam.status === 'Scheduled' ? 'default' : 'outline'} 
                                size="sm" 
                                onClick={() => handleAction(exam)}
                                disabled={exam.status === 'Ongoing' || exam.status === 'Completed'}
                            >
                                {exam.status === 'Scheduled' ? 'Start Exam' : 'View Results'}
                            </Button>
                        </TableCell>
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
