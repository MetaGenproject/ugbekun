
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { PlatformStats } from '@/components/super-admin-dashboard/platform-stats';
import { WelcomeHeader } from '@/components/super-admin-dashboard/welcome-header';
import { SchoolsOverview } from '@/components/super-admin-dashboard/schools-overview';
import { PlatformGrowthChart } from '@/components/super-admin-dashboard/platform-growth-chart';
import { RevenueByPlanChart } from '@/components/super-admin-dashboard/revenue-by-plan-chart';
import { RecentActivity } from '@/components/super-admin-dashboard/recent-activity';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
            <PlatformStats />
        </div>
        <div className="lg:col-span-3">
            <SchoolsOverview />
        </div>
        <div className="lg:col-span-2">
          <PlatformGrowthChart />
        </div>
         <div className="lg:col-span-1">
            <RecentActivity />
        </div>
        <div className="lg:col-span-3">
          <RevenueByPlanChart />
        </div>
      </div>
    </div>
  );
}
