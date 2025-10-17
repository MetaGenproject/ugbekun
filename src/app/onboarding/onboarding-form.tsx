

"use client"
import { useState, useEffect, type ReactNode } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { PreloaderContext } from "@/context/preloader-context";
import { useContext } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Copy, UserPlus, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { createSchoolAction } from "@/app/onboarding/actions";
import { OnboardingStepWelcome } from "@/components/onboarding/step-welcome";
import { OnboardingStepSchoolIdentity } from "@/components/onboarding/step-school-identity";
import { OnboardingStepAdminAccount } from "@/components/onboarding/step-admin-account";
import { OnboardingStepIntelligence } from "@/components/onboarding/step-intelligence";
import { OnboardingStepPlan } from "@/components/onboarding/step-plan";
import { OnboardingStepSystem } from "@/components/onboarding/step-system";
import { OnboardingStepReview } from "@/components/onboarding/step-review";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { PaymentGatewayDialog } from "@/components/ui/payment-gateway-dialog";
import type { Plan } from "@/context/plan-context";
import { AnimatePresence, motion } from "framer-motion";
import { generateStudentId } from "@/lib/did";
import { Label } from "@/components/ui/label";
import { setInitialSchoolDataClient } from "@/lib/data-initializer";


const onboardingSchema = z.object({
  schoolName: z.string().min(3, "School name is required"),
  schoolLevels: z.array(z.string()).min(1, "At least one school level must be selected"),
  motto: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  address: z.string().min(5, "Address is required"),
  adminName: z.string().min(2, "Your name is required"),
  adminRole: z.string().min(2, "Your role is required"),
  adminEmail: z.string().email("A valid email is required"),
  adminPhone: z.string().min(5, "A valid phone number is required"),
  curriculum: z.string().min(1, "Please select a curriculum"),
  feeStructure: z.array(z.string()).optional(),
  plan: z.enum(["Starter", "Growth", "Enterprise"]),
  system: z.enum(["Standard", "SMSUP+"]),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions to launch.",
  }),
});


export type OnboardingValues = z.infer<typeof onboardingSchema>;

type GeneratedCredentials = {
  studentId: string;
  studentEmail: string;
  parentEmail: string;
};

const STEPS = [
  { id: 'welcome', title: 'Welcome', fields: ['schoolName'] as const },
  { id: 'identity', title: 'School Identity', fields: ['schoolLevels', 'motto', 'country', 'state', 'lga', 'address'] as const },
  { id: 'admin', title: 'Admin Account', fields: ['adminName', 'adminRole', 'adminEmail', 'adminPhone'] as const },
  { id: 'intelligence', title: 'Intelligence Setup', fields: ['curriculum', 'feeStructure'] as const },
  { id: 'plan', title: 'Choose Plan', fields: ['plan'] as const },
  { id: 'system', title: 'Choose System', fields: ['system'] as const },
  { id: 'review', title: 'Review & Launch', fields: ['terms'] as const },
];

const planPrices: Record<Plan, number> = {
    "Starter": 0,
    "Growth": 75000,
    "Enterprise": 250000, // Example price
}

export function OnboardingForm({ onBackToRoleSelection }: { onBackToRoleSelection: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        schoolName: "",
        schoolLevels: [],
        motto: "",
        country: "Nigeria",
        state: "",
        lga: "",
        address: "",
        adminName: "",
        adminRole: "Proprietor",
        adminEmail: "",
        adminPhone: "",
        curriculum: "Nigerian National",
        feeStructure: ["Tuition", "Uniforms", "Books", "PTA Levy"],
        plan: "Growth",
        system: "Standard",
        terms: false,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
  const { toast } = useToast();
  const { showPreloader } = useContext(PreloaderContext);
  const [submissionError, setSubmissionError] = useState<string | null>(null);


  const handleNext = async () => {
    const fieldsToValidate = STEPS[currentStep].fields;
    
    if (fieldsToValidate) {
        const output = await form.trigger(fieldsToValidate);
        if (!output) return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step + 1);
    } else {
        onBackToRoleSelection();
    }
  };
  
  const finalizeOnboarding = async (data: OnboardingValues) => {
    setIsLoading(true);
    setSubmissionError(null);
    const result = await createSchoolAction(data);

    if (result.success) {
        // Now save the data on the client
        setInitialSchoolDataClient(result.data);

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');

        setGeneratedCredentials({
            studentId: 'UC-DEMO-2024',
            studentEmail: `demo.student@${data.schoolName.toLowerCase().split(' ')[0]}.com`,
            parentEmail: `demo.parent@example.com`
        });
        
        toast({
            variant: "success",
            title: "Setup Complete!",
            description: `Welcome to ${data.schoolName}. Your workspace is ready.`
        })
    } else {
        setSubmissionError(result.error || "An unknown error occurred during workspace creation.");
        setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<OnboardingValues> = async (data) => {
    if (data.plan === 'Starter') {
        finalizeOnboarding(data);
    } else {
        setIsPaymentOpen(true);
    }
  };
  
  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    const data = form.getValues();
    finalizeOnboarding(data);
  }
  
  const selectedPlan = form.watch('plan');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  }

  const resetDialog = () => {
    form.reset();
    setCurrentStep(0);
    setIsLoading(false);
    setGeneratedCredentials(null);
    onBackToRoleSelection();
    setSubmissionError(null);
  };


  return (
    <>
    <div className="w-full max-w-3xl mx-auto animate-in-up">
        <div className="text-center mb-8">
            <Logo className="h-10 text-primary dark:text-white mx-auto"/>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow-lg relative overflow-hidden">
             <AnimatePresence>
                {submissionError && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive grid place-items-center mb-4">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-destructive">Onboarding Failed</h3>
                        <p className="text-muted-foreground mt-2">An error occurred while creating your workspace.</p>
                        <div className="mt-4 p-4 rounded-lg bg-destructive/5 text-destructive-foreground text-xs w-full font-mono text-left">
                           <p className="font-bold mb-1">Error Details:</p>
                           {submissionError}
                        </div>
                        <Button onClick={() => setSubmissionError(null)} className="mt-6">Try Again</Button>
                    </motion.div>
                )}
             </AnimatePresence>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {generatedCredentials ? (
                        <div className="p-6 sm:p-8">
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 grid place-items-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold">Workspace Created!</h3>
                                <p className="text-sm text-muted-foreground mt-1">Share the following demo credentials to explore.</p>
                                <div className="mt-4 space-y-3 text-left">
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <Label className="text-xs">Student Login</Label>
                                        <div className="font-mono text-sm mt-1 space-y-1">
                                            <p>ID: {generatedCredentials?.studentId} <Copy className="h-3 w-3 inline cursor-pointer" onClick={() => copyToClipboard(generatedCredentials?.studentId || '')}/></p>
                                            <p>Pass: `password123`</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50 border">
                                        <Label className="text-xs">Parent/Guardian Login</Label>
                                        <div className="font-mono text-sm mt-1 space-y-1">
                                            <p>Email: {generatedCredentials?.parentEmail} <Copy className="h-3 w-3 inline cursor-pointer" onClick={() => copyToClipboard(generatedCredentials?.parentEmail || '')}/></p>
                                            <p>Pass: `password123`</p>
                                        </div>
                                    </div>
                                </div>
                                 <div className="mt-4 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center gap-2">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>Login details have also been sent via email to the parent.</span>
                                </div>
                                 <Button className="mt-6 w-full" onClick={() => showPreloader('/admin/dashboard')}>Go to Dashboard</Button>
                            </motion.div>
                        </div>
                    ) : (
                        <>
                            <div className="p-6 border-b">
                                <OnboardingProgress steps={STEPS} currentStep={currentStep} />
                            </div>
                            <div className="p-6 sm:p-8 min-h-[480px] flex flex-col">
                                <div className="flex-1 flex flex-col">
                                    <AnimatePresence mode="wait">
                                        {currentStep === 0 && <OnboardingStepWelcome key="s0" form={form} />}
                                        {currentStep === 1 && <OnboardingStepSchoolIdentity key="s1" form={form} />}
                                        {currentStep === 2 && <OnboardingStepAdminAccount key="s2" form={form} />}
                                        {currentStep === 3 && <OnboardingStepIntelligence key="s3" form={form} />}
                                        {currentStep === 4 && <OnboardingStepPlan key="s4" form={form} />}
                                        {currentStep === 5 && <OnboardingStepSystem key="s5" form={form} />}
                                        {currentStep === 6 && <OnboardingStepReview key="s6" form={form} />}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center justify-between pt-6 mt-8 border-t">
                                    <div>
                                        {currentStep >= 0 && (
                                            <Button type="button" variant="ghost" onClick={handlePrev}>
                                                <ArrowLeft className="mr-2 h-4 w-4"/> Back
                                            </Button>
                                        )}
                                    </div>
                                    <div>
                                        {currentStep < STEPS.length - 1 ? (
                                            <Button type="button" onClick={handleNext}>
                                                Continue
                                            </Button>
                                        ) : (
                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? "Launching..." : "Launch Workspace"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </Form>
        </div>
    </div>
     <PaymentGatewayDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={planPrices[selectedPlan]}
        description={`Ugbekun ${selectedPlan} Plan`}
      />
    </>
  );
}
