

"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/components/onboarding/onboarding-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { useEffect, useState } from "react";

const schoolLevels = [
    { id: "Nursery", label: "Nursery / KG" },
    { id: "Primary", label: "Primary School" },
    { id: "Junior Secondary", label: "Junior Secondary (JSS)" },
    { id: "Senior Secondary", label: "Senior Secondary (SSS)" },
    { id: "Sixth Form", label: "Sixth Form / A-Levels" },
];

export function OnboardingStepSchoolIdentity({ form }: { form: UseFormReturn<OnboardingValues> }) {
  const [states, setStates] = useState<{ name: string; lgas: string[] }[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);

  const selectedCountryName = form.watch("country");
  const selectedStateName = form.watch("state");

  useEffect(() => {
    const country = countries.find(c => c.name === selectedCountryName);
    setStates(country ? country.states : []);
    form.setValue("state", "");
    form.setValue("lga", "");
  }, [selectedCountryName, form]);

  useEffect(() => {
    const state = states.find(s => s.name === selectedStateName);
    setLgas(state ? state.lgas : []);
     form.setValue("lga", "");
  }, [selectedStateName, states, form]);

  return (
    <section className="animate-in-up">
      <h2 className="text-2xl font-semibold tracking-tight text-center">Tell us about your school</h2>
      <p className="mt-2 text-muted-foreground text-center">This information helps us personalize your workspace.</p>
      <div className="mt-8 max-w-lg mx-auto space-y-6">
        <FormField
            control={form.control}
            name="schoolLevels"
            render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>School Levels Offered</FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {schoolLevels.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="schoolLevels"
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
        <FormField
          control={form.control}
          name="motto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Motto (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., Excellence and Integrity" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Nigeria">Nigeria</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Region</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                     <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {states.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
          control={form.control}
          name="lga"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LGA / City</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                 <FormControl><SelectTrigger><SelectValue placeholder="Select LGA/City" /></SelectTrigger></FormControl>
                <SelectContent>
                    {lgas.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Address</FormLabel>
              <FormControl><Input placeholder="e.g., 123 Education Lane, Ikeja" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
