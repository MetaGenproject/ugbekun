
"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lock, SlidersHorizontal } from "lucide-react";

const systems = [
    {
        name: "Standard" as const,
        title: "Standard System (Off-chain)",
        description: "A traditional, secure cloud-based system. Fast, familiar, and easy to start with.",
        icon: SlidersHorizontal,
    },
    {
        name: "SMSUP+" as const,
        title: "SMSUP+ (On-chain)",
        description: "Anchor critical data on the blockchain for unparalleled security, transparency, and trust.",
        icon: Lock,
        tag: "Recommended"
    }
]

export function OnboardingStepSystem({ form }: { form: UseFormReturn<OnboardingValues> }) {
  return (
    <section className="animate-in-up">
      <h2 className="text-2xl font-semibold tracking-tight text-center">Choose Your Data System</h2>
      <p className="mt-2 text-muted-foreground text-center max-w-md mx-auto">Select the underlying technology for your school's most critical data.</p>
      <div className="mt-8 max-w-lg mx-auto">
        <FormField
            control={form.control}
            name="system"
            render={({ field }) => (
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                >
                    {systems.map(system => (
                        <Card key={system.name} className={cn("transition-all", field.value === system.name && "ring-2 ring-primary")}>
                             <label htmlFor={system.name} className="flex items-start gap-4 cursor-pointer p-4">
                                <RadioGroupItem value={system.name} id={system.name} className="mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">{system.title}</CardTitle>
                                        {system.tag && <div className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">{system.tag}</div>}
                                    </div>
                                    <CardDescription className="mt-1">{system.description}</CardDescription>
                                    {system.name === 'SMSUP+' && <p className="text-xs text-primary font-medium mt-2">Opting in initiates the seamless migration process. A one-time setup fee may apply.</p>}
                                </div>
                                <div className="h-10 w-10 grid place-items-center rounded-lg bg-secondary text-secondary-foreground shrink-0">
                                    <system.icon className="h-5 w-5" />
                                </div>
                            </label>
                        </Card>
                    ))}
                </RadioGroup>
            )}
        />
      </div>
    </section>
  );
}
