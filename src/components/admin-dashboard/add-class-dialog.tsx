
"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Class } from "@/lib/school-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { ScrollArea } from "../ui/scroll-area";

type AddClassDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddClass: (newClass: Omit<Class, 'id'>) => void;
    onUpdateClass: (updatedClass: Class) => void;
    classToEdit: Class | null;
};

type FormValues = Omit<Class, 'id'>;

export function AddClassDialog({ isOpen, onClose, onAddClass, onUpdateClass, classToEdit }: AddClassDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [staff] = useLocalStorage<Staff[]>("school-staff", initialStaff);

  const teachers = staff.filter(s => s.department === "Academics");

  useEffect(() => {
    if (isOpen) {
        if (classToEdit) {
            setValue("name", classToEdit.name);
            setValue("teacher", classToEdit.teacher);
            setValue("studentCount", classToEdit.studentCount);
            setValue("subjects", classToEdit.subjects);
        } else {
            reset({
                name: "",
                teacher: "",
                studentCount: 0,
                subjects: 0
            });
        }
    }
  }, [classToEdit, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (classToEdit) {
         const updatedClass: Class = {
            ...classToEdit,
            ...data
         };
         onUpdateClass(updatedClass);
         toast({
            variant: "success",
            title: "Class Updated",
            description: `${data.name} has been successfully updated.`
         });
      } else {
        onAddClass(data);
        toast({
            variant: "success",
            title: "Class Added",
            description: `${data.name} has been added to the school.`
        });
      }
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>{classToEdit ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>
                Fill in the details for the academic class.
            </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="grid gap-4 py-6 px-1">
                  <div className="space-y-2">
                      <Label htmlFor="name">Class Name</Label>
                      <Input id="name" {...register("name", { required: "Name is required" })} placeholder="e.g., JSS 1A" />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="teacher">Form Teacher</Label>
                      <Controller
                          name="teacher"
                          control={control}
                          rules={{ required: "A teacher is required" }}
                          render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Select a teacher" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {teachers.map(t => (
                                          <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          )}
                      />
                      {errors.teacher && <p className="text-xs text-red-500">{errors.teacher.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="studentCount">Student Count</Label>
                          <Input id="studentCount" type="number" {...register("studentCount", { required: true, valueAsNumber: true, min: 0 })} placeholder="e.g., 30" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="subjects">Number of Subjects</Label>
                          <Input id="subjects" type="number" {...register("subjects", { required: true, valueAsNumber: true, min: 0 })} placeholder="e.g., 9" />
                      </div>
                  </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : classToEdit ? "Save Changes" : "Add Class"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
