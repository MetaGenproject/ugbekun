
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ShieldCheck, Check, ArrowRight, UserCircle, Building, Wallet, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ConnectWalletDialog } from '@/components/ui/connect-wallet-dialog';
import { VerifierSignUpDialog } from '@/components/credentials/verifier-signup-dialog';
import { type School } from '@/lib/super-admin-data';
import { type Student } from '@/lib/admin-data';
import { AnimatePresence, motion } from 'framer-motion';
import { type VerifiableCredential } from '@/lib/credentials-data';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import * as DataStore from '@/lib/data-store';
import { PaymentGatewayDialog } from "@/components/ui/payment-gateway-dialog";
import { HelpDrawer } from '@/components/layout/help-drawer';

type VerificationStep = 'idle' | 'confirming' | 'connecting_wallet' | 'signup' | 'paying' | 'verifying' | 'success';
type ErrorState = { message: string } | null;

export default function CredentialsVerificationPage() {
    const [studentId, setStudentId] = useState('UC-AB-2024'); // Default to the testable student ID
    const [step, setStep] = useState<VerificationStep>("idle");
    const [error, setError] = useState<ErrorState>(null);
    const router = useRouter();
    const { toast } = useToast();
    
    const [schools, setSchools] = useState<School[]>([]);
    const [allCredentials, setAllCredentials] = useState<VerifiableCredential[]>([]);
    
    const [verifiedStudent, setVerifiedStudent] = useState<Student | null>(null);
    const [publicCredentials, setPublicCredentials] = useState<VerifiableCredential[]>([]);
    const { isLoggedIn, userRole, isLoading: isAuthLoading } = useAuth();
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    
    // The demo school is the first one in the list.
    const school = useMemo(() => schools?.find(s => s.id === 'unity-college'), [schools]);
    const verificationFee = school?.verificationFee || 500;
    
    const isInternalUser = isLoggedIn && (userRole === 'admin' || userRole === 'teacher' || userRole === 'parent' || userRole === 'student' || userRole === 'super-admin');

    useEffect(() => {
        const loadInitialData = async () => {
            const [loadedSchools, loadedCredentials] = await Promise.all([
                DataStore.getSchools(),
                DataStore.getVerifiableCredentials(),
            ]);
            setSchools(loadedSchools);
            setAllCredentials(loadedCredentials);
        }
        loadInitialData();
    }, []);

    const handleVerification = async () => {
        setError(null);
        if (!studentId.trim()) {
            setError({ message: "Please enter a valid student ID." });
            return;
        }

        setStep("verifying");

        try {
            const allStudents = await DataStore.getStudents();
            
            if (!allStudents || allStudents.length === 0) {
                setError({ message: "Student database is empty. Please check data store." });
                resetFlow();
                return;
            }
            
            const studentIdToSearch = studentId.trim();
            const student = allStudents.find(s => s.id === studentIdToSearch);

            if (!student) {
                setError({ message: "No student record found for this ID." });
                resetFlow();
                return;
            }

            if (!school || !school.verified || school.system !== 'SMSUP+') {
                toast({ variant: 'destructive', title: 'Service Unavailable', description: "The school associated with this app has not enabled on-chain credentials (SMSUP+)." });
                resetFlow();
                return;
            }

            const studentPublicCredentials = allCredentials.filter(c => c.studentId === studentIdToSearch && c.isPublic);
            if (studentPublicCredentials.length === 0) {
                setError({ message: "This student has not made any credentials publicly verifiable." });
                resetFlow();
                return;
            }

            setVerifiedStudent(student);
            setPublicCredentials(studentPublicCredentials);
            
            if (isInternalUser) {
                 setTimeout(() => {
                    setStep("success");
                     setTimeout(() => {
                         router.push(`/p/${student.id}`);
                     }, 1500)
                }, 1000);
            } else {
                 setStep("confirming");
            }

        } catch (e: any) {
            console.error("An error occurred during verification:", e);
            setError({ message: "An unexpected error occurred. Check console for details." });
            resetFlow();
        }
    }
    
    const handleConfirm = () => setStep("connecting_wallet");
    const handleWalletConnected = () => setStep("signup");
    const handleVerifierSignup = () => setStep("paying");

    const handlePaymentSuccess = () => {
        setStep("verifying");
        toast({ title: "Verifying...", description: "Checking on-chain records for this ID." });

        setTimeout(() => {
            if (verifiedStudent) {
                setStep("success");
                 setTimeout(() => {
                     router.push(`/p/${verifiedStudent.id}`);
                 }, 1500)
            } else {
                toast({ variant: 'destructive', title: "Verification Failed", description: "No student record found for the provided ID."});
                resetFlow();
            }
        }, 2000);
    }
    
    const resetFlow = () => {
        setStep('idle');
        setVerifiedStudent(null);
        setPublicCredentials([]);
    }

    return (
         <>
            <div className="bg-background py-16 md:py-24">
                <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <Button asChild variant="ghost">
                               <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                               </Link>
                            </Button>
                             <Button variant="outline" size="icon" onClick={() => setIsHelpOpen(true)}>
                                <HelpCircle className="h-4 w-4" />
                            </Button>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {isInternalUser ? "Internal Verification" : "Verify a Credential"}
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {isInternalUser 
                                ? "As an authenticated user, you can look up any student's public credential instantly."
                                : "Instantly confirm the authenticity of any Ugbekun-issued academic credential."
                            }
                        </p>
                    </div>
                    <Card className="overflow-hidden min-h-[420px]">
                        <AnimatePresence mode="wait">
                            {step === 'idle' && (
                                <motion.div key="idle" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                                    <CardHeader>
                                        <CardTitle>Enter Student ID</CardTitle>
                                        <CardDescription>
                                            Enter the student's unique identifier (e.g., UC-AB-2024) to begin.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input 
                                                    placeholder="e.g., UC-AB-2024" 
                                                    className="pl-10 font-mono text-sm h-11"
                                                    value={studentId}
                                                    onChange={(e) => { setStudentId(e.target.value); setError(null); }}
                                                />
                                            </div>
                                            <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2 text-xs text-destructive pt-1"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span>{error.message}</span>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                        </div>
                                         <Button className="w-full mt-4" onClick={handleVerification} disabled={!school?.verified || step === 'verifying'}>
                                            {step === 'verifying' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                            {step === 'verifying' ? 'Verifying...' :
                                                isInternalUser 
                                                    ? "Look up Credential" 
                                                    : school?.verified 
                                                        ? `Verify Credential (₦${verificationFee})` 
                                                        : 'Verification Unavailable'
                                            }
                                        </Button>
                                    </CardContent>
                                </motion.div>
                            )}
                             {step === 'confirming' && verifiedStudent && (
                                <motion.div key="confirming" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
                                    <CardHeader>
                                        <CardTitle>Confirm Verification</CardTitle>
                                        <CardDescription>You are about to verify the credential for the following student.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                                            <div className="flex items-center gap-2"><UserCircle className="h-4 w-4 text-muted-foreground"/><span>{verifiedStudent.name}</span></div>
                                            <div className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground"/><span>{school?.name}</span></div>
                                        </div>
                                        <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground">Public Credentials to be Verified ({publicCredentials.length}):</p>
                                            <ul className="list-disc pl-5 text-sm space-y-1">
                                                {publicCredentials.map(c => <li key={c.id}>{c.title}</li>)}
                                            </ul>
                                        </div>
                                        <p className="text-sm text-muted-foreground">A non-refundable fee of ₦{verificationFee} is required to proceed. This ensures system integrity and prevents abuse.</p>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={resetFlow}>Cancel</Button>
                                            <Button onClick={handleConfirm}>Continue <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                        </div>
                                    </CardContent>
                                </motion.div>
                            )}
                             {(step === 'verifying' || step === 'success') && (
                                 <motion.div
                                    key="processing"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center justify-center p-12 h-[420px]"
                                >
                                    {step === 'verifying' ? (
                                        <>
                                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                            <p className="mt-4 font-medium">Verifying...</p>
                                            <p className="text-sm text-muted-foreground text-center">Checking records for this ID.</p>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                                                className="h-16 w-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto"
                                            >
                                                <Check className="h-8 w-8" />
                                            </motion.div>
                                            <p className="mt-4 text-lg font-semibold text-green-700 dark:text-green-300">Verification Complete</p>
                                            <p className="text-sm text-muted-foreground">Redirecting to the secure credential...</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </div>
            </div>

            <ConnectWalletDialog 
                isOpen={step === 'connecting_wallet'}
                onClose={resetFlow}
                onConnect={handleWalletConnected}
                title="Connect as Verifier"
            />
            <VerifierSignUpDialog
                isOpen={step === 'signup'}
                onClose={resetFlow}
                onConfirm={handleVerifierSignup}
            />
            <PaymentGatewayDialog
                isOpen={step === 'paying'}
                onClose={resetFlow}
                onPaymentSuccess={handlePaymentSuccess}
                amount={verificationFee}
                description={`Verification Fee for ${school?.name}`}
            />
            <HelpDrawer isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
         </>
    );
}
