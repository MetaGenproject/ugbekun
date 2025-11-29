
"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
import { ResponsiveCalendar } from "../ui/responsive-calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type AddTaskDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddTask: (task: { title: string; course: string; date?: Date }) => void;
};

type FormValues = {
    title: string;
    course: string;
    date?: Date;
};

export function AddTaskDialog({ isOpen, onClose, onAddTask }: AddTaskDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      onAddTask({ title: data.title, course: data.course, date: data.date });
      toast({ variant: "success", title: "Task Added", description: `${data.title} has been added to your list.`});
      setIsLoading(false);
      reset();
      onClose();
    }, 500);
  };
  
   useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        course: "",
        date: new Date(),
      });
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Add a New Task</DialogTitle>
                <DialogDescription>
                    Add a personal task or study reminder to your assignment list.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" placeholder="e.g., Review Chapter 3 for Math" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="course">Subject / Course (Optional)</Label>
                    <Input id="course" placeholder="e.g., Mathematics" {...register("course")} />
                </div>
                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <ResponsiveCalendar
                                selected={field.value}
                                onSelect={field.onChange}
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </ResponsiveCalendar>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Task"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
