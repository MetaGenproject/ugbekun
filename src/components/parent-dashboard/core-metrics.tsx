/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Medal, CalendarCheck2, NotebookText, BookOpen } from 'lucide-react';

const metrics = [
    { title: "Current Average", value: "86%", icon: Medal },
    { title: "Attendance", value: "97%", icon: CalendarCheck2 },
    { title: "Homework", value: "92% done", icon: NotebookText },
    { title: "Reading (Week)", value: "3h 20m", icon: BookOpen },
];

export function CoreMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 shadow-lg h-full">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-secondary-foreground shadow-sm shrink-0">
                <metric.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{metric.title}</div>
                <div className="text-xl font-semibold tracking-tight">{metric.value}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
