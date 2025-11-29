
"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BrainCircuit } from "lucide-react";

const curriculums = ["Nigerian National", "British", "American", "International Baccalaureate (IB)"];
const feeItems = [
    { id: "Tuition", label: "Tuition Fees" },
    { id: "Uniforms", label: "Uniforms" },
    { id: "Books", label: "Books & Stationary" },
    { id: "PTA Levy", label: "PTA Levy" },
    { id: "Hostel", label: "Hostel/Boarding Fees" },
    { id: "Extra-curricular", label: "Extra-curricular Activities" },
];

export function OnboardingStepIntelligence({ form }: { form: UseFormReturn<OnboardingValues> }) {
  return (
    <section className="animate-in-up">
        <div className="text-center">
            <div className="w-12 h-12 grid place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 mx-auto mb-4">
                <BrainCircuit className="h-6 w-6"/>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Intelligence Setup</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">Let AI help pre-configure your school's academic and financial structures.</p>
        </div>
      <div className="mt-8 max-w-lg mx-auto space-y-6">
        <FormField
          control={form.control}
          name="curriculum"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Curriculum</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a curriculum" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {curriculums.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormDescription>This will pre-populate classes, subjects, and term dates.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="feeStructure"
            render={() => (
                <FormItem>
                     <div className="mb-4">
                        <FormLabel>Default Fee Structure</FormLabel>
                        <FormDescription>Select common fee items. You can customize this later.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {feeItems.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="feeStructure"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                                )
                            }}
                        />
                     ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />

      </div>
    </section>
  );
}
