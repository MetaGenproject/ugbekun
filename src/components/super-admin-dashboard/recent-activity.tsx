
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { recentActivities } from '@/lib/super-admin-data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Notification, superAdminNotifications } from '@/lib/notifications-data';
import Link from 'next/link';

export function RecentActivity() {
    const [notifications] = useLocalStorage<Notification[]>('super-admin-notifications', superAdminNotifications);
    
    // Combine static and dynamic notifications for a more "live" feed
    const allActivities = [
        ...notifications.map(n => ({ key: `notif-${n.id}`, id: n.id, school: { name: n.title, logoUrl: '' }, description: n.description, timestamp: 'Just now' })),
        ...recentActivities.map(a => ({ ...a, key: `activity-${a.id}`}))
    ].sort((a,b) => b.id - a.id);


  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6">
        <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1 min-h-0">
        <ScrollArea className="h-72 -mx-6">
            <div className="px-6 space-y-6">
                {allActivities.slice(0, 5).map((activity) => (
                    <div key={activity.key} className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={activity.school.logoUrl} alt={activity.school.name} />
                            <AvatarFallback>{activity.school.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm">
                                <span className="font-semibold">{activity.school.name}</span> {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
      <div className="p-6 pt-4 mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href="/super-admin/history">View All Activity</Link>
        </Button>
      </div>
    </Card>
  );
}
