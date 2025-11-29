
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type OnboardingProgressProps = {
    steps: { id: string; title: string }[];
    currentStep: number;
};

export function OnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
    return (
        <div className="flex justify-between items-center">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center">
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            currentStep > index ? 'bg-primary text-primary-foreground' :
                            currentStep === index ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                            'bg-muted text-muted-foreground'
                        )}>
                            {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <span className={cn(
                            "text-xs mt-2 transition-colors hidden sm:block",
                            currentStep >= index ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        )}>
                            {step.title}
                        </span>
                    </div>
                     {index < steps.length - 1 && (
                        <div className={cn("flex-1 h-0.5 mx-2 transition-colors", currentStep > index ? 'bg-primary' : 'bg-border')}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
