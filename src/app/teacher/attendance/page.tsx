
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Student, recentStudents as initialStudents } from "@/lib/admin-data";
import { type Staff, staff as initialStaff } from '@/lib/hr-data';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

type AttendanceStatus = 'Present' | 'Late' | 'Absent';
type AttendanceRecord = Record<string, Record<string, AttendanceStatus>>; // { [date]: { [studentId]: status } }

export default function AttendancePage() {
  const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const [students] = useLocalStorage<Student[]>('students', initialStudents);
  const [allAttendance, setAllAttendance] = useLocalStorage<AttendanceRecord>('teacher-attendance', {});
  const { toast } = useToast();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Mock teacher login
  const loggedInTeacherName = "Mr. Adebayo";
  const myClasses = useMemo(() => {
    const teacher = staff.find(s => s.name === loggedInTeacherName);
    return teacher ? teacher.assignedClasses : [];
  }, [staff, loggedInTeacherName]);
  
  const [selectedClass, setSelectedClass] = useState<string | undefined>(myClasses[0]?.class);
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, AttendanceStatus>>({});

  const studentsInClass = useMemo(() => 
    selectedClass ? students.filter(s => s.class === selectedClass) : [],
    [students, selectedClass]
  );
  
  // Load today's attendance for the selected class when it changes
  useEffect(() => {
    if (selectedClass) {
        const todaysClassAttendance = allAttendance[today] || {};
        setCurrentAttendance(todaysClassAttendance);
    }
  }, [selectedClass, allAttendance, today]);

  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleSaveAttendance = () => {
    if (!selectedClass) return;

    setAllAttendance(prev => ({ ...prev, [today]: { ...prev[today], ...currentAttendance } }));

    toast({
        variant: "success",
        title: "Attendance Saved",
        description: `Attendance for ${selectedClass} has been recorded for today.`,
    });
  };

  const allMarked = studentsInClass.length > 0 && studentsInClass.every(s => currentAttendance[s.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Select onValueChange={setSelectedClass} value={selectedClass}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select a class..." />
            </SelectTrigger>
            <SelectContent>
              {myClasses.map(cls => (
                <SelectItem key={cls.class} value={cls.class}>
                  {cls.class} ({cls.subject})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSaveAttendance} 
            disabled={!selectedClass || !allMarked}
            className="w-full sm:w-auto"
          >
            Save Attendance
          </Button>
        </div>

        <div className="border rounded-lg">
            {studentsInClass.length > 0 ? (
                studentsInClass.map(student => (
                    <div key={student.id} className="flex items-center p-3 border-b last:border-b-0">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium ml-3 flex-1">{student.name}</span>
                        <div className="flex items-center gap-1">
                            <Button 
                                size="icon" 
                                variant={currentAttendance[student.id] === 'Present' ? 'default' : 'ghost'}
                                className={cn("h-9 w-9 rounded-full", currentAttendance[student.id] === 'Present' && "bg-green-500 hover:bg-green-600")}
                                onClick={() => handleStatusChange(student.id, 'Present')}>
                                <Check className="h-5 w-5" />
                            </Button>
                             <Button 
                                size="icon" 
                                variant={currentAttendance[student.id] === 'Late' ? 'default' : 'ghost'}
                                className={cn("h-9 w-9 rounded-full", currentAttendance[student.id] === 'Late' && "bg-yellow-500 hover:bg-yellow-600")}
                                onClick={() => handleStatusChange(student.id, 'Late')}>
                                <Clock className="h-5 w-5" />
                            </Button>
                             <Button 
                                size="icon" 
                                variant={currentAttendance[student.id] === 'Absent' ? 'destructive' : 'ghost'}
                                className="h-9 w-9 rounded-full"
                                onClick={() => handleStatusChange(student.id, 'Absent')}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-muted-foreground">
                    {selectedClass ? "No students in this class." : "Please select a class to begin."}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
