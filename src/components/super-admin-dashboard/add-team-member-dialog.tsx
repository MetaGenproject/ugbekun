
"use client";

import { useEffect } from "react";
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
import type { TeamMember } from "@/lib/team-data";
import { useToast } from "@/hooks/use-toast";

type AddTeamMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  memberToEdit: TeamMember | null;
};

type FormValues = Omit<TeamMember, 'id'>;

const departments: TeamMember['department'][] = ["Leadership", "Engineering", "Marketing", "Operations"];
const statuses: TeamMember['status'][] = ["Active", "On Leave", "Inactive"];

export function AddTeamMemberDialog({ isOpen, onClose, onAddMember, onUpdateMember, memberToEdit }: AddTeamMemberDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setValue("name", memberToEdit.name);
        setValue("email", memberToEdit.email);
        setValue("role", memberToEdit.role);
        setValue("department", memberToEdit.department);
        setValue("status", memberToEdit.status);
      } else {
        reset({
          name: "",
          email: "",
          role: "",
          department: "Engineering",
          status: "Active",
        });
      }
    }
  }, [isOpen, memberToEdit, setValue, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (memberToEdit) {
        onUpdateMember({ ...memberToEdit, ...data });
        toast({ variant: 'success', title: 'Member Updated' });
    } else {
        onAddMember(data);
        toast({ variant: 'success', title: 'Invitation Sent', description: `${data.name} has been invited to the team.` });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{memberToEdit ? "Edit Team Member" : "Invite New Member"}</DialogTitle>
            <DialogDescription>Fill in the details to manage team access.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name", { required: true })} placeholder="e.g., John Doe" />
              {errors.name && <p className="text-xs text-destructive">Name is required.</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email", { required: true })} placeholder="e.g., john.doe@ugbekun.com" />
              {errors.email && <p className="text-xs text-destructive">Email is required.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" {...register("role", { required: true })} placeholder="e.g., Lead Developer" />
                    {errors.role && <p className="text-xs text-destructive">Role is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
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
                                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{memberToEdit ? "Save Changes" : "Send Invite"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
