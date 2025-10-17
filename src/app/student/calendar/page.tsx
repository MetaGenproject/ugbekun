"use client";

import { SchoolCalendar } from '@/components/dashboard/school-calendar';

export default function StudentCalendarPage() {
  return (
    <div className="h-full">
      <SchoolCalendar view="student" />
    </div>
  );
}
