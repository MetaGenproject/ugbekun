/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"

import { useTheme } from "next-themes"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
    { name: 'Jan', thisWeek: 20, lastWeek: 0 },
    { name: 'Feb', thisWeek: 40, lastWeek: 25 },
    { name: 'Mar', thisWeek: 85, lastWeek: 50 },
    { name: 'Apr', thisWeek: 25, lastWeek: 10 },
    { name: 'May', thisWeek: 45, lastWeek: 5 },
    { name: 'Jun', thisWeek: 30, lastWeek: 40 },
    { name: 'Jul', thisWeek: 65, lastWeek: 50 },
    { name: 'Aug', thisWeek: 25, lastWeek: 30 },
    { name: 'Sep', thisWeek: 40, lastWeek: 25 },
    { name: 'Oct', thisWeek: 85, lastWeek: 75 },
    { name: 'Nov', thisWeek: 75, lastWeek: 70 },
    { name: 'Dec', thisWeek: 55, lastWeek: 45 },
]

export function PerformanceChart() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark";

  const colors = {
      thisWeek: isDarkMode ? 'hsl(var(--ugbekun-blue-light))' : 'hsl(var(--ugbekun-blue-dark))',
      lastWeek: isDarkMode ? 'hsla(var(--ugbekun-blue-light), 0.3)' : 'hsla(var(--ugbekun-blue-dark), 0.3)',
      thisWeekGradient: 'url(#colorThisWeek)',
      lastWeekGradient: 'url(#colorLastWeek)',
      grid: isDarkMode ? 'hsla(var(--border))' : 'hsla(var(--border))',
      ticks: isDarkMode ? 'hsl(var(--ugbekun-white))' : 'hsl(var(--ugbekun-blue-dark))',
  };

  return (
    <div className="relative h-full w-full bg-card">
      <div className="absolute left-0 top-0 h-full w-8 z-10 bg-gradient-to-r from-card to-transparent" />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
          <defs>
              <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.thisWeek} stopOpacity={isDarkMode ? 0.3 : 0.4}/>
                  <stop offset="95%" stopColor={colors.thisWeek} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.lastWeek} stopOpacity={isDarkMode ? 0.2 : 0.15}/>
                  <stop offset="95%" stopColor={colors.lastWeek} stopOpacity={0}/>
              </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} vertical={true} horizontal={true} strokeDasharray="3 3"/>
          <XAxis dataKey="name" stroke={colors.ticks} fontSize={12} tickLine={false} axisLine={false} dy={10}/>
          <YAxis stroke={colors.ticks} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} dx={-5} />
          <Tooltip 
             contentStyle={{
                backgroundColor: isDarkMode ? 'hsl(var(--ugbekun-blue-dark))' : 'hsl(var(--ugbekun-white))',
                color: isDarkMode ? 'hsl(var(--ugbekun-white))' : 'hsl(var(--ugbekun-blue-dark))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem'
            }}
            cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area 
              type="monotone" 
              dataKey="thisWeek" 
              stroke={colors.thisWeek}
              strokeWidth={2.5}
              fillOpacity={1} 
              fill={colors.thisWeekGradient}
              activeDot={{ r: 6, strokeWidth: 2, fill: colors.thisWeek, stroke: isDarkMode ? 'hsl(var(--ugbekun-blue-dark))' : 'hsl(var(--ugbekun-white))' }}
          />
          <Area 
              type="monotone" 
              dataKey="lastWeek" 
              stroke={colors.lastWeek}
              strokeWidth={2.5}
              fillOpacity={1} 
              fill={colors.lastWeekGradient} 
              activeDot={{ r: 6, strokeWidth: 2, fill: colors.lastWeek, stroke: isDarkMode ? 'hsl(var(--ugbekun-blue-dark))' : 'hsl(var(--ugbekun-white))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute right-0 top-0 h-full w-8 z-10 bg-gradient-to-l from-card to-transparent" />
    </div>
  )
}
