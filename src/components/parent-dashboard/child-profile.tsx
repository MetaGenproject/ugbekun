

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useTheme } from 'next-themes';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const attendanceData = [
    { name: 'Present', value: 97 },
    { name: 'Late', value: 2 },
    { name: 'Absent', value: 1 },
];

export function ChildProfile() {
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';
    const studentId = 'UC-AB-2024'; // Mock for Aisha Bello, Maya's equivalent
    const profileImage = PlaceHolderImages.find(p => p.id === 'parent-child-1');


    const colors = {
        present: 'hsl(var(--primary))',
        late: 'hsl(var(--secondary))',
        absent: 'hsl(var(--destructive))',
        background: isDarkMode ? '#0f224c' : '#ffffff',
        tooltipBg: isDarkMode ? 'hsl(222 70% 22%)' : 'hsl(228 10% 97%)',
        tooltipText: isDarkMode ? 'hsl(228 10% 97%)' : 'hsl(222 70% 22%)',
    };
    const PIE_COLORS = [colors.present, colors.late, colors.absent];

  return (
    <Card className="p-6 shadow-lg h-full flex flex-col">
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full -mr-6 pr-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden border border-border">
                {profileImage && <Image src={profileImage.imageUrl} alt="Maya" width={56} height={56} />}
              </div>
              <div className="flex-1">
                <div className="text-base font-medium tracking-tight">Maya Johnson</div>
                <div className="text-xs text-muted-foreground">Grade 6 • Class B</div>
              </div>
               <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                <Link href={`/p/${studentId}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="text-lg font-semibold tracking-tight">11</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Homeroom</div>
                <div className="text-lg font-semibold tracking-tight">Carter</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Bus</div>
                <div className="text-lg font-semibold tracking-tight">R-12</div>
              </Card>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium tracking-tight">Year Attendance</div>
                <div className="text-xs text-muted-foreground">97%</div>
              </div>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipText, borderRadius: '0.5rem', border: 'none' }}
                            formatter={(value: number, name: string) => [`${value}%`, name]}
                        />
                        <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            innerRadius="70%"
                            outerRadius="100%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke={colors.background}
                            strokeWidth={2}
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-medium tracking-tight">Switch Child</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="rounded-full">Maya</Button>
                <Button variant="outline" size="sm" className="rounded-full">Ethan</Button>
                <Button variant="outline" size="sm" className="rounded-full">Ava</Button>
              </div>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
