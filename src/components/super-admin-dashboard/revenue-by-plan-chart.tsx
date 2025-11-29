/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useTheme } from 'next-themes';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { revenueByPlanData } from '@/lib/super-admin-data';

export function RevenueByPlanChart() {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const colors = {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        tooltipBg: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
        tooltipText: isDarkMode ? 'hsl(228 10% 97%)' : 'hsl(222 70% 22%)',
    };

    const PIE_COLORS = [colors.primary, colors.secondary, colors.muted];

    return (
        <Card className="shadow-lg h-full">
            <CardHeader className="p-6">
                <CardTitle className="text-lg">Revenue by Plan</CardTitle>
                <CardDescription>Breakdown of revenue from each subscription tier.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipText, borderRadius: '0.5rem', border: 'none' }}
                            formatter={(value: number) => [`₦${value.toLocaleString()}m`, 'Revenue']}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Pie
                            data={revenueByPlanData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {revenueByPlanData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
