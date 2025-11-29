
"use client";

import { PlatformGrowthChart } from "@/components/super-admin-dashboard/platform-growth-chart";
import { RevenueByPlanChart } from "@/components/super-admin-dashboard/revenue-by-plan-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, FileText, Mail, TrendingUp, Users } from "lucide-react";

const kpiData = [
  { title: "New School Sign-ups (Month)", value: "22", icon: Users, change: "+15%" },
  { title: "Website Visitors", value: "12,450", icon: TrendingUp, change: "+8.2%" },
  { title: "Leads Generated", value: "156", icon: Mail, change: "+20%" },
  { title: "Conversion Rate", value: "14.1%", icon: AreaChart, change: "+1.2%" },
];


export default function SuperAdminAnalyticsPage() {
    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500">{kpi.change}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <PlatformGrowthChart />
            <RevenueByPlanChart />
        </div>
    )
}
