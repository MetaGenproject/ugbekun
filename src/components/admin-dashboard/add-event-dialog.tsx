
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import type { Event, EventCategory } from "@/lib/events-data";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { categoryConfig } from "@/lib/events-data";
import { ResponsiveCalendar } from "../ui/responsive-calendar";
import { ScrollArea } from "../ui/scroll-area";

type AddEventDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddEvent: (event: Omit<Event, 'id' | 'icon'>) => void;
    onUpdateEvent: (event: Event) => void;
    eventToEdit: Event | null;
    selectedDate?: Date;
};

type FormValues = Omit<Event, 'id' | 'icon' | 'date'> & {
    date: Date;
};

export function AddEventDialog({ isOpen, onClose, onAddEvent, onUpdateEvent, eventToEdit, selectedDate }: AddEventDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setValue("title", eventToEdit.title);
        setValue("date", new Date(eventToEdit.date));
        setValue("category", eventToEdit.category);
        setValue("description", eventToEdit.description);
        setValue("location", eventToEdit.location);
        setValue("startTime", eventToEdit.startTime);
        setValue("endTime", eventToEdit.endTime);
      } else {
        reset({
          title: "",
          date: selectedDate || new Date(),
          category: "Academic",
          description: "",
          location: "",
          startTime: "",
          endTime: "",
        });
      }
    }
  }, [eventToEdit, selectedDate, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (eventToEdit) {
        const updatedEvent: Event = {
            ...eventToEdit,
            ...data,
        };
        onUpdateEvent(updatedEvent);
    } else {
        onAddEvent(data);
        toast({
            variant: "success",
            title: "Event Scheduled",
            description: `${data.title} has been added to the calendar.`
        });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>{eventToEdit ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
                Fill in the details for the school event.
            </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] py-6 px-1">
                <div className="grid gap-4 pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" {...register("title", { required: "Title is required" })} />
                        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" {...register("description")} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                <ResponsiveCalendar
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    variant="outline"
                                    className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </ResponsiveCalendar>
                                )}
                            />
                            {errors.date && <p className="text-xs text-red-500">Date is required</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(categoryConfig).map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="location">Location (Optional)</Label>
                        <Input id="location" {...register("location")} placeholder="e.g., School Hall, Field" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time (Optional)</Label>
                            <Input id="startTime" type="time" {...register("startTime")} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="endTime">End Time (Optional)</Label>
                            <Input id="endTime" type="time" {...register("endTime")} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">
                {eventToEdit ? "Save Changes" : "Add Event"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
