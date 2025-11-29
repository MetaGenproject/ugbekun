
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type Subject, initialSubjects } from "@/lib/school-data";
import { AddSubjectDialog } from "@/components/admin-dashboard/add-subject-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>(
    "school-subjects",
    initialSubjects
  );
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const { toast } = useToast();

  const handleAddSubject = (newSubject: Omit<Subject, 'id' | 'progress' | 'description' | 'imageId' | 'syllabus'>) => {
    const fullNewSubject: Subject = {
      ...newSubject,
      id: `sub-${Date.now()}`,
      progress: 0,
      description: "A newly added subject. Please edit to add a description.",
      imageId: "course-literature", // default image
      syllabus: []
    }
    setSubjects(prev => [fullNewSubject, ...prev]);
  };
  
  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
  };
  
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    toast({
      variant: 'destructive',
      title: "Subject Deleted",
      description: "The subject has been removed from the curriculum."
    });
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setIsAddSubjectOpen(true);
  }

  const openAddDialog = () => {
    setEditingSubject(null);
    setIsAddSubjectOpen(true);
  }


  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subjects</CardTitle>
            </div>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned Teacher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>
                              {subject.teacher.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {subject.teacher}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(subject)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteSubject(subject.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <AddSubjectDialog
        isOpen={isAddSubjectOpen}
        onClose={() => { setEditingSubject(null); setIsAddSubjectOpen(false); }}
        onAddSubject={handleAddSubject}
        onUpdateSubject={handleUpdateSubject}
        subjectToEdit={editingSubject}
      />
    </>
  );
}

    