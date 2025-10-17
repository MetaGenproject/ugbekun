
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Fingerprint, ShieldCheck, Search, Loader, FileCheck2, School, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

// Screen 1: Verification Request
const OrganizationScreen = () => (
  <div className="bg-card p-4 rounded-lg border h-full text-card-foreground flex flex-col justify-center">
    <p className="text-sm font-semibold text-center">Third-Party Verification</p>
    <div className="mt-4 space-y-2">
        <label htmlFor="did-input" className="text-xs text-muted-foreground">Student's Digital ID</label>
        <div className="relative">
             <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input id="did-input" readOnly value="did:ethr:0x4a...f2e1" className="w-full text-xs bg-muted rounded-md h-8 pl-8 pr-2" />
        </div>
    </div>
    <Button className="w-full mt-4">Verify Credential</Button>
  </div>
);

// Screen 2: Verifying Process
const VerifyingScreen = () => (
  <div className="bg-primary text-primary-foreground p-4 rounded-lg border h-full flex flex-col items-center justify-center text-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Loader className="h-10 w-10" />
    </motion.div>
    <p className="font-semibold mt-3 text-sm">Verifying on SMSUP+</p>
    <p className="text-xs opacity-80 mt-1">Checking on-chain records...</p>
     <p className="font-mono text-xs mt-2 bg-black/20 px-2 py-1 rounded-md animate-pulse">Block #8A4D3E</p>
  </div>
);

// Screen 3: Verified Certificate
const CertificateScreen = () => (
    <div className="bg-background p-4 rounded-lg border h-full text-foreground shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20" />
        <div className="relative flex flex-col h-full">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <School className="h-5 w-5 text-muted-foreground" />
                    <p className="font-semibold">Unity College</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center my-4">
                <GraduationCap className="h-8 w-8 text-primary"/>
                 <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Certificate of Completion</p>
                 <h3 className="font-bold text-lg mt-1">Aisha Bello</h3>
            </div>
            <div className="text-center mt-auto">
                <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-green-600 bg-green-100/80 px-3 py-1.5 rounded-full border border-green-200 dark:bg-green-500/10 dark:border-green-500/20">
                    <ShieldCheck className="h-4 w-4"/> Verified on SMSUP+
                </div>
            </div>
        </div>
    </div>
);

const screens = [
  <OrganizationScreen key="org" />,
  <VerifyingScreen key="verifying" />,
  <CertificateScreen key="cert" />,
];

export function CertificateVerificationAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center [perspective:1000px]">
      <div className="relative w-64 h-64" style={{ transformStyle: "preserve-3d" }}>
        {screens.map((screen, i) => (
          <motion.div
            key={i}
            initial={{ rotateY: (i - index) * 120, z: -200, opacity: 0 }}
            animate={{
              rotateY: (i - index) * 120,
              z: i === index ? 0 : -300,
              opacity: i === index ? 1 : 0.2,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute w-full h-full"
          >
            {screen}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
