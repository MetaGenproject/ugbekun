
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialGrades, type RecentGrade } from "@/lib/student-data";

export default function GradesPage() {
  const [grades] = useLocalStorage<RecentGrade[]>('student-grades', initialGrades);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Report Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Subject & Task</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Performance Bar</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.length > 0 ? (
                grades.map((item) => {
                  const gradeValue = parseInt(item.grade);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.course}</TableCell>
                      <TableCell>
                        <Badge variant={gradeValue > 89 ? "default" : "secondary"}>{item.grade}</Badge>
                      </TableCell>
                      <TableCell>
                        <Progress value={gradeValue} className="w-[60%]" />
                      </TableCell>
                      <TableCell>{item.feedback}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No grades have been published yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    