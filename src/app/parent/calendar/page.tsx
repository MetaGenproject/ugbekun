
"use client";

import { SchoolCalendar } from '@/components/dashboard/school-calendar';

export default function ParentCalendarPage() {
  return (
    <div className="h-full">
      <SchoolCalendar view="parent" />
    </div>
  );
}
