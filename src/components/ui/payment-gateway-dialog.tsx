
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Lock, Loader2, Check } from "lucide-react";
import { Logo } from "../logo";

type PaymentGatewayDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onPaymentSuccess: () => void;
    amount: number;
    description: string;
};

export function PaymentGatewayDialog({
    isOpen,
    onClose,
    onPaymentSuccess,
    amount,
    description,
}: PaymentGatewayDialogProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess();
        setTimeout(() => setStep("form"), 300); // Reset for next time
      }, 1500); // Show success for 1.5s
    }, 2000); // Simulate processing for 2s
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden" hideCloseButton>
        <AnimatePresence mode="wait">
            {step === 'form' && (
                 <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                >
                    <DialogHeader className="p-6 pb-0">
                         <div className="text-center mb-4">
                            <Logo className="h-8 mx-auto" />
                            <DialogTitle className="text-sm text-muted-foreground mt-2">{description}</DialogTitle>
                            <DialogDescription className="text-3xl font-bold tracking-tight mt-1 text-foreground">₦{amount.toLocaleString()}</DialogDescription>
                        </div>
                    </DialogHeader>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" />
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input id="expiry" placeholder="MM / YY" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input id="cvv" placeholder="123" />
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="p-6 pt-0 bg-muted/50">
                        <Button onClick={handlePay} className="w-full">
                            <Lock className="mr-2 h-4 w-4" /> Pay ₦{amount.toLocaleString()}
                        </Button>
                    </div>
                </motion.div>
            )}
            {step === 'processing' && (
                 <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center p-12 h-64"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Processing</DialogTitle>
                        <DialogDescription>Your payment is being processed.</DialogDescription>
                    </DialogHeader>
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="mt-4 font-medium">Processing payment...</p>
                    <p className="text-sm text-muted-foreground">Please do not close this window.</p>
                </motion.div>
            )}
             {step === 'success' && (
                 <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center p-12 h-64 bg-green-50 dark:bg-green-900/20"
                >
                    <DialogHeader className="sr-only">
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>Your payment was successful.</DialogDescription>
                    </DialogHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                        className="h-16 w-16 bg-green-600 text-white rounded-full flex items-center justify-center"
                    >
                        <Check className="h-8 w-8" />
                    </motion.div>
                    <p className="mt-4 text-lg font-semibold text-green-700 dark:text-green-300">Payment Successful</p>
                </motion.div>
            )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
