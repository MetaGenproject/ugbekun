"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart as BarChartIcon, Award, TrendingUp, UserCheck, Star } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from 'next/dynamic';

const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });


const classPerformanceData = [
    { name: "JSS 1A", average: 82 },
    { name: "JSS 1B", average: 78 },
    { name: "JSS 2A", average: 85 },
    { name: "JSS 2B", average: 75 },
    { name: "SSS 1A", average: 91 },
    { name: "SSS 1B", average: 84 },
];

const subjectPerformanceData = [
    { subject: "Mathematics", average: 85, highest: 98, lowest: 62, students: 150 },
    { subject: "English Language", average: 88, highest: 99, lowest: 70, students: 150 },
    { subject: "Basic Science", average: 82, highest: 95, lowest: 65, students: 120 },
    { subject: "Social Studies", average: 79, highest: 92, lowest: 60, students: 120 },
    { subject: "Physics", average: 89, highest: 100, lowest: 72, students: 25 },
    { subject: "Chemistry", average: 87, highest: 96, lowest: 71, students: 25 },
    { subject: "Literature", average: 92, highest: 99, lowest: 80, students: 22 },
]

export default function ResultsPage() {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const colors = {
        primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
        grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)',
    };
    
    const kpiData = [
        { title: "School Average", value: "84.5%", icon: Award, description: "+2.1% from last term" },
        { title: "Top Performing Class", value: "SSS 1A", icon: Star, description: "91% Average" },
        { title: "Top Subject", value: "Literature", icon: TrendingUp, description: "92% Average" },
        { title: "Honor Roll", value: "78 students", icon: UserCheck, description: "Above 85% average" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Performance by Class</CardTitle>
                        <CardDescription>Average scores for each class this term.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classPerformanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <YAxis 
                                    stroke={colors.primary} 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <XAxis dataKey="name" stroke={colors.primary} fontSize={12} tickLine={false} axisLine={false}/>
                                <Tooltip
                                    cursor={{fill: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)', radius: 8}}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                />
                                <Bar dataKey="average" fill={colors.primary} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Performance by Subject</CardTitle>
                        <CardDescription>Overall performance across all subjects taught.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Average</TableHead>
                                    <TableHead>Highest</TableHead>
                                    <TableHead>Lowest</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subjectPerformanceData.map(sub => (
                                    <TableRow key={sub.subject}>
                                        <TableCell className="font-medium">{sub.subject}</TableCell>
                                        <TableCell>{sub.average}%</TableCell>
                                        <TableCell className="text-green-500">{sub.highest}%</TableCell>
                                        <TableCell className="text-destructive">{sub.lowest}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
