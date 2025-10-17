
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
import { type Class, initialClasses } from "@/lib/school-data";
import { AddClassDialog } from "@/components/admin-dashboard/add-class-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

export default function ClassesPage() {
  const [classes, setClasses] = useLocalStorage<Class[]>(
    "school-classes",
    initialClasses
  );
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const handleAddClass = (newClass: Omit<Class, 'id'>) => {
    setClasses(prev => [...prev, { ...newClass, id: `cls-${Date.now()}` }]);
  };
  
  const handleUpdateClass = (updatedClass: Class) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };
  
  const handleDeleteClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
    toast({
      variant: 'destructive',
      title: "Class Deleted",
      description: "The class has been removed from the list."
    });
  };

  const openEditDialog = (c: Class) => {
    setEditingClass(c);
    setIsAddClassOpen(true);
  }

  const openAddDialog = () => {
    setEditingClass(null);
    setIsAddClassOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Classes</CardTitle>
            </div>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Class
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Form Teacher</TableHead>
                    <TableHead>No. of Students</TableHead>
                    <TableHead>No. of Subjects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>
                              {c.teacher
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{c.teacher}</span>
                        </div>
                      </TableCell>
                      <TableCell>{c.studentCount}</TableCell>
                      <TableCell>{c.subjects}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(c)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClass(c.id)} className="text-destructive focus:text-destructive">
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
      <AddClassDialog
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onAddClass={handleAddClass}
        onUpdateClass={handleUpdateClass}
        classToEdit={editingClass}
      />
    </>
  );
}

    