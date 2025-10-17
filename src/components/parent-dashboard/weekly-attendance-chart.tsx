/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useTheme } from 'next-themes';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const data = [
  { name: 'Mon', present: 1, late: 0, absent: 0 },
  { name: 'Tue', present: 1, late: 0, absent: 0 },
  { name: 'Wed', present: 1, late: 0, absent: 0 },
  { name: 'Thu', present: 0, late: 1, absent: 0 },
  { name: 'Fri', present: 1, late: 0, absent: 0 },
];

export function WeeklyAttendanceChart() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const colors = {
    text: isDarkMode ? 'hsl(228 10% 97%)' : 'hsl(222 70% 22%)',
    grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.15)' : 'hsla(222, 70%, 22%, 0.1)',
    present: 'hsl(var(--primary))',
    late: 'hsl(var(--secondary))',
    absent: 'hsl(var(--destructive))',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weekly Attendance</CardTitle>
          <div className="text-sm text-muted-foreground">This week</div>
        </div>
        <CardDescription>Present vs. late vs. absent by day.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[288px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
            <CartesianGrid stroke={colors.grid} vertical={false} />
            <XAxis dataKey="name" stroke={colors.text} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={colors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              ticks={[0, 1]}
              tickFormatter={(value) => (value === 1 ? 'Day' : '')}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
            <Bar dataKey="present" stackId="a" fill={colors.present} name="Present" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" stackId="a" fill={colors.late} name="Late" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" stackId="a" fill={colors.absent} name="Absent" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
