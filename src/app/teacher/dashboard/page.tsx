/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { WelcomeCard } from "@/components/teacher-dashboard/welcome-card";
import { StatCards } from "@/components/teacher-dashboard/stat-cards";
import { UpcomingClasses } from "@/components/teacher-dashboard/upcoming-classes";
import { AssignmentsToGrade } from "@/components/teacher-dashboard/assignments-to-grade";
import { ClassPerformanceChart } from "@/components/teacher-dashboard/class-performance-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SchoolCalendar } from "@/components/dashboard/school-calendar";
import { RecentActivity } from "@/components/teacher-dashboard/recent-activity";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        <div className="lg:col-span-12">
            <StatCards />
        </div>

        <div className="lg:col-span-4 space-y-6">
            <UpcomingClasses />
            <RecentActivity />
        </div>

        <div className="lg:col-span-8 space-y-6">
            <ClassPerformanceChart />
            <AssignmentsToGrade />
        </div>
      </div>
    </div>
  );
}
