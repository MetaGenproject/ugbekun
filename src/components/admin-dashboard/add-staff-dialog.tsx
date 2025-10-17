

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
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import type { Staff } from "@/lib/hr-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialDepartments, initialClasses, initialSubjects } from "@/lib/school-data";
import { X } from "lucide-react";

type AddStaffDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddStaff: (staff: Staff) => void;
    onUpdateStaff: (staff: Staff) => void;
    staffToEdit: Staff | null;
};

type FormValues = Omit<Staff, 'id' | 'avatar' | 'performance'>;

export function AddStaffDialog({ isOpen, onClose, onAddStaff, onUpdateStaff, staffToEdit }: AddStaffDialogProps) {
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
      defaultValues: {
          assignedClasses: [],
      }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "assignedClasses" });
  const [isLoading, setIsLoading] = useState(false);
  const [departments] = useLocalStorage<string[]>("school-departments", initialDepartments);
  const [classes] = useLocalStorage<string[]>("school-classes", initialClasses.map(c => c.name));
  const [subjects] = useLocalStorage<string[]>("school-subjects", initialSubjects.map(s => s.name));
  const { toast } = useToast();
  
  const teacherType = watch('teacherType');

  useEffect(() => {
    if (staffToEdit) {
      reset(staffToEdit);
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "Academics",
        salary: 0,
        status: "Active",
        teacherType: 'Subject Teacher',
        formClass: undefined,
        assignedClasses: [],
      });
    }
  }, [staffToEdit, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (staffToEdit) {
         const updatedStaff: Staff = {
            ...staffToEdit,
            ...data
         };
         onUpdateStaff(updatedStaff);
         toast({
            variant: "success",
            title: "Staff Member Updated",
            description: `${data.name}'s details have been successfully updated.`
         });
      } else {
        const newStaff: Staff = {
            ...data,
            id: `stf-${Date.now()}`,
            avatar: `https://i.pravatar.cc/40?u=${data.email}`,
            address: "123 School Lane, Lagos", // Mock address
            performance: 80
        };
        onAddStaff(newStaff);
        toast({
            variant: "success",
            title: "Staff Member Added",
            description: `${data.name} has been successfully added to the staff list.`
        });
      }
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
            <DialogTitle>{staffToEdit ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
                Fill in the details for the staff member.
            </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] py-6 px-1">
              <div className="grid gap-4 pr-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="e.g., Adaobi Okoro" {...register("name", { required: "Name is required" })} />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="ada.okoro@example.com" {...register("email", { required: "Email is required" })} />
                          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" placeholder="08012345678" {...register("phone", { required: "Phone is required" })} />
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="role">Role / Title</Label>
                      <Input id="role" placeholder="e.g., Head of Admissions" {...register("role", { required: "Role is required" })} />
                      {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label>Department</Label>
                          <Controller name="department" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select>
                          )} />
                      </div>
                      <div className="space-y-2">
                          <Label>Salary (Monthly, ₦)</Label>
                          <Input type="number" placeholder="e.g., 250000" {...register("salary", { required: "Salary is required", valueAsNumber: true })} />
                          {errors.salary && <p className="text-xs text-red-500">{errors.salary.message}</p>}
                      </div>
                  </div>
                  
                  {watch('department') === 'Academics' && (
                    <div className="p-4 border rounded-lg bg-muted/50 mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Teacher Type</Label>
                          <Controller name="teacherType" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Form Teacher">Form Teacher</SelectItem>
                                    <SelectItem value="Subject Teacher">Subject Teacher</SelectItem>
                                    <SelectItem value="Both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                          )} />
                        </div>

                        {(teacherType === 'Form Teacher' || teacherType === 'Both') && (
                           <div className="space-y-2">
                            <Label>Form Class</Label>
                             <Controller name="formClass" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Assign a main class"/></SelectTrigger><SelectContent>{classes.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select>
                            )} />
                          </div>
                        )}

                        {(teacherType === 'Subject Teacher' || teacherType === 'Both') && (
                          <div className="space-y-4">
                            <Label>Subject Assignments</Label>
                             {fields.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-3 gap-2 items-center">
                                    <Controller name={`assignedClasses.${index}.class` as const} control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Class"/></SelectTrigger><SelectContent>{classes.map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select>
                                    )} />
                                     <Controller name={`assignedClasses.${index}.subject` as const} control={control} render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Subject"/></SelectTrigger><SelectContent>{subjects.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent></Select>
                                    )} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><X className="h-4 w-4"/></Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ class: '', subject: '', students: 0 })}>Add Subject Assignment</Button>
                          </div>
                        )}
                    </div>
                  )}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : staffToEdit ? "Save Changes" : "Add Staff Member"}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
