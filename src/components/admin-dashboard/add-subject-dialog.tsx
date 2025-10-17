
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
import { type Subject } from "@/lib/school-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";
import { ScrollArea } from "../ui/scroll-area";

type AddSubjectDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddSubject: (subject: Omit<Subject, 'id' | 'progress' | 'description' | 'imageId' | 'syllabus'>) => void;
    onUpdateSubject: (subject: Subject) => void;
    subjectToEdit: Subject | null;
};

type FormValues = Omit<Subject, 'id' | 'progress' | 'description' | 'imageId' | 'syllabus'>;

export function AddSubjectDialog({ isOpen, onClose, onAddSubject, onUpdateSubject, subjectToEdit }: AddSubjectDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [staff] = useLocalStorage<Staff[]>("school-staff", initialStaff);

  const teachers = staff.filter(s => s.department === "Academics");

  useEffect(() => {
    if (isOpen) {
        if (subjectToEdit) {
        setValue("name", subjectToEdit.name);
        setValue("code", subjectToEdit.code);
        setValue("category", subjectToEdit.category);
        setValue("teacher", subjectToEdit.teacher);
        } else {
        reset({
            name: "",
            code: "",
            category: "Core",
            teacher: ""
        });
        }
    }
  }, [subjectToEdit, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (subjectToEdit) {
         const updatedSubject: Subject = {
            ...subjectToEdit,
            ...data
         };
         onUpdateSubject(updatedSubject);
         toast({
            variant: "success",
            title: "Subject Updated",
            description: `${data.name} has been successfully updated.`
         });
      } else {
        onAddSubject(data);
        toast({
            variant: "success",
            title: "Subject Added",
            description: `${data.name} has been added to the curriculum.`
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
            <DialogTitle>{subjectToEdit ? "Edit Subject" : "Add New Subject"}</DialogTitle>
            <DialogDescription>
                Fill in the details for the academic subject.
            </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="grid gap-4 py-6 px-1">
                  <div className="space-y-2">
                      <Label htmlFor="name">Subject Name</Label>
                      <Input id="name" {...register("name", { required: "Name is required" })} placeholder="e.g., Mathematics" />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="code">Subject Code</Label>
                          <Input id="code" {...register("code", { required: "Code is required" })} placeholder="e.g., MTH101" />
                          {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Controller
                              name="category"
                              control={control}
                              render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Core">Core</SelectItem>
                                          <SelectItem value="Science">Science</SelectItem>
                                          <SelectItem value="Arts">Arts</SelectItem>
                                          <SelectItem value="Commercial">Commercial</SelectItem>
                                          <SelectItem value="Vocational">Vocational</SelectItem>
                                      </SelectContent>
                                  </Select>
                              )}
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="teacher">Assigned Teacher</Label>
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
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : subjectToEdit ? "Save Changes" : "Add Subject"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
