
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ResponsiveCalendar } from "../ui/responsive-calendar";

type ScheduleTestDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (date: Date, instructions: string) => void;
};

type FormValues = {
    date: Date;
    instructions: string;
};

export function ScheduleTestDialog({ isOpen, onClose, onSchedule }: ScheduleTestDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
        date: new Date(),
        instructions: "The entrance examination will cover Mathematics, English, and General Knowledge. Please bring your writing materials. The test will last for 90 minutes."
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSchedule(data.date, data.instructions);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Schedule Entrance Test</DialogTitle>
                <DialogDescription>
                    Set a date and provide instructions for the screening test.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="date">Test Date</Label>
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
                    {errors.date && <p className="text-xs text-destructive">Test date is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea id="instructions" placeholder="e.g., The exam will cover Mathematics, English..." {...register("instructions", { required: true })} rows={5} />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Schedule & Notify</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
