
"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { School } from "@/lib/super-admin-data";
import { useEffect } from "react";
import type { Staff } from "@/lib/hr-data";

type AddSchoolDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSchool: (school: Omit<School, 'id' | 'logoUrl' | 'verified' | 'coverImageUrl'>, admin: { name: string, email: string }) => void;
  onUpdateSchool: (school: School) => void;
  schoolToEdit: School | null;
};

type FormValues = Omit<School, 'id' | 'logoUrl' | 'verified' | 'coverImageUrl'> & {
    adminName: string;
    adminEmail: string;
};

export function AddSchoolDialog({ isOpen, onClose, onAddSchool, onUpdateSchool, schoolToEdit }: AddSchoolDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
        if (schoolToEdit) {
            setValue("name", schoolToEdit.name);
            setValue("status", schoolToEdit.status);
            setValue("plan", schoolToEdit.plan);
            setValue("students", schoolToEdit.students);
            setValue("teachers", schoolToEdit.teachers);
            setValue("revenue", schoolToEdit.revenue);
            setValue("rating", schoolToEdit.rating);
            setValue("state", schoolToEdit.state);
            setValue("lga", schoolToEdit.lga);
            setValue("system", schoolToEdit.system);
            // Admin fields are not editable in this flow for simplicity
            setValue("adminName", "Nabila A."); 
            setValue("adminEmail", "admin@ugbekun.com"); 
        } else {
            reset({
                name: "",
                status: "Active",
                plan: "Growth",
                students: 0,
                teachers: 0,
                revenue: 0,
                rating: 4.5,
                state: "Lagos",
                lga: "Ikeja",
                system: "Standard",
                adminName: "",
                adminEmail: ""
            });
        }
    }
  }, [schoolToEdit, isOpen, reset, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { adminName, adminEmail, ...schoolData } = data;
    if (schoolToEdit) {
        onUpdateSchool({ ...schoolToEdit, ...schoolData });
    } else {
        onAddSchool(schoolData, { name: adminName, email: adminEmail });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); }}}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{schoolToEdit ? 'Edit School' : 'Onboard New School'}</DialogTitle>
            <DialogDescription>Fill in the details for the school and its primary administrator.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input id="name" placeholder="e.g., Graceland Academy" {...register("name", { required: true })} />
              {errors.name && <p className="text-xs text-destructive">School name is required.</p>}
            </div>
            {!schoolToEdit && (
              <>
                <div className="space-y-2">
                    <Label htmlFor="adminName">Administrator Name</Label>
                    <Input id="adminName" placeholder="e.g., Ada Okoro" {...register("adminName", { required: !schoolToEdit })} />
                    {errors.adminName && <p className="text-xs text-destructive">Admin name is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="adminEmail">Administrator Email</Label>
                    <Input id="adminEmail" type="email" placeholder="e.g., ada@graceland.com" {...register("adminEmail", { required: !schoolToEdit })} />
                    {errors.adminEmail && <p className="text-xs text-destructive">Admin email is required.</p>}
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="plan">Plan</Label>
                    <Controller
                        name="plan"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Starter">Starter</SelectItem>
                                    <SelectItem value="Growth">Growth</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{schoolToEdit ? 'Save Changes' : 'Add School'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
