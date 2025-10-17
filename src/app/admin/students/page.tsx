
"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  MoreHorizontal,
  FileDown,
  MessageCircle,
  Trash2,
  Edit,
  FileBarChart,
  Users2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddStudentDialog } from "@/components/admin-dashboard/add-student-dialog";
import type { Student } from "@/lib/admin-data";
import { usePlan } from "@/context/plan-context";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as DataStore from "@/lib/data-store";
import { SendMessageDialog } from "@/components/admin-dashboard/send-message-dialog";

function StudentsPageContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { hasFeature, openUpgradeDialog, plan, planLimits } = usePlan();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [messagingStudent, setMessagingStudent] = useState<Student | null>(null);
  const router = useRouter();

  useEffect(() => {
      const fetchStudents = async () => {
          const data = await DataStore.getStudents();
          setStudents(data);
          setIsLoading(false);
      }
      fetchStudents();
  }, []);


  const handleAddStudent = async (newStudentData: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => {
    const newStudent = await DataStore.addStudent(newStudentData);
    setStudents(prev => [newStudent, ...prev]);
    toast({ variant: "success", title: "Student Added", description: `${newStudent.name} has been successfully enrolled.`});
  };
  
  const handleUpdateStudent = async (updatedStudentData: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => {
     if (!editingStudent) return;
     const updatedStudent = { ...editingStudent, ...updatedStudentData };
     await DataStore.updateStudent(updatedStudent);
     setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
     toast({
        variant: "success",
        title: "Student Updated",
        description: "The student's details have been saved."
     });
  };
  
  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    await DataStore.deleteStudent(studentToDelete.id);
    setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
    toast({
        variant: "destructive",
        title: "Student Removed",
        description: `${studentToDelete.name} has been removed from the list.`
    });
    setStudentToDelete(null);
  }

  const handleAddClick = () => {
    if (plan && students.length >= planLimits[plan].students) {
      openUpgradeDialog('STUDENT_PROFILES');
    } else {
      setEditingStudent(null);
      setIsAddStudentOpen(true);
    }
  };

  const handleEditClick = (student: Student) => {
      setEditingStudent(student);
      setIsAddStudentOpen(true);
  }
  
  const handleMessageClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setMessagingStudent(student);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Students</CardTitle>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast({description: "Import from CSV feature coming soon!"})}>
                    <FileDown className="mr-2 h-4 w-4" /> Import
                </Button>
              <Button variant="outline" onClick={() => router.push('/admin/students/promotions')}>
                <Users2 className="mr-2 h-4 w-4" /> Promotions
              </Button>
              <Button onClick={handleAddClick}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
                <Input 
                    placeholder="Search by name or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="cursor-pointer" onClick={() => router.push(`/admin/students/${student.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                             <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(student.status === 'Alumni' && 'bg-muted text-muted-foreground')}>
                            {student.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={(e) => handleMessageClick(e, student)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/p/${student.id}`} target="_blank">
                                        <ExternalLink className="mr-2 h-4 w-4" /> View Public Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/admin/reports/${student.id}`)}>
                                    <FileBarChart className="mr-2 h-4 w-4" />
                                    View Report Card
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditClick(student)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => confirmDeleteStudent(student)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && filteredStudents.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center h-24">No students found.</TableCell></TableRow>
                  )}
                   {isLoading && (
                    <TableRow><TableCell colSpan={4} className="text-center h-24">Loading students...</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <AddStudentDialog
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
        onUpdateStudent={handleUpdateStudent}
        studentToEdit={editingStudent}
      />
       <ConfirmationDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteStudent}
        title={`Delete ${studentToDelete?.name}?`}
        description="This action cannot be undone. This will permanently remove the student's record."
        confirmText="Delete"
      />
      <SendMessageDialog 
        isOpen={!!messagingStudent}
        onClose={() => setMessagingStudent(null)}
        studentName={messagingStudent?.name || ''}
        studentId={messagingStudent?.id || ''}
      />
    </>
  );
}

export default function StudentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StudentsPageContent />
        </Suspense>
    )
}
