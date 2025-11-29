/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useTheme } from "next-themes";
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

const data = [
  { name: 'Completed', value: 62 },
  { name: 'In Progress', value: 28 },
  { name: 'Not Started', value: 10 },
];

export function ProgressDonut() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const colors = {
      primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
      secondary: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
      subtle: isDarkMode ? 'hsla(229, 100%, 80%, 0.25)' : 'hsla(222, 70%, 22%, 0.12)',
  };

  const PIE_COLORS = [colors.primary, colors.subtle, colors.secondary];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
            contentStyle={{
                backgroundColor: colors.primary,
                color: colors.secondary,
                border: 'none',
                borderRadius: '0.75rem',
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
        />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius="68%"
          outerRadius="100%"
          fill="#8884d8"
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
