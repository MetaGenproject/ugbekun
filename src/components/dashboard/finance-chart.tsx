/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Transaction, Expense } from "@/lib/finance-data";
import { useMemo, useState, useEffect } from "react";
import * as DataStore from "@/lib/data-store";
import { format } from "date-fns";

const processFinancialData = (transactions: Transaction[], expenses: Expense[]) => {
    const combinedData: { [key: string]: { revenue: number, expenses: number } } = {};

    transactions.forEach(t => {
        if (t.status === 'Paid') {
            const month = format(new Date(t.date), 'MMM');
            if (!combinedData[month]) {
                combinedData[month] = { revenue: 0, expenses: 0 };
            }
            combinedData[month].revenue += t.amount;
        }
    });

    expenses.forEach(e => {
        const month = format(new Date(e.date), 'MMM');
         if (!combinedData[month]) {
            combinedData[month] = { revenue: 0, expenses: 0 };
        }
        combinedData[month].expenses += e.amount;
    });
    
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return monthOrder.map(month => ({
        name: month,
        revenue: combinedData[month]?.revenue || 0,
        expenses: combinedData[month]?.expenses || 0,
    })).filter(d => d.revenue > 0 || d.expenses > 0);
};

export function FinanceChart() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark";
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        setTransactions(await DataStore.getTransactions());
        // In a real app, you'd have getExpenses. For now, let's assume it's part of another store.
        // setExpenses(await DataStore.getExpenses());
    }
    fetchData();
  }, []);
  
  const data = useMemo(() => processFinancialData(transactions, expenses), [transactions, expenses]);

  const colors = {
      revenue: 'hsl(var(--primary))',
      expenses: isDarkMode ? 'hsl(var(--secondary) / 0.5)' : 'hsl(var(--secondary))',
      grid: 'hsl(var(--border))',
      ticks: 'hsl(var(--foreground))',
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
            tickFormatter={(value) => `₦${Number(value) / 1000}k`} 
            width={80}
            />
          <Tooltip
              contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
              }}
              formatter={(value: number) => `₦${value.toLocaleString()}`}
              cursor={{fill: 'hsl(var(--accent) / 0.5)'}}
          />
          <Bar dataKey="revenue" fill={colors.revenue} radius={[4, 4, 0, 0]} maxBarSize={30} />
          <Bar dataKey="expenses" fill={colors.expenses} radius={[4, 4, 0, 0]} maxBarSize={30} />
        </BarChart>
    </ResponsiveContainer>
  )
}
