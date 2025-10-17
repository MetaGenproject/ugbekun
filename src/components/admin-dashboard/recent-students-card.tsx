
"use client"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Plus, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Student, recentStudents } from "@/lib/admin-data";
import { AddStudentDialog } from "../admin-dashboard/add-student-dialog";
import { usePlan } from "@/context/plan-context";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import type { Notification } from "@/lib/notifications-data";
import { adminNotifications as initialAdminNotifications } from "@/lib/notifications-data";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from 'next/navigation';
import { SendMessageDialog } from "../admin-dashboard/send-message-dialog";

const SkeletonCard = () => (
    <Card className="p-6 shadow-lg flex flex-col h-[460px]">
      <CardHeader className="p-0 flex flex-row items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </CardHeader>
      <CardContent className="p-0 mt-4 flex-1 min-h-0">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
      <div className="mt-4">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </Card>
)

export function RecentStudentsCard() {
  const [students, setStudents] = useLocalStorage<Student[]>("students", recentStudents);
  const [, setAdminNotifications] = useLocalStorage<Notification[]>("admin-notifications", initialAdminNotifications);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const { plan, planLimits, hasFeature, openUpgradeDialog, isLoading } = usePlan();
  const [messagingStudent, setMessagingStudent] = useState<Student | null>(null);
  const router = useRouter();

  if (isLoading || !plan) {
    return <SkeletonCard />;
  }

  const canAddStudent = hasFeature('STUDENT_PROFILES') && students.length < planLimits[plan].students;

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);

    // Create a notification for the super admin
    const newNotification: Notification = {
        id: Date.now(),
        title: "New Student Enrolled",
        description: `${newStudent.name} was added to ${newStudent.class}.`,
        icon: "UserPlus",
        read: false,
        href: `/admin/students/${newStudent.id}`
    };
    setAdminNotifications(prev => [newNotification, ...prev]);
  }

  const handleAddClick = () => {
    if (!canAddStudent) {
      openUpgradeDialog('STUDENT_PROFILES');
    } else {
      setIsAddStudentOpen(true);
    }
  }

  return (
    <>
    <Card className="p-6 shadow-lg flex flex-col h-[460px]">
      <CardHeader className="p-0 flex flex-row items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Recent Students</h3>
          <div className="text-xs text-muted-foreground mt-1">
            {students.length} / {planLimits[plan].students === Infinity ? 'Unlimited' : planLimits[plan].students} students
            </div>
        </div>
        <button 
          onClick={handleAddClick}
          disabled={!canAddStudent && plan !== 'Starter'} // Allow starter to see upgrade prompt
          className="h-9 w-9 rounded-full grid place-items-center bg-primary text-primary-foreground transition-colors hover:bg-primary/80 shrink-0 disabled:bg-muted-foreground disabled:cursor-not-allowed">
          <Plus className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent className="p-0 mt-4 flex-1 min-h-0">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="space-y-4">
            {students.slice(0, 5).map(student => (
              <div key={student.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium tracking-tight truncate">{student.name}</div>
                  <div className="text-xs text-muted-foreground">{student.class}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg shrink-0" onClick={() => setMessagingStudent(student)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
             {students.length === 0 && (
              <div className="text-center text-sm text-muted-foreground pt-12">
                No students enrolled yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="mt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/students">
              View More
            </Link>
          </Button>
      </div>
    </Card>
    <AddStudentDialog 
      isOpen={isAddStudentOpen} 
      onClose={() => setIsAddStudentOpen(false)}
      onAddStudent={() => {}}
      onUpdateStudent={() => {}}
      studentToEdit={null}
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
