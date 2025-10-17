
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
import type { Transaction } from "@/lib/finance-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { recentStudents as initialStudents, type Student } from "@/lib/admin-data";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ResponsiveCalendar } from "../ui/responsive-calendar";

type AddPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: Omit<Transaction, 'id'>) => void;
  onUpdatePayment: (payment: Transaction) => void;
  transactionToEdit: Transaction | null;
};

type FormValues = Omit<Transaction, 'id' | 'date'> & {
    date: Date;
};

const paymentTypes: Transaction['type'][] = ["Tuition", "Hostel", "Uniform", "Books"];
const paymentStatuses: Transaction['status'][] = ["Paid", "Pending", "Overdue"];

export function AddPaymentDialog({ isOpen, onClose, onAddPayment, onUpdatePayment, transactionToEdit }: AddPaymentDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
        studentName: "",
        type: "Tuition",
        amount: 0,
        date: new Date(),
        status: "Paid",
    }
  });
  const [students] = useLocalStorage<Student[]>("students", initialStudents);

  useEffect(() => {
    if (isOpen) {
        if (transactionToEdit) {
            setValue("studentName", transactionToEdit.studentName);
            setValue("type", transactionToEdit.type);
            setValue("amount", transactionToEdit.amount);
            setValue("date", new Date(transactionToEdit.date));
            setValue("status", transactionToEdit.status);
        } else {
            reset({
                studentName: "",
                type: "Tuition",
                amount: 0,
                date: new Date(),
                status: "Paid",
            });
        }
    }
  }, [isOpen, transactionToEdit, setValue, reset]);


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const transactionData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
    };
    if (transactionToEdit) {
        onUpdatePayment({ ...transactionToEdit, ...transactionData });
    } else {
        onAddPayment(transactionData);
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); }}}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{transactionToEdit ? 'Edit Payment' : 'Add New Payment'}</DialogTitle>
            <DialogDescription>{transactionToEdit ? 'Update the details of this transaction.' : 'Record a new payment transaction.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student</Label>
              <Controller
                name="studentName"
                control={control}
                rules={{ required: "Student is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {students.map(s => <SelectItem key={s.name} value={s.name}>{s.name} - {s.class}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.studentName && <p className="text-xs text-destructive">{errors.studentName.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Payment Type</Label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {paymentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" type="number" placeholder="e.g., 75000" {...register("amount", { required: true, valueAsNumber: true })} />
                {errors.amount && <p className="text-xs text-destructive">Amount is required.</p>}
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Controller
                    name="date"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                    <ResponsiveCalendar
                        selected={field.value}
                        onSelect={field.onChange}
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </ResponsiveCalendar>
                    )}
                />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="status">Payment Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {paymentStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{transactionToEdit ? 'Save Changes' : 'Add Payment'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
