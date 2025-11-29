
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut, ScanLine, CheckCircle, User, CameraOff, Video, KeyRound, QrCode, ArrowLeft, HelpCircle } from "lucide-react";
import { format, isToday } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { type Staff } from "@/lib/hr-data";
import * as DataStore from "@/lib/data-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import jsQR from "jsqr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { HelpDrawer } from "@/components/layout/help-drawer";


type AttendanceLog = {
    staffId: string;
    staffName: string;
    staffAvatar: string;
    timestamp: string; // ISO string for accurate time checking
    action: 'in' | 'out';
}

type ClockInMode = 'qr' | 'id_entry' | 'passcode_entry' | 'success';

export default function ClockInPage() {
    const [lastScanned, setLastScanned] = useState<Omit<AttendanceLog, 'timestamp'> & { time: string } | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [staff, setStaff] = useState<Staff[]>([]);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();
    const [attendanceLog, setAttendanceLog] = useLocalStorage<AttendanceLog[]>('attendance-log', []);

    const [mode, setMode] = useState<ClockInMode>('qr');
    const [staffIdInput, setStaffIdInput] = useState('stf-001');
    const [passcodeInput, setPasscodeInput] = useState('');
    const [generatedPasscode, setGeneratedPasscode] = useState('');
    const [verifyingStaff, setVerifyingStaff] = useState<Staff | null>(null);
    const [error, setError] = useState('');
    const [isHelpOpen, setIsHelpOpen] = useState(false);


    useEffect(() => {
        const fetchStaff = async () => {
            const staffData = await DataStore.getStaff();
            setStaff(staffData);
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (mode !== 'qr') {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                setHasCameraPermission(false);
            }
            return;
        };

        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing camera:", error);
                setHasCameraPermission(false);
            }
        };
        getCameraPermission();
        
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [mode]);

    useEffect(() => {
        if (mode !== 'qr' || !hasCameraPermission || lastScanned) return;
        
        let animationFrameId: number;

        const tick = () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                if(canvas) {
                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.height = video.videoHeight;
                        canvas.width = video.videoWidth;
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'dontInvert',
                        });
                        
                        if (code && code.data.startsWith('ugbekun-staff-')) {
                            const staffId = code.data.replace('ugbekun-staff-', '');
                            const staffMember = staff.find(s => s.id === staffId);
                            if (staffMember) {
                                handleScan(staffMember);
                            }
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(tick);
        };
        
        animationFrameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrameId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasCameraPermission, staff, lastScanned, mode]);
    
    const handleScan = (staffMember: Staff) => {
        const now = new Date();
        const todaysLogs = attendanceLog.filter(log => log.staffId === staffMember.id && isToday(new Date(log.timestamp)));
        const lastActionToday = todaysLogs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

        let actionType: 'in' | 'out' | null = null;

        if (!lastActionToday) {
            actionType = 'in'; // First action of the day is always clock-in
        } else if (lastActionToday.action === 'in') {
            actionType = 'out'; // If last action was in, next must be out
        } else { // lastActionToday.action === 'out'
            toast({
                variant: "destructive",
                title: "Already Clocked Out",
                description: `${staffMember.name} has already clocked out for today.`,
            });
            return;
        }

        if (actionType) {
            const newLog: AttendanceLog = {
                staffId: staffMember.id,
                staffName: staffMember.name,
                staffAvatar: staffMember.avatar,
                timestamp: now.toISOString(),
                action: actionType
            };
            
            const displayLog = { ...newLog, time: format(now, "p") };
            setLastScanned(displayLog);
            setAttendanceLog(prev => [newLog, ...prev]);

            toast({
                variant: "success",
                title: `Clocked ${actionType === 'in' ? 'In' : 'Out'}: ${staffMember.name}`,
                description: `Attendance recorded at ${displayLog.time}.`,
            });
            
            setTimeout(() => setLastScanned(null), 5000);
        }
    }
    
    const handleIdSubmit = () => {
        setError('');
        const staffMember = staff.find(s => s.id.toLowerCase() === staffIdInput.toLowerCase());
        if (staffMember) {
            setVerifyingStaff(staffMember);
            const passcode = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedPasscode(passcode);
            setMode('passcode_entry');
        } else {
            setError("Staff ID not found.");
        }
    }
    
    const handlePasscodeSubmit = () => {
        setError('');
        if (passcodeInput === generatedPasscode) {
             if (verifyingStaff) {
                handleScan(verifyingStaff);
                setMode('success');
                setTimeout(() => resetFlow(), 5000);
            }
        } else {
            setError("Incorrect passcode. Please try again.");
            setPasscodeInput('');
        }
    }

    const resetFlow = () => {
        setMode('qr');
        setStaffIdInput('stf-001');
        setPasscodeInput('');
        setGeneratedPasscode('');
        setVerifyingStaff(null);
        setError('');
    }


    const renderContent = () => {
        switch(mode) {
            case 'qr':
                return (
                    <motion.div key="qr" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center">
                        <div className="relative w-64 h-64 overflow-hidden rounded-xl border-4 border-muted/50 grid place-items-center bg-black">
                            <canvas ref={canvasRef} className="hidden" />
                            {hasCameraPermission ? (
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                            ) : (
                                <div className="flex flex-col items-center text-muted-foreground p-4">
                                    <CameraOff className="h-16 w-16" />
                                    <p className="mt-2 text-sm text-center">Camera permission is required for QR code scanning.</p>
                                </div>
                            )}
                            <AnimatePresence>
                            {!lastScanned && hasCameraPermission && (
                               <motion.div
                                 className="absolute inset-0 flex flex-col items-center justify-center bg-black/50"
                                 initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                               >
                                    <motion.div
                                    className="absolute inset-x-4 h-0.5 bg-primary/70 shadow-[0_0_10px_2px_hsl(var(--primary))]"
                                    animate={{ y: [20, 236, 20] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <p className="text-white font-semibold">Present Staff ID to Camera</p>
                               </motion.div>
                            )}
                            </AnimatePresence>
                             <AnimatePresence>
                            {lastScanned && (
                                <motion.div
                                    key={lastScanned.staffId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
                                >
                                    <Avatar className="h-20 w-20 border-4 border-white/50">
                                        <AvatarImage src={lastScanned.staffAvatar} />
                                        <AvatarFallback>{lastScanned.staffName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold text-white mt-3">{lastScanned.staffName}</h2>
                                    <div className={cn(
                                        "flex items-center gap-2 font-semibold mt-1 p-2 rounded-lg text-sm",
                                        lastScanned.action === 'in' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                                    )}>
                                        {lastScanned.action === 'in' ? <LogIn className="h-4 w-4"/> : <LogOut className="h-4 w-4"/>}
                                        Clocked {lastScanned.action === 'in' ? 'In' : 'Out'} at {lastScanned.time}
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                        <Button variant="link" className="mt-4" onClick={() => setMode('id_entry')}>Use Staff ID Instead</Button>
                    </motion.div>
                );
            case 'id_entry':
                return (
                    <motion.div key="id" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="w-full max-w-xs text-left">
                        <Button variant="ghost" size="sm" onClick={() => setMode('qr')} className="mb-4 -ml-3">
                           <ArrowLeft className="mr-2 h-4 w-4"/> Back to QR Scan
                        </Button>
                        <div className="space-y-2">
                            <Label htmlFor="staffId">Staff ID</Label>
                            <Input id="staffId" value={staffIdInput} onChange={e => setStaffIdInput(e.target.value)} placeholder="e.g., stf-001" />
                            {error && <p className="text-xs text-destructive">{error}</p>}
                        </div>
                        <Button className="w-full mt-4" onClick={handleIdSubmit}>Continue</Button>
                    </motion.div>
                );
            case 'passcode_entry':
                return (
                     <motion.div key="passcode" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="w-full max-w-xs text-left">
                        <Button variant="ghost" size="sm" onClick={() => { setMode('id_entry'); setPasscodeInput(''); setError(''); }} className="mb-4 -ml-3">
                           <ArrowLeft className="mr-2 h-4 w-4"/> Back
                        </Button>
                        <p className="text-sm text-center mb-2">A one-time passcode has been generated for <span className="font-bold">{verifyingStaff?.name}</span>.</p>
                        <Card className="p-4 text-center bg-muted">
                            <Label className="text-xs">PASSCODE FOR ADMIN</Label>
                            <p className="text-4xl font-bold tracking-widest font-mono text-primary">{generatedPasscode}</p>
                        </Card>
                        <div className="space-y-2 mt-4">
                            <Label htmlFor="passcode">Enter 6-Digit Passcode</Label>
                            <Input id="passcode" value={passcodeInput} onChange={e => setPasscodeInput(e.target.value)} placeholder="******" maxLength={6} />
                            {error && <p className="text-xs text-destructive">{error}</p>}
                        </div>
                        <Button className="w-full mt-4" onClick={handlePasscodeSubmit}>Clock In</Button>
                    </motion.div>
                );
            case 'success':
                 return (
                    <motion.div
                        key={lastScanned?.staffId || 'success'}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center justify-center text-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                        <Avatar className="h-24 w-24 border-4 border-green-500">
                            <AvatarImage src={lastScanned?.staffAvatar} />
                            <AvatarFallback>{lastScanned?.staffName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        </motion.div>
                        <h2 className="text-xl font-bold text-foreground mt-4">{lastScanned?.staffName}</h2>
                        <p className="text-green-600 font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5"/>
                            Clocked {lastScanned?.action === 'in' ? 'In' : 'Out'} at {lastScanned?.time}
                        </p>
                    </motion.div>
                 )
        }
    }

    return (
        <>
        <main className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md overflow-hidden transition-colors duration-500 bg-card">
                <CardHeader className="text-center p-6 border-b flex flex-row items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">Attendance Kiosk</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsHelpOpen(true)}>
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Help</span>
                    </Button>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6 p-8 min-h-[420px]">
                    <AnimatePresence mode="wait">
                    {renderContent()}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </main>
        <HelpDrawer isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
        </>
    );
}
