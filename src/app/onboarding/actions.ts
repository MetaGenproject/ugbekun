

"use server";

import { z } from "zod";
import type { OnboardingValues } from "@/components/onboarding/onboarding-form";
import { generateInitialSchoolData } from "@/lib/onboarding-data";
import * as DataStore from "@/lib/data-store";

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
  curriculum: z.string().min(1, "Please select a curriculum"),
  feeStructure: z.array(z.string()).optional(),
  plan: z.enum(["Starter", "Growth", "Enterprise"]),
  system: z.enum(["Standard", "SMSUP+"]),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions to launch.",
  }),
});

type CreateSchoolSuccessResult = {
    success: true;
    data: ReturnType<typeof generateInitialSchoolData>;
}
type CreateSchoolErrorResult = {
    success: false;
    error: string;
}

export async function createSchoolAction(
  values: OnboardingValues
): Promise<CreateSchoolSuccessResult | CreateSchoolErrorResult> {
  const parsed = onboardingSchema.safeParse(values);

  if (!parsed.success) {
    console.error("Onboarding validation failed:", parsed.error.flatten().fieldErrors);
    return {
      success: false,
      error: "Invalid onboarding data provided. Please check all fields.",
    };
  }

  try {
    const generatedData = generateInitialSchoolData(parsed.data);
    // This is now a server-side action. We cannot call localStorage from here.
    // Instead, we will return the generated data to the client.
    console.log("Onboarding complete. Generated data for new school workspace.");
    
    return {
      success: true,
      data: generatedData,
    };
  } catch (error: any) {
    console.error("Error in createSchoolAction:", error);
    // Return the specific error message
    return {
      success: false,
      error: `An unexpected error occurred: ${error.message}`,
    };
  }
}
