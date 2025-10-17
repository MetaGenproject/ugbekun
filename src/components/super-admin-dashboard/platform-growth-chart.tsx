/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useTheme } from 'next-themes';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { platformGrowthData } from '@/lib/super-admin-data';

export function PlatformGrowthChart() {
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
          <CardTitle className="text-lg">Platform Growth</CardTitle>
          <div className="text-sm text-muted-foreground">Last 6 Months</div>
        </div>
        <CardDescription>New school sign-ups over time.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 h-[288px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={platformGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={colors.primary} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke={colors.primary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.primary,
                color: colors.secondary,
                border: 'none',
                borderRadius: '0.75rem',
              }}
              formatter={(value: number) => [`${value} new schools`, 'Sign-ups']}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="newSchools"
              stroke={colors.primary}
              strokeWidth={2}
              dot={{ r: 4, fill: colors.primary }}
              activeDot={{ r: 8, stroke: colors.secondary, strokeWidth: 2 }}
              name="New Schools"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
