
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Notification, adminNotifications as initialAdminNotifications, iconMap } from "@/lib/notifications-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";

const Icon = ({ name }: { name: keyof typeof iconMap }) => {
    const LucideIcon = iconMap[name];
    if (!LucideIcon) return null;
    return <LucideIcon className="h-5 w-5 text-secondary-foreground" />;
};


export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useLocalStorage<Notification[]>("admin-notifications", initialAdminNotifications);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>All Notifications</CardTitle>
                </div>
                <Button variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="space-y-3">
                        {notifications.map(notification => (
                             <Link key={notification.id} href={notification.href || "#"} className={cn(
                                 "block p-4 rounded-lg border transition-colors",
                                 notification.read ? "bg-card hover:bg-muted/50" : "bg-secondary hover:bg-secondary/80"
                             )}>
                                <div className="flex items-start gap-4">
                                     <div className="h-10 w-10 rounded-lg bg-background grid place-items-center shrink-0 border">
                                        <Icon name={notification.icon} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn("text-sm font-semibold", notification.read && "font-medium")}>{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                                    )}
                                </div>
                             </Link>
                        ))}
                         {notifications.length === 0 && (
                            <div className="text-center text-muted-foreground py-16">
                                You have no notifications.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

    