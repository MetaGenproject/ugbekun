
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { WelcomeCard } from '@/components/parent-dashboard/welcome-card';
import { CoreMetrics } from '@/components/parent-dashboard/core-metrics';
import { AcademicProgressChart } from '@/components/parent-dashboard/academic-progress-chart';
import { WeeklyAttendanceChart } from '@/components/parent-dashboard/weekly-attendance-chart';
import { AssignmentsDue } from '@/components/parent-dashboard/assignments-due';
import { SchoolCalendar } from '@/components/dashboard/school-calendar';
import { Messages } from '@/components/parent-dashboard/messages';
import { Payments } from '@/components/parent-dashboard/payments';
import { ChildProfile } from '@/components/parent-dashboard/child-profile';
import { TransportCard } from '@/components/parent-dashboard/transport-card';
import { WellnessCard } from '@/components/parent-dashboard/wellness-card';
import { ClassTeachers } from '@/components/parent-dashboard/class-teachers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
            <CoreMetrics />
        </div>

        <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AcademicProgressChart />
                <WeeklyAttendanceChart />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AssignmentsDue />
                 <Payments />
            </div>
             <div className="grid grid-cols-1">
                <Messages />
            </div>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-6">
          <ChildProfile />
          <ClassTeachers />
          <TransportCard />
          <WellnessCard />
        </div>
      </div>
    </div>
  );
}
