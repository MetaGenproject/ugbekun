
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Fingerprint, ShieldCheck, File, Users, Settings } from "lucide-react";
import { Badge } from "../ui/badge";

const Sidebar = () => (
    <div className="w-48 bg-muted/50 p-3 space-y-2">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 rounded-md bg-muted animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
    </div>
);

const RecordScreen = () => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6"
    >
        <h3 className="font-semibold text-lg">Student Credential Record</h3>
        <p className="text-xs text-muted-foreground">Internal School Data</p>
        <div className="mt-4 bg-card p-4 rounded-lg border">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src="https://i.pravatar.cc/40?u=aisha-bello" />
                    <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">Aisha Bello</p>
                    <p className="text-xs text-muted-foreground">JSS 1</p>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-xs border-t pt-3">
                <div className="flex justify-between"><span>Certificate:</span><span className="font-medium">Completion of JSS 1</span></div>
                <div className="flex justify-between"><span>Issue Date:</span><span className="font-medium">2024-07-26</span></div>
                 <div className="flex justify-between"><span>Status:</span><Badge variant="outline">Not Anchored</Badge></div>
            </div>
        </div>
    </motion.div>
);

const MintingScreen = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6 flex flex-col items-center justify-center text-center h-full"
    >
        <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
            <Fingerprint className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="font-semibold mt-4 text-lg">Minting Verifiable Credential</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">Anchoring a cryptographic hash of the credential on the blockchain. This process is irreversible.</p>
        <p className="font-mono text-xs mt-3 bg-muted px-2 py-1 rounded-md animate-pulse">tx: 0x4a...f2e1</p>
    </motion.div>
);

const VerifiedScreen = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6"
    >
        <h3 className="font-semibold text-lg">Verifiable Credential</h3>
        <p className="text-xs text-muted-foreground">Publicly verifiable on-chain</p>
        <div className="mt-4 bg-card p-4 rounded-lg border-2 border-green-500/50 shadow-lg shadow-green-500/10">
            <div className="flex items-center gap-3">
                <Avatar className="border-2 border-green-500/50">
                    <AvatarImage src="https://i.pravatar.cc/40?u=aisha-bello" />
                    <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">Aisha Bello</p>
                    <p className="text-xs text-muted-foreground">JSS 1</p>
                </div>
            </div>
            <div className="mt-4 space-y-2 text-xs border-t pt-3">
                 <div className="flex justify-between items-center text-green-600 font-semibold">
                    <span>Verified on SMSUP+</span>
                    <ShieldCheck className="h-4 w-4" />
                </div>
                 <div className="flex justify-between"><span>Certificate:</span><span className="font-medium">Completion of JSS 1</span></div>
                <div className="flex justify-between"><span>On-Chain ID:</span><span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">did:ethr:0x4a...f2e1</span></div>
            </div>
        </div>
    </motion.div>
);


const screens = [
  <RecordScreen key="record" />,
  <MintingScreen key="minting" />,
  <VerifiedScreen key="verified" />,
];

export function HeroAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex bg-muted/30">
        <Sidebar />
        <div className="flex-1 relative">
            <AnimatePresence mode="wait">
                {screens[index]}
            </AnimatePresence>
        </div>
    </div>
  );
}
