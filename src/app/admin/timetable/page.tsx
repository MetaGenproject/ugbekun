
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Edit, Save, Loader2, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { type Class, type Subject } from "@/lib/school-data";
import { type Staff } from "@/lib/hr-data";
import * as DataStore from "@/lib/data-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateTimetable } from "@/ai/flows/timetable-actions";
import { Skeleton } from "@/components/ui/skeleton";

const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [timetables, setTimetables] = useState<Record<string, (string | undefined)[][]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  
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
        if (fetchedClasses.length > 0) {
            setSelectedClass(fetchedClasses[0].name);
        }
        setIsLoading(false);
    };
    fetchData();
  }, []);

  const activeTimetable = useMemo(() => {
      return timetables[selectedClass] || Array(5).fill(Array(7).fill(undefined));
  }, [timetables, selectedClass]);
  
  const teachersMap = useMemo(() => new Map(staff.map(s => [s.name, s.avatar])), [staff]);

  const handleEdit = (dayIndex: number, timeIndex: number, value: string) => {
    if (!selectedClass) return;
    const newTimetables = JSON.parse(JSON.stringify(timetables));
    if (!newTimetables[selectedClass]) {
        newTimetables[selectedClass] = Array(5).fill(Array(7).fill(undefined));
    }
    newTimetables[selectedClass][dayIndex][timeIndex] = value;
    setTimetables(newTimetables);
  };
  
  const handleToggleEditMode = async () => {
    if (isEditMode) {
      await DataStore.saveTimetables(timetables);
      toast({
        variant: "success",
        title: "Timetable Saved",
        description: `Changes for ${selectedClass} have been saved.`
      });
    }
    setIsEditMode(!isEditMode);
  }
  
  const handleGenerateTimetable = async () => {
      setIsAiGenerating(true);
      toast({ title: "Generating Timetable...", description: "The AI is working on a conflict-free schedule." });
      try {
          const result = await generateTimetable({});
          if (result) {
              setTimetables(result.timetable);
              await DataStore.saveTimetables(result.timetable);
              toast({ variant: 'success', title: 'Timetable Generated!', description: 'The new schedule has been applied.' });
          }
      } catch (e) {
          console.error(e);
          toast({ variant: 'destructive', title: 'Generation Failed' });
      } finally {
          setIsAiGenerating(false);
      }
  }
  
  const getSubjectDetails = (subjectName?: string) => {
      if (!subjectName) return null;
      return subjects.find(s => s.name === subjectName);
  }
  
  const TimetableGrid = () => (
     <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-1">
        <div></div> {/* Empty corner */}
        {days.map(day => <div key={day} className="p-2 font-medium text-center text-muted-foreground text-sm">{day}</div>)}
        
        {timeSlots.map((time, timeIndex) => (
            <React.Fragment key={time}>
                <div className="p-2 font-medium text-right text-muted-foreground text-sm">{time}</div>
                {days.map((day, dayIndex) => {
                    const subjectName = activeTimetable[dayIndex]?.[timeIndex];
                    const subject = getSubjectDetails(subjectName);
                    
                    if (isEditMode) {
                        return (
                            <Card key={`${day}-${time}`} className="p-2 bg-muted/30">
                                <Select onValueChange={(value) => handleEdit(dayIndex, timeIndex, value)} value={subjectName || ''}>
                                    <SelectTrigger className="h-full bg-card">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Break">Break</SelectItem>
                                        <SelectItem value="Assembly">Assembly</SelectItem>
                                        <SelectItem value="Clubs">Clubs</SelectItem>
                                        {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Card>
                        )
                    }
                    
                    return (
                        <Card key={`${day}-${time}`} className={cn(
                            "p-3 min-h-[80px] flex flex-col justify-between",
                            subjectName === 'Break' || subjectName === 'Assembly' || subjectName === 'Clubs' ? 'bg-muted/40 items-center justify-center' : 'bg-card'
                        )}>
                            {subject ? (
                                <>
                                <p className="font-semibold text-xs">{subject.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Avatar className="h-5 w-5">
                                        <AvatarImage src={teachersMap.get(subject.teacher)} />
                                        <AvatarFallback>{subject.teacher.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{subject.teacher}</span>
                                </div>
                                </>
                            ) : subjectName ? (
                                <p className="font-semibold text-xs">{subjectName}</p>
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
        <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>School Timetable</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {classes.length > 0 && (
                <Select value={selectedClass} onValueChange={setSelectedClass} disabled={isEditMode}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
            <Button onClick={handleGenerateTimetable} variant="outline" disabled={isAiGenerating || isEditMode}>
                {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <WandSparkles className="mr-2 h-4 w-4"/>}
                Generate with AI
            </Button>
            <Button onClick={handleToggleEditMode} disabled={isAiGenerating}>
              {isEditMode ? <><Save className="mr-2 h-4 w-4"/> Save</> : <><Edit className="mr-2 h-4 w-4"/> Edit</>}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-96" /> : <TimetableGrid />}
        </CardContent>
      </Card>
    </div>
  );
}

    