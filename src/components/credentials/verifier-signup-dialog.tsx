
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

type VerifierSignUpDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (organization: string) => void;
};

type FormValues = {
    organization: string;
};

export function VerifierSignUpDialog({ isOpen, onClose, onConfirm }: VerifierSignUpDialogProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onConfirm(data.organization);
    reset();
    // Do not close the dialog here, let the parent component control it.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Register as a Verifier</DialogTitle>
                <DialogDescription>
                    Provide your organization's name to proceed with verification.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6">
                <Label htmlFor="organization">Organization Name</Label>
                <Input id="organization" {...register("organization", { required: true })} placeholder="e.g., University of Lagos" className="mt-2" />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Continue to Payment</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
