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
import {
    useGetMySchoolQuery,
    useGetDashboardStatsQuery,
    useGetEventsQuery
} from "@/app/api/apiSlice";

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
    const { isLoading: isPlanLoading } = usePlan();

    // Fetch school data, dashboard stats, and events from API
    const { data: schoolData, isLoading: isSchoolLoading, error: schoolError } = useGetMySchoolQuery();
    const { data: statsData, isLoading: isStatsLoading, error: statsError } = useGetDashboardStatsQuery();
    const { data: eventsResponse, isLoading: isEventsLoading } = useGetEventsQuery({});

    const eventsData = eventsResponse?.data || [];
    const isLoading = isSchoolLoading || isStatsLoading || isEventsLoading;

    // Extract stats from API response
    const studentsCount = statsData?.data?.studentsCount || 0;
    const teachersCount = statsData?.data?.teachersCount || 0;
    const totalRevenue = statsData?.data?.totalRevenue || 0;
    const eventsCount = statsData?.data?.eventsCount || eventsData.length;

    const dashboardStats = [
        {
            title: "Students",
            value: studentsCount.toString(),
            icon: <User className="h-5 w-5" />,
        },
        {
            title: "Teachers",
            value: teachersCount.toString(),
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: "Total Revenue",
            value: totalRevenue > 0 ? `₦${(totalRevenue / 1000000).toFixed(1)}M` : "₦0",
            icon: <Wallet className="h-5 w-5" />,
        },
        {
            title: "Events",
            value: eventsCount.toString(),
            icon: <CalendarCheck2 className="h-5 w-5" />,
        },
    ];

    return (
        <div className="space-y-6 animate-in-up">
            <WelcomeCard schoolData={schoolData?.data?.school} />

            {(schoolError || statsError) && (
                <Card className="p-4 bg-destructive/10 border-destructive">
                    <CardContent className="p-0">
                        <p className="text-destructive text-sm">
                            Failed to load dashboard data. Please try refreshing the page.
                        </p>
                    </CardContent>
                </Card>
            )}

            {isLoading || isPlanLoading ? <StatsSkeleton /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboardStats.map((stat) => (
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
