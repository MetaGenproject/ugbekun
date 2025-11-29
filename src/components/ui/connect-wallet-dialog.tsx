
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Check, Wallet, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectWalletDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (address: string) => void;
    title?: string;
};

const wallets = [
    { name: "MetaMask", icon: Wallet },
    { name: "WalletConnect", icon: Wallet },
    { name: "Coinbase Wallet", icon: Wallet },
];

export function ConnectWalletDialog({
    isOpen,
    onClose,
    onConnect,
    title = "Connect Wallet"
}: ConnectWalletDialogProps) {
  const [step, setStep] = useState<"select" | "connecting" | "success">("select");
  const { toast } = useToast();

  const handleSelectWallet = () => {
    setStep("connecting");
    setTimeout(() => {
      setStep("success");
      const mockAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      toast({ variant: 'success', title: 'Wallet Connected', description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}` });
      setTimeout(() => {
        onConnect(mockAddress);
        setTimeout(() => setStep("select"), 300);
      }, 1000);
    }, 1500);
  };
  
  const handleClose = () => {
      if (step !== 'connecting') {
          onClose();
      }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden" hideCloseButton={step === 'connecting'}>
        <AnimatePresence mode="wait">
            {step === 'select' && (
                 <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                >
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Choose your preferred wallet to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 pt-0 space-y-3">
                        {wallets.map(wallet => (
                            <Button key={wallet.name} variant="outline" className="w-full justify-between h-14" onClick={handleSelectWallet}>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-secondary grid place-items-center">
                                        <wallet.icon className="h-5 w-5" />
                                    </div>
                                    <span>{wallet.name}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        ))}
                    </div>
                </motion.div>
            )}
            {step === 'connecting' && (
                 <motion.div
                    key="connecting"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center p-12 h-64"
                >
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="mt-4 font-medium">Connecting...</p>
                    <p className="text-sm text-muted-foreground text-center">Please approve the connection in your wallet.</p>
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
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                        className="h-16 w-16 bg-green-600 text-white rounded-full flex items-center justify-center"
                    >
                        <Check className="h-8 w-8" />
                    </motion.div>
                    <p className="mt-4 text-lg font-semibold text-green-700 dark:text-green-300">Wallet Connected</p>
                </motion.div>
            )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
