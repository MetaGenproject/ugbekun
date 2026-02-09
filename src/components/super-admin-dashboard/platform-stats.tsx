/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"
import { Card, CardContent } from '@/components/ui/card';
import { useGetPlatformStatsQuery } from '@/app/api/apiSlice';
import { Building, Users, Wallet, TrendingUp } from "lucide-react";
import { Skeleton } from '../ui/skeleton';

export function PlatformStats() {
    const { data: statsData, isLoading } = useGetPlatformStatsQuery({});

    const stats = [
        { title: "Total Schools", value: statsData?.data?.totalSchools?.toString() || "0", icon: Building },
        { title: "Active Users", value: statsData?.data?.activeUsers?.toLocaleString() || "0", icon: Users },
        { title: "Platform Revenue", value: `₦${((statsData?.data?.platformRevenue || 0) / 1000000).toFixed(1)}m`, icon: Wallet },
        { title: "New Sign-ups (30d)", value: statsData?.data?.newSignups?.toString() || "0", icon: TrendingUp },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4 shadow-lg flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-6 w-8" />
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card key={index} className="p-4 shadow-lg hover:-translate-y-1 transition-transform">
                    <CardContent className="p-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-secondary-foreground shadow-sm shrink-0">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">{stat.title}</div>
                                <div className="text-xl font-semibold tracking-tight">{stat.value}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
