
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, ShieldCheck, Check, ArrowRight, UserCircle, Building, Wallet, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkResultWithPin } from '@/ai/flows/student-actions';

type VerificationStep = 'idle' | 'verifying' | 'success' | 'error';

export default function ResultCheckPage() {
    const [studentId, setStudentId] = useState('');
    const [pin, setPin] = useState('');
    const [step, setStep] = useState<VerificationStep>("idle");
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleVerification = async () => {
        setErrorMessage('');
        if (!studentId.trim() || !pin.trim()) {
            setErrorMessage("Please enter both Student ID and PIN.");
            return;
        }

        setStep("verifying");

        try {
            const result = await checkResultWithPin({ studentId, pin });
            
            if(result.success) {
                toast({
                    variant: 'success',
                    title: 'PIN Verified!',
                    description: 'Redirecting you to the report card...'
                });
                setStep('success');
                 setTimeout(() => {
                    router.push(`/admin/reports/${result.studentId}?preview=true`);
                }, 1500);

            } else {
                 setErrorMessage(result.error || 'An unknown error occurred.');
                 setStep('error');
                 setTimeout(() => setStep('idle'), 3000);
            }

        } catch (e: any) {
            console.error("An error occurred during verification:", e);
            setErrorMessage("An unexpected server error occurred.");
            setStep('error');
            setTimeout(() => setStep('idle'), 3000);
        }
    }

    return (
        <main className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Check Result</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                       Enter your scratch card details to view your report card.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Result Checker</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="student-id" className="text-sm font-medium">Student ID</label>
                            <Input 
                                id="student-id"
                                placeholder="e.g., UC-AB-2024" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>
                         <div className="space-y-2">
                            <label htmlFor="pin" className="text-sm font-medium">Scratch Card PIN</label>
                            <Input 
                                id="pin"
                                type="password"
                                placeholder="Enter 12-digit PIN" 
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                            />
                        </div>
                        {errorMessage && (
                             <p className="text-xs text-destructive flex items-center gap-2">
                                <AlertCircle className="h-4 w-4"/> {errorMessage}
                            </p>
                        )}
                        <Button className="w-full" onClick={handleVerification} disabled={step === 'verifying'}>
                            {step === 'verifying' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                            {step === 'verifying' ? 'Verifying PIN...' : 'Check Result'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
