
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
import type { Expense } from "@/lib/finance-data";

type AddExpenseDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  expenseToEdit: Expense | null;
};

type FormValues = Omit<Expense, 'id' | 'date'>;

const expenseCategories = ["Salaries", "Utilities", "Supplies", "Maintenance", "Marketing", "Miscellaneous"];

export function AddExpenseDialog({ isOpen, onClose, onAddExpense, onUpdateExpense, expenseToEdit }: AddExpenseDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        setValue('item', expenseToEdit.item);
        setValue('amount', expenseToEdit.amount);
        setValue('category', expenseToEdit.category);
      } else {
        reset();
      }
    }
  }, [isOpen, expenseToEdit, setValue, reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (expenseToEdit) {
        onUpdateExpense({ ...expenseToEdit, ...data });
    } else {
        onAddExpense({ ...data, date: new Date().toISOString().split('T')[0] });
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); }}}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{expenseToEdit ? 'Edit Expense' : 'Log New Expense'}</DialogTitle>
            <DialogDescription>
              {expenseToEdit ? 'Update the details of this expense.' : 'Record an operational expense for the school.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="item">Expense Item</Label>
              <Input id="item" {...register("item", { required: true })} placeholder="e.g., Diesel for Generator" />
              {errors.item && <p className="text-xs text-destructive">Item is required.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input id="amount" type="number" {...register("amount", { required: true, valueAsNumber: true })} placeholder="e.g., 50000" />
                {errors.amount && <p className="text-xs text-destructive">Amount is required.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {errors.category && <p className="text-xs text-destructive">Category is required.</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{expenseToEdit ? 'Save Changes' : 'Log Expense'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
