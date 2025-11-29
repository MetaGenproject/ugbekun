
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { Enquiry } from "@/lib/admissions-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Class, initialClasses } from "@/lib/school-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type AddEnquiryDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddEnquiry: (enquiry: Omit<Enquiry, "id" | "status" | "enquiryDate">) => void;
};

type FormValues = Omit<Enquiry, "id" | "status" | "enquiryDate">;

export function AddEnquiryDialog({ isOpen, onClose, onAddEnquiry }: AddEnquiryDialogProps) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>();
  const [classes] = useLocalStorage<Class[]>("school-classes", initialClasses);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onAddEnquiry(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Log New Enquiry</DialogTitle>
                <DialogDescription>
                    Record details of a prospective parent's enquiry.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Prospective Student's Name</Label>
                    <Input id="studentName" {...register("studentName", { required: true })} placeholder="e.g., Bolanle Adeyemi" />
                    {errors.studentName && <p className="text-xs text-destructive">Student name is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="classOfInterest">Class of Interest</Label>
                    <Controller
                        name="classOfInterest"
                        control={control}
                        rules={{ required: "Class of interest is required" }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.classOfInterest && <p className="text-xs text-destructive">{errors.classOfInterest.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="parentName">Parent's Name</Label>
                    <Input id="parentName" {...register("parentName", { required: true })} placeholder="e.g., Mrs. Adeyemi" />
                    {errors.parentName && <p className="text-xs text-destructive">Parent's name is required.</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="parentPhone">Parent's Phone</Label>
                        <Input id="parentPhone" type="tel" {...register("parentPhone", { required: true })} placeholder="e.g., 08012345678" />
                         {errors.parentPhone && <p className="text-xs text-destructive">Phone is required.</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="parentEmail">Parent's Email</Label>
                        <Input id="parentEmail" type="email" {...register("parentEmail")} placeholder="e.g., adeyemi@example.com" />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Log Enquiry</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
