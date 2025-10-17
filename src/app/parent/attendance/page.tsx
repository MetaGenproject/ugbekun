
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { attendanceData, type AttendanceStatus } from "@/lib/student-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<AttendanceStatus, string> = {
    Present: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
    Late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
    Absent: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
    Holiday: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
}

export default function ParentAttendancePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const statusForSelectedDate = date 
        ? attendanceData[date.toISOString().split('T')[0]] || "No Record"
        : "No Record";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Maya's Attendance</CardTitle>
                <CardDescription>View your child's attendance record for the term.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        modifiers={{
                            present: (day) => attendanceData[day.toISOString().split('T')[0]] === 'Present',
                            late: (day) => attendanceData[day.toISOString().split('T')[0]] === 'Late',
                            absent: (day) => attendanceData[day.toISOString().split('T')[0]] === 'Absent',
                            holiday: (day) => attendanceData[day.toISOString().split('T')[0]] === 'Holiday',
                        }}
                        modifiersClassNames={{
                            present: 'bg-green-100 dark:bg-green-900/50',
                            late: 'bg-yellow-100 dark:bg-yellow-900/50',
                            absent: 'bg-red-100 dark:bg-red-900/50 line-through',
                            holiday: 'bg-gray-100 dark:bg-gray-800/50'
                        }}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold">Details for {date ? date.toLocaleDateString() : '...'}</h3>
                    <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={cn(statusStyles[statusForSelectedDate as AttendanceStatus] || 'bg-muted')}>
                            {statusForSelectedDate}
                        </Badge>
                    </div>
                     <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Term Summary</p>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                            <div><p className="font-bold text-lg text-green-600">65</p><p className="text-xs">Present</p></div>
                            <div><p className="font-bold text-lg text-yellow-600">3</p><p className="text-xs">Late</p></div>
                            <div><p className="font-bold text-lg text-red-600">2</p><p className="text-xs">Absent</p></div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
