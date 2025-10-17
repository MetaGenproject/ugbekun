
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialExams, type Exam, statusStyles, statusIcons } from "@/lib/exam-data";
import { initialSubmissions, type Submission } from "@/lib/submission-data";

export default function ParentExaminationsPage() {
    const [exams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
    const [submissions] = useLocalStorage<Submission[]>("exam-submissions", initialSubmissions);
    
    // Mock: Filter for the parent's child's class.
    const childClass = "JSS 2B";
    const childId = 'student-alex-morgan';
    const childExams = exams.filter(exam => exam.class.includes(childClass) || exam.class === "JSS 1 - SSS 3");

    const getResultForExam = (examId: string) => {
        const submission = submissions.find(s => s.examId === examId && s.studentId === childId);
        if (submission && submission.status === 'graded' && submission.score) {
            return `${submission.score}%`;
        }
        return 'N/A';
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maya's Examinations</CardTitle>
          <CardDescription>
            View your child's exam schedule and published results.
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
                <TableHead className="text-right">Result</TableHead>
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
                        <TableCell className="text-right font-semibold">
                            {getResultForExam(exam.id)}
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

