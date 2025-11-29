/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: 'Mon', value: 2.5 },
  { name: 'Tue', value: 1.8 },
  { name: 'Wed', value: 3.2 },
  { name: 'Thu', value: 2.1 },
  { name: 'Fri', value: 1.5 },
  { name: 'Sat', value: 1.2 },
  { name: 'Sun', value: 1.9 },
]

export function HoursChart() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark";

  const colors = {
      primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
      secondary: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
      grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)',
      ticks: isDarkMode ? 'hsl(228 10% 97%)' : 'hsl(222 70% 22%)',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke={colors.ticks} fontSize={12} tickLine={false} axisLine={false}/>
        <YAxis 
            stroke={colors.ticks} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 4]} 
            tickFormatter={(value) => `${value}h`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: colors.primary,
                color: colors.secondary,
                border: 'none',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toFixed(1)} hrs`, "Study Time"]}
            cursor={{fill: 'transparent'}}
        />
        <Bar dataKey="value" fill={colors.primary} radius={[10, 10, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}
