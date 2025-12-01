

"use client";
import { UseFormReturn } from "react-hook-form";
import { OnboardingValues } from "@/app/onboarding/onboarding-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const adminRoles = ["Proprietor", "Principal", "Head of School", "Administrator", "IT Administrator"];

export function OnboardingStepAdminAccount({ form }: { form: UseFormReturn<OnboardingValues> }) {
  return (
    <section className="animate-in-up">
      <h2 className="text-2xl font-semibold tracking-tight text-center">Create Your Admin Account</h2>
      <p className="mt-2 text-muted-foreground text-center">This will be the primary account for managing your school.</p>
      <div className="mt-8 max-w-lg mx-auto space-y-4">
        <FormField
          control={form.control}
          name="adminName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Full Name</FormLabel>
              <FormControl><Input placeholder="e.g., Adaobi Okoro" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {adminRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                  </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="adminPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl><Input type="tel" placeholder="+234..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<<<<<<< HEAD
=======
        <FormField
          control={form.control}
          name="adminPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="Create a secure password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="adminConfirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl><Input type="password" placeholder="Confirm password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
>>>>>>> origin/new-feature
      </div>
    </section>
  );
}
