
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Class, type Subject } from "@/lib/school-data";
import { type Staff } from "@/lib/hr-data";
import * as DataStore from "@/lib/data-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TeacherSchedulePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timetables, setTimetables] = useState<Record<string, (string | undefined)[][]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock logged-in teacher
  const loggedInTeacherName = "Mr. Adebayo";

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const [fetchedClasses, fetchedSubjects, fetchedStaff, fetchedTimetables] = await Promise.all([
            DataStore.getClasses(),
            DataStore.getSubjects(),
            DataStore.getStaff(),
            DataStore.getTimetables(),
        ]);
        setClasses(fetchedClasses);
        setSubjects(fetchedSubjects);
        setStaff(fetchedStaff);
        setTimetables(fetchedTimetables);
        setIsLoading(false);
    };
    fetchData();
  }, []);
  
  const teacherTimetable = useMemo(() => {
    const schedule: (Subject | { name: string } | null)[][] = Array(7).fill(null).map(() => Array(5).fill(null));
    if (isLoading) return schedule;

    const teacherSubjects = subjects.filter(s => s.teacher === loggedInTeacherName);
    const teacherSubjectNames = new Set(teacherSubjects.map(s => s.name));

    Object.entries(timetables).forEach(([className, classTimetable]) => {
      classTimetable.forEach((daySchedule, dayIndex) => {
        daySchedule.forEach((subjectName, timeIndex) => {
          if (subjectName && teacherSubjectNames.has(subjectName)) {
            const subjectDetails = subjects.find(s => s.name === subjectName);
            if (subjectDetails) {
              schedule[timeIndex][dayIndex] = { ...subjectDetails, name: `${subjectDetails.name} (${className})` };
            }
          } else if (subjectName === 'Break' || subjectName === 'Assembly' || subjectName === 'Clubs') {
             if (!schedule[timeIndex][dayIndex]) {
                 schedule[timeIndex][dayIndex] = { name: subjectName };
             }
          }
        });
      });
    });

    return schedule;
  }, [timetables, subjects, isLoading, loggedInTeacherName]);

  const loggedInTeacher = staff.find(s => s.name === loggedInTeacherName);

  const TimetableGrid = () => (
     <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1">
        <div></div> {/* Empty corner */}
        {days.map(day => <div key={day} className="p-2 font-medium text-center text-muted-foreground text-sm">{day}</div>)}
        
        {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
                <div className="p-2 font-medium text-right text-muted-foreground text-sm">{time}</div>
                {days.map((day, dayIndex) => {
                    const subject = teacherTimetable[timeIndex]?.[dayIndex];
                    return (
                        <Card key={`${day}-${time}`} className={cn(
                            "p-3 min-h-[70px] flex flex-col justify-center",
                            subject?.name === 'Break' || subject?.name === 'Assembly' || subject?.name === 'Clubs' ? 'bg-muted/40 items-center' : 'bg-card'
                        )}>
                            {subject ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="font-semibold text-xs">{subject.name}</p>
                                    {subject.name !== 'Break' && subject.name !== 'Assembly' && subject.name !== 'Clubs' && (
                                        <Avatar className="h-5 w-5 mt-1.5">
                                            <AvatarImage src={loggedInTeacher?.avatar} />
                                            <AvatarFallback>{loggedInTeacher?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ) : null}
                        </Card>
                    )
                })}
            </React.Fragment>
        ))}
     </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-96" /> : <TimetableGrid />}
        </CardContent>
      </Card>
    </div>
  );
}
