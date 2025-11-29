
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, User, CalendarCheck2, Wallet } from "lucide-react";
import { WelcomeCard } from "@/components/admin-dashboard/welcome-card";
import { RecentStudentsCard } from "@/components/layout/recent-students-card";
import type { Student } from "@/lib/admin-data";
import type { Staff } from '@/lib/hr-data';
import { SchoolCalendar } from "@/components/dashboard/school-calendar";
import type { Event } from "@/lib/events-data";
import { usePlan } from "@/context/plan-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/lib/finance-data";
import * as DataStore from "@/lib/data-store";

const PerformanceChart = dynamic(() => import('@/components/dashboard/performance-chart').then(mod => mod.PerformanceChart), { ssr: false });
const FinanceChart = dynamic(() => import('@/components/dashboard/finance-chart').then(mod => mod.FinanceChart), { ssr: false });

const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 shadow-lg h-full">
                <CardContent className="p-0 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-8" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
)


export default function DashboardPage() {
    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [staffData, setStaffData] = useState<Staff[]>([]);
    const [eventsData, setEventsData] = useState<Event[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isLoading: isPlanLoading } = usePlan();
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [students, staff, events, trans] = await Promise.all([
                DataStore.getStudents(),
                DataStore.getStaff(),
                DataStore.getEvents(),
                DataStore.getTransactions()
            ]);
            setStudentsData(students);
            setStaffData(staff);
            setEventsData(events);
            setTransactions(trans);
            setIsLoading(false);
        };
        fetchData();
    }, []);


    const teachersData = staffData.filter(s => s.department === 'Academics');
    
    const totalRevenue = transactions
        .filter(t => t.status === 'Paid')
        .reduce((acc, t) => acc + t.amount, 0);

    const statsData = [
      {
        title: "Students",
        value: studentsData.length.toString(),
        icon: <User className="h-5 w-5" />,
      },
      {
        title: "Teachers",
        value: teachersData.length.toString(),
        icon: <Users className="h-5 w-5" />,
      },
       {
        title: "Total Revenue",
        value: `₦${(totalRevenue / 1000000).toFixed(1)}M`,
        icon: <Wallet className="h-5 w-5" />,
      },
        {
        title: "Events",
        value: eventsData.length.toString(),
        icon: <CalendarCheck2 className="h-5 w-5" />,
      },
    ];

  return (
    <div className="space-y-6 animate-in-up">
      <WelcomeCard />
      
      {isLoading || isPlanLoading ? <StatsSkeleton /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map((stat) => (
              <Card key={stat.title} className="p-4 shadow-lg h-full">
                  <CardContent className="p-0 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-secondary-foreground shadow-sm shrink-0">
                      {stat.icon}
                  </div>
                  <div>
                      <div className="text-sm text-muted-foreground">{stat.title}</div>
                      <div className="text-xl font-semibold tracking-tight">{stat.value}</div>
                  </div>
                  </CardContent>
              </Card>
              ))}
          </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card className="p-6 shadow-lg h-full lg:col-span-2">
            <CardHeader className="p-0">
                <CardTitle>Finance Overview</CardTitle>
            </CardHeader>
             <CardContent className="p-0 mt-4 h-80">
                <FinanceChart />
            </CardContent>
        </Card>
         <RecentStudentsCard />
      </div>


       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="shadow-lg h-full">
            <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 h-[350px]">
                <PerformanceChart />
            </CardContent>
        </Card>
        <div className="h-full min-h-[450px]">
            <SchoolCalendar view="admin" />
        </div>
       </div>
    </div>
  );
}

    