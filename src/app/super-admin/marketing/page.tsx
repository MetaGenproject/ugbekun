
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AreaChart, FileText, Mail, TrendingUp, Users } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

const kpiData = [
  { title: "New School Sign-ups (Month)", value: "22", icon: Users, change: "+15%" },
  { title: "Website Visitors", value: "12,450", icon: TrendingUp, change: "+8.2%" },
  { title: "Leads Generated", value: "156", icon: Mail, change: "+20%" },
  { title: "Conversion Rate", value: "14.1%", icon: AreaChart, change: "+1.2%" },
];

const trafficSourceData = [
    { source: "Google", visitors: 4500 },
    { source: "Facebook", visitors: 2800 },
    { source: "LinkedIn", visitors: 1500 },
    { source: "Direct", visitors: 1200 },
    { source: "Referrals", visitors: 850 },
];

export default function MarketingDashboardPage() {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const colors = {
        primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
        grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)',
    };

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Traffic Sources</CardTitle>
                        <CardDescription>Visitors by channel this month.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficSourceData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="source" 
                                    type="category" 
                                    stroke={colors.primary} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{fill: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)', radius: 8}}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                                <Bar dataKey="visitors" fill={colors.primary} radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Campaign Performance</CardTitle>
                        <CardDescription>Overview of active marketing campaigns.</CardDescription>
                    </CardHeader>
                     <CardContent className="text-center text-muted-foreground py-20">
                        <FileText className="h-12 w-12 mx-auto" />
                        <p className="mt-4">Campaign performance metrics would be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
