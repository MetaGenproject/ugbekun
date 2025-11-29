
"use client";

import { useState } from "react";
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
import { PlusCircle, Edit } from "lucide-react";
import { AddExamDialog } from "@/components/admin-dashboard/add-exam-dialog";

export default function ExaminationsPage() {
  const [exams, setExams] = useLocalStorage<Exam[]>("examinations-list", initialExams);
  const { toast } = useToast();
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);

  const handleAddExam = (newExamData: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...newExamData, id: `ex-${Date.now()}` };
    setExams(prev => [newExam, ...prev]);
  };

  const handleUpdateExam = (updatedExam: Exam) => {
    setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
  };
  
  const openEditDialog = (exam: Exam) => {
    setExamToEdit(exam);
    setIsAddExamOpen(true);
  }

  const openAddDialog = () => {
    setExamToEdit(null);
    setIsAddExamOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Examinations</CardTitle>
            </div>
             <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Exam
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
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
                  {exams.map((exam) => {
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
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(exam)}>
                              <Edit className="mr-2 h-4 w-4"/> Edit
                            </Button>
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
      <AddExamDialog
        isOpen={isAddExamOpen}
        onClose={() => setIsAddExamOpen(false)}
        onAddExam={handleAddExam}
        onUpdateExam={handleUpdateExam}
        examToEdit={examToEdit}
      />
    </>
  );
}

    