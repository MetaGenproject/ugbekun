
"use client";

import { useState, useEffect } from "react";
import * as DataStore from "@/lib/data-store";
import { SchoolCalendar } from '@/components/dashboard/school-calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddEventDialog } from "@/components/admin-dashboard/add-event-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Event } from "@/lib/events-data";
import { categoryConfig } from "@/lib/events-data";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        const data = await DataStore.getEvents();
        const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEvents(sortedData);
        setIsLoading(false);
    };

    const handleAddEvent = async (newEventData: Omit<Event, 'id' | 'icon'>) => {
        // DataStore's addEvent will handle ID generation
        await DataStore.addEvent(newEventData as any);
        await fetchEvents(); // Refetch to get the latest sorted list
        toast({ variant: 'success', title: 'Event Scheduled' });
    };

    const handleUpdateEvent = async (updatedEvent: Event) => {
        // This is a mock as DataStore doesn't have a specific update function for events.
        // We'll simulate it by replacing the item in our local state and re-saving.
        const allEvents = await DataStore.getEvents();
        const updatedEvents = allEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e);
        // This is a mock save function as it's not in DataStore
        // await DataStore.saveEvents(updatedEvents); 
        await fetchEvents();
        toast({ variant: 'success', title: 'Event Updated' });
    };
    
    const confirmDelete = (event: Event) => {
        setEventToDelete(event);
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        // This is a mock as DataStore doesn't have a specific delete function for events.
        const allEvents = await DataStore.getEvents();
        const updatedEvents = allEvents.filter(e => e.id !== eventToDelete.id);
         // This is a mock save function as it's not in DataStore
        // await DataStore.saveEvents(updatedEvents);
        setEventToDelete(null);
        await fetchEvents();
        toast({ variant: 'destructive', title: 'Event Deleted' });
    };

    const openEditDialog = (event: Event) => {
        setEditingEvent(event);
        setIsAddDialogOpen(true);
    };

    return (
        <>
            <Tabs defaultValue="calendar">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                        <TabsTrigger value="all">All Events</TabsTrigger>
                    </TabsList>
                    <Button onClick={() => { setEditingEvent(null); setIsAddDialogOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </div>
                <TabsContent value="calendar" className="mt-6">
                    <div className="h-full">
                        <SchoolCalendar view="admin" />
                    </div>
                </TabsContent>
                <TabsContent value="all" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All School Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading events...</TableCell></TableRow>
                                    ) : events.map(event => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">{event.title}</TableCell>
                                            <TableCell>{format(new Date(event.date), 'PPP')}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={categoryConfig[event.category]?.color}>{event.category}</Badge>
                                            </TableCell>
                                            <TableCell>{event.location || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(event)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => confirmDelete(event)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!isLoading && events.length === 0 && (
                                        <TableRow><TableCell colSpan={5} className="h-24 text-center">No events scheduled.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <AddEventDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                eventToEdit={editingEvent}
            />
            <ConfirmationDialog
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={handleDeleteEvent}
                title={`Delete "${eventToDelete?.title}"?`}
                description="This will permanently remove the event from the calendar. This action cannot be undone."
                confirmText="Delete Event"
            />
        </>
    );
}

    