/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import React from 'react';

type DashboardLayoutProps = {
  stats: React.ReactNode;
  performance: React.ReactNode;
  recentStudents: React.ReactNode;
  calendarAndFinance: React.ReactNode;
  unpaidTuition: React.ReactNode;
};

export function DashboardLayout({
  stats,
  performance,
  recentStudents,
  calendarAndFinance,
  unpaidTuition,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      {stats}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          {performance}
        </div>
        <div className="xl:col-span-1">
          {recentStudents}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {calendarAndFinance}
        {unpaidTuition}
      </div>
      
    </div>
  );
}
