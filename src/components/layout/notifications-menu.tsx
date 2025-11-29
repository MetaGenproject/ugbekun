/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import type { Notification } from '@/lib/notifications-data';
import { 
    adminNotifications,
    teacherNotifications,
    studentNotifications,
    parentNotifications,
    superAdminNotifications,
    iconMap
} from '@/lib/notifications-data';
import { ScrollArea } from '../ui/scroll-area';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';
import { PreloaderLink } from '../ui/preloader-link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";

const Icon = ({ name }: { name: keyof typeof iconMap }) => {
    const LucideIcon = iconMap[name];
    if (!LucideIcon) return null;
    return <LucideIcon className="h-5 w-5 text-secondary-foreground" />;
};

const initialNotificationsMap = {
    'admin': adminNotifications,
    'teacher': teacherNotifications,
    'student': studentNotifications,
    'parent': parentNotifications,
    'super-admin': superAdminNotifications,
};

type NotificationsMenuProps = {
    userRole: 'super-admin' | 'admin' | 'teacher' | 'parent' | 'student';
};

export function NotificationsMenu({ userRole }: NotificationsMenuProps) {
    const storageKey = `${userRole}-notifications`;
    const initialData = initialNotificationsMap[userRole];
    
    const [notifications, setNotifications] = useLocalStorage<Notification[]>(storageKey, initialData);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);
    
    const markAllAsRead = () => {
        if (unreadCount > 0) {
            setTimeout(() => {
                setNotifications(
                    notifications.map(n => ({...n, read: true}))
                );
            }, 500);
        }
    }
    
    const unreadNotifications = notifications.filter(n => !n.read);

    return (
        <DropdownMenu onOpenChange={(open) => {
            setIsOpen(open);
            if (open) {
                markAllAsRead();
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1.5 flex h-4 w-4">
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive text-destructive-foreground text-[10px] items-center justify-center">
                                {unreadCount}
                            </span>
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-3 border-b">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                </div>
                 <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto rounded-none bg-transparent p-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="unread">Unread <Badge variant="destructive" className="ml-2 h-4 px-1.5">{unreadNotifications.length}</Badge></TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-80">
                        <TabsContent value="all" className="m-0">
                             <div className="p-1">
                                {notifications.map(notification => (
                                    <NotificationItem key={notification.id} notification={notification} onLinkClick={() => setIsOpen(false)} />
                                ))}
                                 {notifications.length === 0 && <EmptyState />}
                            </div>
                        </TabsContent>
                        <TabsContent value="unread" className="m-0">
                             <div className="p-1">
                                {unreadNotifications.map(notification => (
                                    <NotificationItem key={notification.id} notification={notification} onLinkClick={() => setIsOpen(false)} />
                                ))}
                                {unreadNotifications.length === 0 && <EmptyState isUnreadTab={true} />}
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
                <DropdownMenuSeparator />
                <div className="p-1">
                    <DropdownMenuItem asChild>
                        <PreloaderLink href={`/${userRole}/notifications`} className="flex items-center justify-center h-8">
                            View all notifications
                        </PreloaderLink>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function NotificationItem({ notification, onLinkClick }: { notification: Notification, onLinkClick: () => void }) {
    return (
        <DropdownMenuItem asChild className="h-auto items-start gap-3 whitespace-normal cursor-pointer p-2.5">
            <PreloaderLink href={notification.href || '#'} onClick={onLinkClick}>
                <div className="relative h-10 w-10 shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center">
                        <Icon name={notification.icon} />
                    </div>
                </div>
                <div className="flex-1">
                    <p className={cn("text-sm", !notification.read && "font-semibold")}>{notification.title}</p>
                    <p className="text-xs text-muted-foreground font-normal">{notification.description}</p>
                </div>
                {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                )}
            </PreloaderLink>
        </DropdownMenuItem>
    )
}

function EmptyState({ isUnreadTab = false } : { isUnreadTab?: boolean }) {
    return (
        <div className="text-center text-sm text-muted-foreground py-16 px-4">
            <Bell className="mx-auto h-8 w-8 mb-2" />
            <p className="font-medium">{isUnreadTab ? "All caught up!" : "No notifications yet"}</p>
            <p className="text-xs">{isUnreadTab ? "You have no unread notifications." : "New updates will appear here."}</p>
        </div>
    )
}
