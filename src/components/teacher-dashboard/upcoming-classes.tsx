/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const upcomingClasses = [
    { time: '09:00', subject: 'Mathematics', class: 'JSS 2A', isCurrent: false },
    { time: '10:00', subject: 'English Language', class: 'SSS 1A', isCurrent: true },
    { time: '11:00', subject: 'Physics', class: 'SSS 1A', isCurrent: false },
    { time: '1:00', subject: 'Further Maths', class: 'JSS 2B', isCurrent: false },
];


export function UpcomingClasses() {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Today's Schedule</CardTitle>
        <Button variant="outline" size="sm">View Full</Button>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 min-h-0">
        <ScrollArea className="h-full -mr-4 pr-4">
            <div className="relative space-y-6">
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border -z-10"></div>
                {upcomingClasses.map((item) => (
                <div key={item.time} className="relative flex items-start gap-4 group">
                    <div className="h-10 flex-shrink-0 flex items-center">
                        <div className={cn(
                            "w-10 text-xs text-right",
                            item.isCurrent ? "font-bold text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )}>
                            {item.time}
                        </div>
                    </div>
                    <div className={cn(
                        "h-10 w-10 rounded-full grid place-items-center bg-background border-4 shrink-0",
                        item.isCurrent ? 'border-primary' : 'border-border group-hover:border-primary/50'
                    )}>
                       {item.isCurrent && <span className="relative flex h-3 w-3">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>}
                    </div>
                    <div className={cn(
                        "flex-1 min-w-0 rounded-lg p-3 transition-colors",
                        item.isCurrent ? "bg-secondary" : "bg-card group-hover:bg-muted"
                    )}>
                        <div className="font-medium truncate">{item.subject}</div>
                        <div className="text-xs text-muted-foreground">{item.class}</div>
                    </div>
                </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
