
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Student } from "@/lib/admin-data";
import * as DataStore from "@/lib/data-store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Staff } from "@/lib/hr-data";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedStudents, fetchedStaff] = await Promise.all([
        DataStore.getStudents(),
        DataStore.getStaff(),
      ]);
      setStudents(fetchedStudents);
      setStaff(fetchedStaff);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Mock teacher login
  const loggedInTeacherName = "Mr. Adebayo";
  const myClasses = useMemo(() => {
    const teacher = staff.find(s => s.name === loggedInTeacherName);
    return teacher ? teacher.assignedClasses.map(c => c.class) : [];
  }, [staff]);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      myClasses.includes(student.class) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.class.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, myClasses, searchTerm]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>My Students</CardTitle>
            <CardDescription>A directory of all students in your assigned classes.</CardDescription>
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
                    <TableHead>Student ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center">Loading students...</TableCell></TableRow>
                  ) : filteredStudents.map((student) => (
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
                      <TableCell className="font-mono text-xs">{student.id}</TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && filteredStudents.length === 0 && (
                      <TableRow><TableCell colSpan={3} className="h-24 text-center">No students found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
