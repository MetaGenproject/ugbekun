/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useTheme } from 'next-themes';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const data = [
  { name: 'JSS 2A', performance: 88 },
  { name: 'JSS 2B', performance: 72 },
  { name: 'SSS 1A', performance: 91 },
  { name: 'JSS 3C', performance: 65 },
  { name: 'SSS 1B', performance: 82 },
];

export function ClassPerformanceChart() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const colors = {
    primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
    secondary: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
    grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)',
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Class Performance</CardTitle>
          <div className="text-sm text-muted-foreground">This Term</div>
        </div>
        <CardDescription>Average scores across your classes.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid stroke={colors.grid} vertical={false} />
            <XAxis dataKey="name" stroke={colors.primary} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={colors.primary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
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
              cursor={{fill: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)', radius: 8}}
            />
            <Bar dataKey="performance" fill={colors.primary} radius={[8, 8, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
