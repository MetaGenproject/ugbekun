
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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Resident, ResidentStatus, HostelType } from "@/lib/hostel-data";
import type { Student } from "@/lib/admin-data";
import { recentStudents as initialStudents } from "@/lib/admin-data";

type AddResidentDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddResident: (resident: Omit<Resident, 'id'>) => void;
    onUpdateResident: (resident: Resident) => void;
    residentToEdit: Resident | null;
};

type FormValues = Omit<Resident, 'id'>;

const residentStatuses: ResidentStatus[] = ["Checked-in", "Checked-out"];
const hostelTypes: HostelType[] = ["Boys' Hostel", "Girls' Hostel"];

export function AddResidentDialog({ isOpen, onClose, onAddResident, onUpdateResident, residentToEdit }: AddResidentDialogProps) {
  const { register, handleSubmit, control, reset, setValue } = useForm<FormValues>();
  const [students] = useLocalStorage<Student[]>("students", initialStudents);

  useEffect(() => {
    if (isOpen) {
        if (residentToEdit) {
            setValue("name", residentToEdit.name);
            setValue("hostel", residentToEdit.hostel);
            setValue("room", residentToEdit.room);
            setValue("status", residentToEdit.status);
        } else {
            reset({
                name: "",
                hostel: "Boys' Hostel",
                room: "",
                status: "Checked-in"
            });
        }
    }
  }, [residentToEdit, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (residentToEdit) {
         onUpdateResident({ ...residentToEdit, ...data });
    } else {
        onAddResident(data);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{residentToEdit ? "Edit Resident" : "Add New Resident"}</DialogTitle>
                <DialogDescription>
                    Assign a student to a hostel room.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Student Name</Label>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                           <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
                                <SelectContent>
                                    {students.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                                </SelectContent>
                           </Select>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="hostel">Hostel</Label>
                        <Controller
                            name="hostel"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        {hostelTypes.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="room">Room No.</Label>
                        <Input id="room" {...register("room", { required: true })} placeholder="e.g., A101" />
                    </div>
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
                                    {residentStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{residentToEdit ? "Save Changes" : "Add Resident"}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
