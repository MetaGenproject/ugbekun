
"use client"

import { useState, useMemo, useEffect } from 'react';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Event, initialEvents, categoryConfig, type EventCategory } from '@/lib/events-data';
import { type Assignment, initialAssignments } from '@/lib/student-data';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { format, addMonths, subMonths } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { AddEventDialog } from '../admin-dashboard/add-event-dialog';
import * as DataStore from '@/lib/data-store';
import { Button } from '../ui/button';
import { PlusCircle, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarEvent = Event & {
    type: 'event' | 'assignment';
}

type SchoolCalendarProps = {
    view: 'admin' | 'student' | 'parent';
}

export function SchoolCalendar({ view }: SchoolCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [assignments] = useLocalStorage<Assignment[]>("student-assignments", initialAssignments);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
        const data = await DataStore.getEvents();
        setEvents(data);
    };
    fetchEvents();
  }, []);

  const combinedEvents: CalendarEvent[] = useMemo(() => {
    const allEvents: CalendarEvent[] = events.map(e => ({ 
        ...e, 
        date: new Date(e.date), 
        type: 'event' as const, 
    }));

    if (view === 'student' || view === 'parent') {
        const studentAssignments = assignments
            .filter(a => !a.completed && a.date)
            .map(a => {
                const assignmentDate = new Date(a.date);
                 if (isNaN(assignmentDate.getTime())) return null;
                return {
                    id: `asgn-${a.id}`,
                    date: assignmentDate,
                    title: `Due: ${a.title}`,
                    category: 'Assignment' as EventCategory,
                    icon: categoryConfig['Assignment'].icon,
                    type: 'assignment' as const,
                }
            })
            .filter((a): a is CalendarEvent => a !== null);
        allEvents.push(...studentAssignments);
    }
    return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events, assignments, view]);
  
  const handleAddEvent = async (newEventData: Omit<Event, 'id' | 'icon'>) => {
    const newEvent: Event = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      icon: 'Calendar', 
    };
    await DataStore.addEvent(newEvent);
    const data = await DataStore.getEvents();
    setEvents(data);
  };

  const selectedDayEvents = combinedEvents.filter(
    (event) => selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );
  
  const Day: CalendarProps['components'] = {
    Day: ({ date: day, ...props }) => {
      const dayEvents = combinedEvents.filter(
        (event) => new Date(event.date).toDateString() === day.toDateString()
      );
      
      const uniqueCategories = Array.from(new Set(dayEvents.map(e => e.category)));

      return (
        <div {...props.buttonProps} className={cn(props.className, "relative h-full w-full")}>
            <span className="relative z-10">{format(day, 'd')}</span>
             {uniqueCategories.length > 0 && (
                <div className={cn("absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5",)}>
                  {uniqueCategories.slice(0, 3).map((category, i) => {
                      const config = categoryConfig[category as EventCategory];
                      if (!config) return null;
                      return <div key={i} className={cn('h-1.5 w-1.5 rounded-full', config.color.split(' ')[0])}></div>
                  })}
                </div>
            )}
        </div>
      );
    },
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-lg">
        <CardHeader className="p-4 border-b flex-row items-center justify-between">
             <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-base font-semibold text-center min-w-[140px]">{format(currentMonth, 'MMMM yyyy')}</h2>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            {view === 'admin' && (
                 <Button variant="outline" size="sm" onClick={() => setIsAddEventOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                </Button>
            )}
        </CardHeader>
        <CardContent className="p-2 sm:p-4 flex-1">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                <div className="rounded-lg flex items-center justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        components={Day}
                        className="w-full"
                        classNames={{
                            caption: "hidden",
                            nav: "hidden",
                        }}
                    />
                </div>
                <div className="border rounded-lg flex flex-col min-h-[300px] lg:min-h-0">
                    <h3 className="font-semibold text-sm p-3 border-b shrink-0">
                        Schedule for {selectedDate ? format(selectedDate, 'PPP') : 'Today'}
                    </h3>
                    <ScrollArea className="flex-1">
                        <div className="p-3 space-y-3">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event) => {
                                    const Icon = categoryConfig[event.category]?.icon;
                                    return (
                                        <div key={event.id} className="flex flex-col gap-2 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                            <div className="flex items-start gap-3">
                                                {Icon && <div className="h-9 w-9 rounded-lg bg-card grid place-items-center shrink-0 border"><Icon className="h-4 w-4 text-muted-foreground" /></div>}
                                                <div className="pt-1.5">
                                                    <p className="font-medium text-sm leading-tight">{event.title}</p>
                                                </div>
                                            </div>
                                            {(event.startTime || event.location) && (
                                                <div className="pl-12 space-y-2 text-xs text-muted-foreground">
                                                    {event.startTime && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3"/>
                                                            <span>{event.startTime}{event.endTime && ` - ${event.endTime}`}</span>
                                                        </div>
                                                    )}
                                                     {event.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3"/>
                                                            <span>{event.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {event.description && <p className="pl-12 text-xs text-muted-foreground">{event.description}</p>}
                                             <Badge variant="secondary" className={cn("text-xs w-fit ml-12", categoryConfig[event.category]?.color)}>{event.category}</Badge>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground text-center py-8 px-4">
                                    No events or deadlines for this day.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </CardContent>
      </Card>
      {view === 'admin' && (
        <AddEventDialog
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          onAddEvent={handleAddEvent}
          onUpdateEvent={() => {}} // Not implemented from here
          eventToEdit={null}
          selectedDate={selectedDate}
        />
      )}
    </>
  )
}
