
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
import type { Route, RouteStatus } from "@/lib/transport-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { statusStyles } from "@/lib/transport-data";

type AddRouteDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddRoute: (route: Omit<Route, 'id'>) => void;
    onUpdateRoute: (route: Route) => void;
    routeToEdit: Route | null;
};

type FormValues = Omit<Route, 'id'>;

const routeStatuses: RouteStatus[] = ["Idle", "On Route", "Maintenance"];

export function AddRouteDialog({ isOpen, onClose, onAddRoute, onUpdateRoute, routeToEdit }: AddRouteDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
        if (routeToEdit) {
            setValue("routeName", routeToEdit.routeName);
            setValue("driverName", routeToEdit.driverName);
            setValue("busNumber", routeToEdit.busNumber);
            setValue("students", routeToEdit.students);
            setValue("status", routeToEdit.status);
        } else {
            reset({
                routeName: "",
                driverName: "",
                busNumber: "",
                students: 0,
                status: "Idle"
            });
        }
    }
  }, [routeToEdit, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (routeToEdit) {
         onUpdateRoute({ ...routeToEdit, ...data });
    } else {
        onAddRoute(data);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{routeToEdit ? "Edit Route" : "Add New Route"}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the transport route.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="routeName">Route Name</Label>
                    <Input id="routeName" {...register("routeName", { required: true })} placeholder="e.g., Lekki-Ajah" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="driverName">Driver's Name</Label>
                    <Input id="driverName" {...register("driverName", { required: true })} placeholder="e.g., Mr. Sam" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="busNumber">Bus Number</Label>
                        <Input id="busNumber" {...register("busNumber", { required: true })} placeholder="e.g., BUS-012" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="students">No. of Students</Label>
                        <Input id="students" type="number" {...register("students", { required: true, valueAsNumber: true })} placeholder="e.g., 25" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    {routeStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{routeToEdit ? "Save Changes" : "Add Route"}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
