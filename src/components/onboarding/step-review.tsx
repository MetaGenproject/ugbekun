
"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function OnboardingStepReview({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const formData = form.getValues();

  const reviewItems = [
    { label: "School Name", value: formData.schoolName },
    { label: "Levels", value: formData.schoolLevels.join(', ') },
    { label: "Motto", value: formData.motto },
    { label: "Location", value: `${formData.address}, ${formData.lga}, ${formData.state}, ${formData.country}` },
    { label: "Admin", value: `${formData.adminName} (${formData.adminEmail})` },
    { label: "Curriculum", value: formData.curriculum },
    { label: "Plan", value: formData.plan },
    { label: "System", value: formData.system },
  ];

  return (
    <section className="animate-in-up">
      <h2 className="text-2xl font-semibold tracking-tight text-center">Review & Launch</h2>
      <p className="mt-2 text-muted-foreground text-center">One final check before we create your workspace.</p>
      
      <ScrollArea className="h-64 mt-8">
        <div className="space-y-4 pr-4">
            {reviewItems.map(item => item.value && (
                <div key={item.label} className="p-3 rounded-lg bg-muted/50 border">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="font-medium text-sm">{item.value}</div>
                </div>
            ))}
        </div>
      </ScrollArea>
       <div className="mt-6">
            <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-0">
                        <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-muted-foreground font-normal">
                            I agree to the <Link href="/terms" target="_blank" className="underline hover:no-underline text-foreground">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="underline hover:no-underline text-foreground">Privacy Policy</Link>.
                        </FormLabel>
                        <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
       </div>

    </section>
  );
}
