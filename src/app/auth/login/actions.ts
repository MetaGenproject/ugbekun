"use server";
import { z } from "zod";
import { signupUser } from "@/app/api/auth-service";

const signupSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function signupAction(data: z.infer<typeof signupSchema>) {
    try {
        const validatedData = signupSchema.parse(data);
        const result = await signupUser(validatedData);
        if (result.success) {
            return {
                success: true,
                redirectPath: "/onboarding",
            };
        } else {
            return {
                success: false,
                error: result.error || "An unknown error occurred.",
            };
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map((e) => e.message).join(", "),
            };
        }
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}

