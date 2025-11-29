/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useTheme } from 'next-themes';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const data = [
  { name: 'T1', value: 82 },
  { name: 'T2', value: 84 },
  { name: 'T3', value: 88 },
  { name: 'T4', value: 90 },
];

export function AcademicProgressChart() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const colors = {
    primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
    secondary: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
    primaryLine: isDarkMode ? 'hsl(229, 100%, 80%)' : 'hsl(222, 70%, 22%)',
    fill: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(229, 100%, 80%, 0.4)',
    grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.15)' : 'hsla(222, 70%, 22%, 0.1)',
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Academic Progress</CardTitle>
          <div className="text-sm text-muted-foreground">Terms</div>
        </div>
        <CardDescription>A calm trend of average scores across the year.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[288px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
                <linearGradient id="colorFillParent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.fill} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.fill} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={colors.primary} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={colors.primary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[70, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.primary,
                color: colors.secondary,
                border: 'none',
                borderRadius: '0.75rem',
              }}
              formatter={(value: number) => [`${value}%`, 'Average']}
              labelStyle={{ fontWeight: 'bold' }}
              cursor={{ stroke: colors.primary, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.primaryLine}
              strokeWidth={2.5}
              fill="url(#colorFillParent)"
              activeDot={{ r: 6, stroke: colors.secondary, strokeWidth: 2, fill: colors.primary }}
              name="Average"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
