

"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";

export function OnboardingStepWelcome({ form }: { form: UseFormReturn<OnboardingValues> }) {
    return (
        <section className="animate-in-up h-full flex flex-col justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground grid place-items-center mx-auto">
                    <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mt-4">Welcome to Ugbekun!</h2>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">Let's get your school set up in just a few minutes.</p>
            </div>
            <div className="mt-8 max-w-sm mx-auto w-full">
                 <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="schoolName" className="sr-only">School Name</FormLabel>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                                <FormControl>
                                    <Input id="schoolName" placeholder="e.g., Unity College" className="pl-10 text-base" {...field} />
                                </FormControl>
                            </div>
                             <FormMessage className="text-center" />
                        </FormItem>
                    )}
                 />
            </div>
        </section>
    );
}
