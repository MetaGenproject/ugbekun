
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialGrades } from "@/lib/student-data";
import type { RecentGrade } from "@/lib/student-data";
import { useMemo } from "react";

// Helper to convert percentage to GPA
const toGPA = (grade: number) => {
    if (grade >= 90) return 4.0;
    if (grade >= 80) return 3.5;
    if (grade >= 70) return 3.0;
    if (grade >= 60) return 2.5;
    if (grade >= 50) return 2.0;
    return 1.0;
};

export function GpaChart() {
  const { resolvedTheme } = useTheme();
  const [grades] = useLocalStorage<RecentGrade[]>('student-grades', initialGrades);
  const isDarkMode = resolvedTheme === "dark";

  const chartData = useMemo(() => {
    if (!grades || grades.length === 0) {
        // Return some default data if no grades are available
        return [...Array(12)].map((_, i) => ({ name: `W${i+1}`, thisTerm: 0, lastTerm: 0 }));
    }
    
    // Create some fake data for "last term" for comparison
    const lastTermBaseGpa = toGPA(80); // Assume last term was a B+ average

    return grades.map((grade, index) => {
        const gradeValue = parseFloat(grade.grade.replace('%', ''));
        const currentGpa = toGPA(gradeValue);
        
        // Simulate a slightly lower GPA for last term that trends up
        const lastTermGpa = Math.min(4.0, lastTermBaseGpa + (index * 0.02));

        return {
            name: `Grade ${index + 1}`,
            thisTerm: currentGpa,
            lastTerm: lastTermGpa
        }
    });

  }, [grades]);


  const colors = {
      primary: isDarkMode ? 'hsl(229 100% 80%)' : 'hsl(222 70% 22%)',
      secondary: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
      subtle: isDarkMode ? 'hsla(229, 100%, 80%, 0.25)' : 'hsla(222, 70%, 22%, 0.12)',
      grid: isDarkMode ? 'hsla(229, 100%, 80%, 0.1)' : 'hsla(222, 70%, 22%, 0.05)',
      ticks: isDarkMode ? 'hsl(228 10% 97%)' : 'hsl(222 70% 22%)',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
        <XAxis 
            dataKey="name" 
            stroke={colors.ticks} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
        />
        <YAxis 
            stroke={colors.ticks} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={[1.0, 4.0]}
            tickFormatter={(value) => value.toFixed(1)}
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
            formatter={(value: number, name: string) => [value.toFixed(2), name === 'thisTerm' ? 'This Term' : 'Last Term']}
            cursor={{ stroke: colors.primary, strokeWidth: 1 }}
        />
        <Line 
            type="monotone" 
            dataKey="thisTerm" 
            stroke={colors.primary} 
            strokeWidth={2.5} 
            dot={false} 
            activeDot={{ r: 6 }} 
            name="This Term"
        />
        <Line 
            type="monotone" 
            dataKey="lastTerm" 
            stroke={colors.subtle} 
            strokeWidth={2.5} 
            dot={false} 
            activeDot={false} 
            name="Last Term" 
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
