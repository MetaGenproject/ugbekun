

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

"use server";

import { z } from "zod";
import apiClient from "@/app/api/api-client";

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

    try {
        console.log('Starting login attempt for:', parsed.data.email);
        
        const response = await apiClient.post('/auth/login', parsed.data);
        const result = response.data;

        if (!result.success) {
            return { success: false, redirectPath: "", error: result.message || "Login failed" };
        }

        // Assuming the backend returns a token and user data, and we need to decide the redirect path based on the role.
        // The backend should ideally return the role of the logged-in user.
        // For now, we'll use the role from the input to determine the redirect path.
        
        let redirectPath = "";
        switch (parsed.data.role) {
            case "super-admin":
                redirectPath = "/super-admin/dashboard";
                break;
            case "student":
                redirectPath = "/student/dashboard";
                break;
            case "admin":
                redirectPath = "/admin/dashboard";
                break;
            case "teacher":
                redirectPath = "/teacher/dashboard";
                break;
            case "guardian":
                redirectPath = "/parent/dashboard";
                break;
            default:
                return { success: false, redirectPath: "", error: "Invalid role specified." };
        }

        return { success: true, redirectPath: redirectPath };

    } catch (error: any) {
        console.error("Login action error:", error);
        if (error.response && error.response.data && error.response.data.message) {
            return { success: false, redirectPath: "", error: error.response.data.message };
        }
        return { success: false, redirectPath: "", error: "An unexpected error occurred." };
    }
}

import { signupUser } from "@/app/api/auth-service";

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

    try {
        const result = await signupUser(parsed.data);
        if (result.success) {
            return { success: true, redirectPath: "/onboarding" };
        } else {
            return { success: false, error: result.error || "An unknown error occurred." };
        }
    } catch (error) {
        return { success: false, error: "An unexpected error occurred. Please try again." };
    }
}
