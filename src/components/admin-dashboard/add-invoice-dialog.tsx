
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
import type { Invoice } from "@/lib/finance-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { recentStudents as initialStudents, type Student } from "@/lib/admin-data";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ResponsiveCalendar } from "../ui/responsive-calendar";

type AddInvoiceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
};

type FormValues = Omit<Invoice, 'id' | 'status' | 'dueDate'> & {
    dueDate: Date;
};

export function AddInvoiceDialog({ isOpen, onClose, onAddInvoice }: AddInvoiceDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
      defaultValues: {
        studentName: "",
        amount: 75000,
        dueDate: new Date(),
      }
  });
  const [students] = useLocalStorage<Student[]>("students", initialStudents);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const invoiceData = {
        ...data,
        dueDate: format(data.dueDate, "yyyy-MM-dd"),
        status: 'Pending' as const
    };
    onAddInvoice(invoiceData);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); }}}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>Generate and send a fee invoice to a student.</DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" type="number" placeholder="e.g., 75000" {...register("amount", { required: true, valueAsNumber: true })} />
                {errors.amount && <p className="text-xs text-destructive">Amount is required.</p>}
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Controller
                    name="dueDate"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Invoice</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
