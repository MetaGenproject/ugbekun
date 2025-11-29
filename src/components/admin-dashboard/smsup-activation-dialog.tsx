
"use client";

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
import { useForm, SubmitHandler } from "react-hook-form";

type SmsupActivationDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onActivate: (verificationFee: number) => void;
};

type FormValues = {
    verificationFee: number;
};

export function SmsupActivationDialog({ isOpen, onClose, onActivate }: SmsupActivationDialogProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
        verificationFee: 500,
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onActivate(data.verificationFee);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Activate SMSUP+</DialogTitle>
                <DialogDescription>
                    Set a fee for third-party credential verifications. This creates a new revenue stream for your school.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6">
                <Label htmlFor="verification-fee">Verification Fee (₦)</Label>
                <Input 
                    id="verification-fee" 
                    type="number" 
                    {...register("verificationFee", { required: true, valueAsNumber: true, min: 0 })} 
                    className="mt-2"
                />
                 <p className="text-xs text-muted-foreground mt-2">
                    This is the amount you will charge organizations (e.g., universities, employers) to verify a student's credential.
                </p>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Activate & Set Fee</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
