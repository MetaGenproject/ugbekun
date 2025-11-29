/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { upcomingEvents } from '@/lib/parent-data';
import { ScrollArea } from '../ui/scroll-area';

export function UpcomingEvents() {
  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming</CardTitle>
        <div className="text-sm text-muted-foreground">March</div>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-full">
            <div className="p-6 pt-0 space-y-4">
                {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center text-secondary-foreground">
                    <event.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                    <div className="text-sm font-medium tracking-tight">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.details}</div>
                    </div>
                    <Button variant="outline" size="sm">{event.action}</Button>
                </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
