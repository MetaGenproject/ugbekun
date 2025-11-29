

"use client"
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { PreloaderContext } from "@/context/preloader-context";
import { useContext } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useCompleteOnboardingMutation } from "@/app/api/apiSlice";
import { OnboardingStepWelcome } from "@/components/onboarding/step-welcome";
import { OnboardingStepSchoolIdentity } from "@/components/onboarding/step-school-identity";
import { OnboardingStepAdminAccount } from "@/components/onboarding/step-admin-account";
import { OnboardingStepIntelligence } from "@/components/onboarding/step-intelligence";
import { OnboardingStepPlan } from "@/components/onboarding/step-plan";
import { OnboardingStepSystem } from "@/components/onboarding/step-system";
import { OnboardingStepReview } from "@/components/onboarding/step-review";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Form } from "@/components/ui/form";
import { PaymentGatewayDialog } from "../ui/payment-gateway-dialog";
import type { Plan } from "@/context/plan-context";


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
  adminUsername: z.string().min(2, "username is required"),
  adminPassword: z.string().min(5, "password must be more than 5 character"),
  
  curriculum: z.string().min(1, "Please select a curriculum"),
  feeStructure: z.array(z.string()).optional(),
  plan: z.enum(["Starter", "Growth", "Enterprise"]),
  system: z.enum(["Standard", "SMSUP+"]),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions to launch.",
  }),
});


export type OnboardingValues = z.infer<typeof onboardingSchema>;

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
        // adminPassword: "",
        curriculum: "Nigerian National",
        feeStructure: ["Tuition", "Uniforms", "Books", "PTA Levy"],
        plan: "Growth",
        system: "Standard",
        terms: false,
    }
  });

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { toast } = useToast();
  const { showPreloader } = useContext(PreloaderContext);
  const [completeOnboarding, { isLoading, error }] = useCompleteOnboardingMutation();


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
      setCurrentStep(step => step - 1);
    } else {
        // onBackToRoleSelection();
    }
  };
  
  const finalizeOnboarding = async (data: OnboardingValues) => {
    try {
      await completeOnboarding(data).unwrap();
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');

      toast({
          variant: "success",
          title: "Setup Complete!",
          description: `Welcome to ${data.schoolName}. Redirecting to your dashboard.`
      })
      showPreloader('/admin/dashboard');
    } catch (err) {
        toast({
            variant: "destructive",
            title: "Onboarding Failed",
            description: (err as any)?.data?.message || "An unexpected error occurred."
        })
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


  return (
    <>
    <div className="w-full max-w-3xl mx-auto animate-in-up">
        <div className="text-center mb-8">
            <Logo className="h-10 text-primary dark:text-white mx-auto"/>
        </div>
        <div className="rounded-2xl border bg-card text-card-foreground shadow-lg">
            <div className="p-6 border-b">
                <OnboardingProgress steps={STEPS} currentStep={currentStep} />
            </div>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="p-6 sm:p-8 min-h-[480px] flex flex-col">
                        <div className="flex-1 flex flex-col">
                            {currentStep === 0 && <OnboardingStepWelcome form={form} />}
                            {currentStep === 1 && <OnboardingStepSchoolIdentity form={form} />}
                            {currentStep === 2 && <OnboardingStepAdminAccount form={form} />}
                            {currentStep === 3 && <OnboardingStepIntelligence form={form} />}
                            {currentStep === 4 && <OnboardingStepPlan form={form} />}
                            {currentStep === 5 && <OnboardingStepSystem form={form} />}
                            {currentStep === 6 && <OnboardingStepReview form={form} />}
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
