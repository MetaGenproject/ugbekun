
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bell, Calendar, UserPlus } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { usePlan } from '@/context/plan-context';
import { AddStudentDialog } from './add-student-dialog';
import { AddEventDialog } from './add-event-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Student } from '@/lib/admin-data';
import type { Notification } from '@/lib/notifications-data';
import { adminNotifications as initialAdminNotifications } from '@/lib/notifications-data';
import { type Event } from '@/lib/events-data';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import * as DataStore from "@/lib/data-store";

export function WelcomeCard() {
  const image = PlaceHolderImages.find(p => p.id === 'admin-welcome');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [, setAdminNotifications] = useLocalStorage<Notification[]>('admin-notifications', initialAdminNotifications);
  const [, setEvents] = useLocalStorage<Event[]>("school-events", []);
  const { plan, planLimits, hasFeature, openUpgradeDialog, isLoading } = usePlan();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddStudentClick = () => {
    if (isLoading || !plan) return;
    const canAddStudent = hasFeature('STUDENT_PROFILES') && students.length < planLimits[plan].students;
    if (!canAddStudent) {
      openUpgradeDialog('STUDENT_PROFILES');
    } else {
      setIsAddStudentOpen(true);
    }
  };

  const handleAddStudent = async (newStudentData: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => {
    const newStudent = await DataStore.addStudent(newStudentData);
    setStudents(prev => [newStudent, ...prev]);

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

  const handleAddEvent = async (newEventData: Omit<Event, 'id' | 'icon'>) => {
    await DataStore.addEvent(newEventData as Event);
    const updatedEvents = await DataStore.getEvents();
    setEvents(updatedEvents);
    toast({ variant: 'success', title: 'Event Scheduled', description: `${newEventData.title} has been added.` });
  };

  const quickActions = [
    { icon: UserPlus, text: "New Student", onClick: handleAddStudentClick },
    { icon: Calendar, text: "Add Event", onClick: () => setIsAddEventOpen(true) },
    { icon: Bell, text: "Send Notice", onClick: () => router.push('/admin/messages') },
    { icon: ArrowRight, text: "All Reports", onClick: () => router.push('/admin/reports') },
];

  return (
    <>
    <Card className="shadow-lg overflow-hidden bg-ugbekun-blue-dark text-ugbekun-white relative">
      <CardContent className="p-6 md:p-8">
        <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight">Welcome back, Nabila!</h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                {quickActions.map((action, index) => {
                    return (
                        <button key={index} onClick={action.onClick} className="flex items-center justify-start gap-2.5 text-left p-3 h-auto rounded-lg bg-ugbekun-white/10 hover:bg-ugbekun-white/20 text-ugbekun-white transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-ugbekun-white/20 text-white grid place-items-center shrink-0">
                                <action.icon className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium">{action.text}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </CardContent>
       {image && (
        <div className="absolute right-0 bottom-0 h-48 w-48 xl:h-56 xl:w-56 pointer-events-none opacity-80 xl:opacity-100">
            <Image
              src={image.imageUrl}
              alt={image.description}
              data-ai-hint={image.imageHint}
              fill
              className="object-contain"
            />
        </div>
        )}
    </Card>
     <AddStudentDialog 
      isOpen={isAddStudentOpen} 
      onClose={() => setIsAddStudentOpen(false)}
      onAddStudent={handleAddStudent}
      onUpdateStudent={() => {}}
      studentToEdit={null}
    />
     <AddEventDialog 
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={handleAddEvent}
        onUpdateEvent={(e) => console.log('Update not implemented from here', e)}
        eventToEdit={null}
    />
    </>
  );
}
