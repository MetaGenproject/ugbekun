
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
import { useCompleteOnboardingMutation, useSignupMutation, useCreateSchoolMutation } from "@/app/api/apiSlice";
import { OnboardingStepWelcome } from "@/components/onboarding/step-welcome";
import { OnboardingStepSchoolIdentity } from "@/components/onboarding/step-school-identity";
import { OnboardingStepAdminAccount } from "@/components/onboarding/step-admin-account";
import { OnboardingStepIntelligence } from "@/components/onboarding/step-intelligence";
import { OnboardingStepPlan } from "@/components/onboarding/step-plan";
import { OnboardingStepSystem } from "@/components/onboarding/step-system";
import { OnboardingStepReview } from "@/components/onboarding/step-review";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Form, FormField, FormMessage } from "@/components/ui/form";
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
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  adminConfirmPassword: z.string(),
  adminEmail: z.string().email("A valid email is required"),
  adminPhone: z.string().min(5, "A valid phone number is required"),
  curriculum: z.string().min(1, "Please select a curriculum"),
  feeStructure: z.array(z.string()).optional(),
  plan: z.enum(["Starter", "Growth", "Enterprise"]),
  system: z.enum(["Standard", "SMSUP+"]),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions to launch.",
  }),
}).refine(data => data.adminPassword === data.adminConfirmPassword, {
  message: "Admin passwords do not match",
  path: ["adminConfirmPassword"],
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

type GeneratedCredentials = {
  schoolUniqueId: string;
  adminEmail: string;
};

const STEPS = [
  { id: 'welcome', title: 'Welcome', fields: ['schoolName'] as const },
  { id: 'identity', title: 'School Identity', fields: ['schoolLevels', 'motto', 'country', 'state', 'lga', 'address'] as const },
  { id: 'admin', title: 'Admin Account', fields: ['adminName', 'adminRole', 'adminEmail', 'adminPhone', 'adminPassword', 'adminConfirmPassword'] as const },
  { id: 'intelligence', title: 'Intelligence Setup', fields: ['curriculum', 'feeStructure'] as const },
  { id: 'plan', title: 'Choose Plan', fields: ['plan'] as const },
  { id: 'system', title: 'Choose System', fields: ['system'] as const },
  { id: 'review', title: 'Review & Launch', fields: ['terms'] as const },
];

const planPrices: Record<Plan, number> = {
  "Starter": 0,
  "Growth": 75000,
  "Enterprise": 250000,
};

export function OnboardingForm({ onBackToRoleSelection, role }: { onBackToRoleSelection: () => void, role?: import('./role-selection').UserRole }) {
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
  adminRole: role === 'teacher' ? 'Teacher' : role === 'parent' ? 'Parent' : 'Proprietor',
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      adminConfirmPassword: "",
      curriculum: "Nigerian National",
      feeStructure: ["Tuition", "Uniforms", "Books", "PTA Levy"],
      plan: "Growth",
      system: "Standard",
      terms: false,
    }
  });

  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [createSchool] = useCreateSchoolMutation();
  const [signupUser] = useSignupMutation();
  // Payment logic is temporarily disabled — onboardings should proceed without payment.
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
      setCurrentStep(step => step - 1);
    } else {
      // No role-selection screen; send user back to login/signup
      try {
        showPreloader('/login');
      } catch (e) {
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
  };

  const finalizeOnboarding = async (data: OnboardingValues) => {
    setSubmissionError(null);
    
    try {
      // Prepare data for API
      const onboardingData = {
        schoolName: data.schoolName,
        schoolLevels: data.schoolLevels,
        feeStructure: data.feeStructure,
        motto: data.motto,
        country: data.country,
        state: data.state,
        lga: data.lga,
        address: data.address,
        curriculum: data.curriculum,
        email: data.adminEmail, // Using admin email as school contact email
        plan: data.plan,
        system: data.system,
        adminName: data.adminName,
        adminEmail: data.adminEmail,
        adminPassword: data.adminPassword,
      };


      // Step 1: Create school (generate schoolUniqueId and email admin) before creating admin user
      let createdSchool: any = null;
      try {
        console.log('Creating school - payload:', onboardingData);
        const schoolResp = await createSchool(onboardingData).unwrap();
        createdSchool = schoolResp?.data?.school || schoolResp?.school || null;

        if (!createdSchool) {
          setSubmissionError(schoolResp?.message || 'Failed to create school');
          return;
        }

        // Show the generated ID to the user immediately
        setGeneratedCredentials({
          schoolUniqueId: createdSchool.schoolUniqueId || createdSchool.schoolUniqueId,
          adminEmail: data.adminEmail
        });
      } catch (createErr: any) {
        try {
          console.error('Create school failed (detailed):', createErr);
          console.error('Create school error - data:', createErr?.data || createErr?.error || createErr?.response || null);
          console.error('Create school error - status:', createErr?.status || createErr?.originalStatus || null);
        } catch (logErr) {
          console.warn('Failed to log createSchool error details:', logErr);
        }
        setSubmissionError(createErr?.data?.message || createErr?.message || 'Failed to create school');
        return;
      }

      // Step 2: Create admin user now that the school exists. Include the school ObjectId so backend links it.
      try {
        const mappedRole = (data.adminRole || '').toLowerCase().includes('teacher') ? 'teacher' :
          (data.adminRole || '').toLowerCase().includes('parent') ? 'parent' : 'admin';

        const signupPayload = {
          fullName: data.adminName,
          email: data.adminEmail,
          password: data.adminPassword,
          role: mappedRole,
          school: createdSchool._id
        };
        console.log('Signing up admin - payload:', signupPayload);

        const signupResp = await signupUser(signupPayload).unwrap();

        // Persist role and token if returned
        try {
          if (signupResp?.token) {
            localStorage.setItem('token', signupResp.token);
            localStorage.setItem('isLoggedIn', 'true');
          }
          localStorage.setItem('userRole', mappedRole);
        } catch (e) { /* ignore */ }
      } catch (suErr: any) {
        try {
          console.error('Signup failed during onboarding (detailed):', suErr);
          console.error('Signup error - data:', suErr?.data || suErr?.error || suErr?.response || null);
          console.error('Signup error - status:', suErr?.status || suErr?.originalStatus || null);
        } catch (logErr) {
          console.warn('Failed to log signup error details:', logErr);
        }
        setSubmissionError(suErr?.data?.message || suErr?.message || 'Failed to create admin account');
        return;
      }

      // Optionally, you can call completeOnboarding to finalize any additional steps if needed.
      // For now, creation of school + admin is sufficient.

      const result = { success: true, data: { school: createdSchool } };

         // DEBUG: Log the actual response structure
    // console.log('Full API Response:', result);
    // console.log('Response keys:', Object.keys(result));

      if (result.success) {
        // Store authentication data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('token', result.data?.token || ''); // If your API returns a token

        // Set generated credentials (school unique id) from API response
        const schoolUniqueId = result.data?.school?.schoolUniqueId || result.data?.schoolUniqueId || '';
        setGeneratedCredentials({
          schoolUniqueId,
          adminEmail: data.adminEmail
        });

        toast({
          variant: "success",
          title: "Setup Complete!",
          description: `Welcome to ${data.schoolName}. Your workspace is ready.`
        });
      } else {
        setSubmissionError(result.message || "Failed to create workspace");
      }
    } catch (error: any) {
      // Helper to safely stringify objects that may contain circular refs
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (_key: string, value: any) => {
          if (value !== null && typeof value === 'object') {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        };
      };

      const err: any = error;

      // Best-effort structured logging for common error shapes
      try {
        console.error('Onboarding error (full):', err);
        if (err?.data) console.error('Onboarding error - data:', err.data);
        if (err?.status) console.error('Onboarding error - status:', err.status);
        if (err?.error) console.error('Onboarding error - error:', err.error);
        if (err?.message) console.error('Onboarding error - message:', err.message);
      } catch (logErr) {
        // Fallback if console.error itself fails for some reason
        // eslint-disable-next-line no-console
        console.warn('Failed to log onboarding error:', logErr);
      }

      // Derive a friendly message for display to the user
      let friendlyMessage: string | null = null;

      if (err?.data?.message) friendlyMessage = err.data.message;
      else if (err?.data?.error) friendlyMessage = err.data.error;
      else if (err?.error?.message) friendlyMessage = err.error.message;
      else if (err?.message) friendlyMessage = err.message;
      else if (typeof err === 'string') friendlyMessage = err;
      else {
        try {
          friendlyMessage = JSON.stringify(err, getCircularReplacer(), 2);
        } catch (stringErr) {
          friendlyMessage = 'An unexpected error occurred during workspace creation.';
        }
      }

      setSubmissionError(friendlyMessage);
    }
  };

  const onSubmit: SubmitHandler<OnboardingValues> = async (data) => {

    // Payment is commented out for now — always finalize onboarding immediately.
    await finalizeOnboarding(data);
  };

  // Payment flow temporarily removed.

  const selectedPlan = form.watch('plan');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });

  };


  const resetDialog = () => {
    form.reset();
    setCurrentStep(0);
    setGeneratedCredentials(null);
    onBackToRoleSelection();
    setSubmissionError(null);
  };


  return (
    <>
      <div className="w-full max-w-3xl mx-auto animate-in-up">
            <div className="mb-4">
              <Button variant="ghost" size="sm" onClick={handlePrev} className="ml-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
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
                    <p className="text-sm text-muted-foreground mt-1">Your school has been created. Below is your School Unique ID.</p>
                    <div className="mt-4 text-left">
                      <div className="p-4 rounded-lg bg-muted/50 border flex items-center justify-between">
                        <div>
                          <Label className="text-xs">School Unique ID</Label>
                          <div className="font-mono text-sm mt-1">{generatedCredentials.schoolUniqueId}</div>
                        </div>
                        <Copy 
                          className="h-4 w-4 cursor-pointer text-muted-foreground" 
                          onClick={() => copyToClipboard(generatedCredentials.schoolUniqueId)}
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span>School Unique ID has also been sent to the admin email: <strong>{generatedCredentials.adminEmail}</strong></span>
                    </div>
                    <Button 
                      className="mt-6 w-full" 
                      onClick={() => showPreloader('/admin/dashboard')}
                    >
                      Go to Dashboard
                    </Button>
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
                        <Button type="button" variant="ghost" onClick={handlePrev}>
                          <ArrowLeft className="mr-2 h-4 w-4"/> 
                          Back
                        </Button>
                      </div>
                      <div>
                        {currentStep < STEPS.length - 1 ? (
                          <Button type="button" onClick={handleNext}>
                            Continue <ArrowRight className="ml-2 h-4 w-4"/>
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
      
      {/* Payment dialog disabled for now. Payment will be implemented later. */}
    </>
  );
}
