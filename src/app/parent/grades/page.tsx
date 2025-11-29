
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialGrades, type RecentGrade } from "@/lib/student-data";
import { GpaChart } from "@/components/student-dashboard/gpa-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ParentGradesPage() {
    const [grades] = useLocalStorage<RecentGrade[]>('student-grades', initialGrades);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Maya's Academic Performance</CardTitle>
                    <CardDescription>Performance trend for this term.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                    <GpaChart />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Grades</CardTitle>
                    <CardDescription>Detailed view of recently published grades.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject & Task</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Teacher's Feedback</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {grades.map(grade => (
                                <TableRow key={grade.id}>
                                    <TableCell className="font-medium">{grade.course}</TableCell>
                                    <TableCell><Badge variant={parseInt(grade.grade) > 89 ? "default" : "secondary"}>{grade.grade}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground">{grade.feedback}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
