

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

"use server";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["super-admin", "admin", "teacher", "student", "guardian"]),
});

type LoginInput = z.infer<typeof loginSchema>;

export async function loginAction(input: LoginInput): Promise<{ success: boolean; redirectPath: string; error?: string; }> {
    const parsed = loginSchema.safeParse(input);

    if (!parsed.success) {
        return { success: false, redirectPath: "", error: "Invalid input." };
    }

    // This is a mock authentication. In a real app, you'd verify credentials.

    switch (parsed.data.role) {
        case "super-admin":
            return { success: true, redirectPath: "/super-admin/dashboard" };
        case "student":
            return { success: true, redirectPath: "/student/dashboard" };
        case "admin":
             return { success: true, redirectPath: "/admin/dashboard" };
        case "teacher":
             return { success: true, redirectPath: "/teacher/dashboard" };
        case "guardian":
            return { success: true, redirectPath: "/parent/dashboard" };
        default:
             return { success: false, redirectPath: "", error: "Invalid role specified." };
    }
}

// In a real app, you'd have a separate signup action.
// For now, we'll keep this simple.
const signupSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

type SignupInput = z.infer<typeof signupSchema>;

export async function signupAction(input: SignupInput): Promise<{ success: boolean; error?: string; redirectPath?: string }> {
    const parsed = signupSchema.safeParse(input);
    if(!parsed.success) {
        return { success: false, error: "Invalid signup data." };
    }

    // Mock signup
    console.log("New user signed up:", parsed.data.email);
    
    return { success: true, redirectPath: "/onboarding" };
}
