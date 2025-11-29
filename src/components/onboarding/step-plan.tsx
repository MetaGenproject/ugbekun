
"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter" as const,
    price: "Free",
    priceDetail: "14-day trial",
    description: "Explore core features for new schools.",
    features: [
      "Up to 100 Students",
      "Core Student & Staff Profiles",
      "Class & Subject Management",
      "Email Support",
    ],
  },
  {
    name: "Growth" as const,
    price: "₦75,000",
    priceDetail: "/term",
    description: "For established schools ready to streamline and grow.",
    features: [
      "All features in Starter, plus:",
      "Finance & Invoicing Module",
      "Parent & Student Portals",
      "AI Report Generation",
    ],
    popular: true,
  },
  {
    name: "Enterprise" as const,
    price: "Custom",
    priceDetail: "",
    description: "For large, multi-campus institutions.",
    features: [
      "All features in Growth, plus:",
      "Multi-Campus Management",
      "Dedicated Success Manager",
      "Custom Integrations (SSO)",
    ],
  },
];


export function OnboardingStepPlan({ form }: { form: UseFormReturn<OnboardingValues> }) {
  return (
    <section className="animate-in-up">
      <h2 className="text-2xl font-semibold tracking-tight text-center">Choose Your Plan</h2>
      <p className="mt-2 text-muted-foreground text-center">Start with a 14-day free trial. No credit card required.</p>
      <div className="mt-8">
        <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
                <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                >
                    {plans.map(plan => (
                        <Card key={plan.name} className={cn("p-4 transition-all", field.value === plan.name && "ring-2 ring-primary")}>
                            <label htmlFor={plan.name} className="flex flex-col h-full cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value={plan.name} id={plan.name} />
                                        <span className="font-semibold">{plan.name}</span>
                                    </div>
                                    {plan.popular && <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"><Star className="h-3 w-3"/> Popular</div>}
                                </div>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold tracking-tight">{plan.price}</span>
                                    {plan.priceDetail && <span className="text-sm text-muted-foreground">{plan.priceDetail}</span>}
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground h-10">{plan.description}</p>
                                <ul className="mt-4 space-y-2 text-xs text-muted-foreground flex-1">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
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
