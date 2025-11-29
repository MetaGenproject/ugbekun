/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Notification, teacherNotifications } from '@/lib/notifications-data';
import Link from 'next/link';

export function RecentActivity() {
    const [notifications] = useLocalStorage<Notification[]>('teacher-notifications', teacherNotifications);
    
    // Combine static and dynamic notifications for a more "live" feed
    const allActivities = [
        ...notifications.map(n => ({ key: `notif-${n.id}`, id: n.id, user: { name: n.title, avatarUrl: '' }, description: n.description, timestamp: 'Just now' })),
    ].sort((a,b) => b.id - a.id).slice(0, 5);


  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 min-h-0">
        <ScrollArea className="h-full -mx-6">
            <div className="px-6 space-y-6">
                {allActivities.map((activity) => (
                    <div key={activity.key} className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm">
                                <span className="font-semibold">{activity.user.name}</span> {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                    </div>
                ))}
                 {allActivities.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No recent activity.
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
