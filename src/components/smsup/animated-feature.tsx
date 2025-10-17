
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Fingerprint, ShieldCheck } from "lucide-react";

// Screen 1: Internal Profile
const InternalProfileScreen = () => (
  <div className="bg-card p-4 rounded-lg border h-full text-card-foreground">
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
    <div className="mt-4 space-y-2 text-xs">
      <div className="flex justify-between"><span>Attendance:</span><span className="font-medium">98%</span></div>
      <div className="flex justify-between"><span>Average:</span><span className="font-medium">89%</span></div>
      <div className="flex justify-between"><span>Status:</span><Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge></div>
    </div>
  </div>
);

// Screen 2: Minting Process
const MintingScreen = () => (
  <div className="bg-primary text-primary-foreground p-4 rounded-lg border h-full flex flex-col items-center justify-center text-center">
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <Fingerprint className="h-10 w-10" />
    </motion.div>
    <p className="font-semibold mt-3 text-sm">Minting Digital ID</p>
    <p className="text-xs opacity-80 mt-1">Anchoring credentials on-chain...</p>
    <p className="font-mono text-xs mt-2 bg-black/20 px-2 py-1 rounded-md">0x4a...f2e1</p>
  </div>
);

// Screen 3: Public Verifiable ID
const PublicIDScreen = () => (
    <div className="bg-background p-4 rounded-lg border h-full text-foreground shadow-2xl">
        <div className="text-center">
            <Avatar className="h-16 w-16 mx-auto border-4 border-primary/20">
                <AvatarImage src="https://i.pravatar.cc/80?u=aisha-bello" />
                <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold mt-2">Aisha Bello</h3>
            <p className="text-xs text-muted-foreground">Unity College</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-green-600">
            <ShieldCheck className="h-4 w-4"/> Verified by SMSUP+
        </div>
        <div className="text-center mt-2">
            <p className="font-mono text-xs bg-muted px-2 py-1 rounded-md inline-block">did:ethr:0x4a...f2e1</p>
        </div>
    </div>
);

const screens = [
  <InternalProfileScreen key="profile" />,
  <MintingScreen key="minting" />,
  <PublicIDScreen key="public-id" />,
];

export function AnimatedFeature() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-80 flex items-center justify-center [perspective:1000px]">
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
