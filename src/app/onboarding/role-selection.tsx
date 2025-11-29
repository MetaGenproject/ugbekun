
"use client";

import { Logo } from "@/components/logo";

export type UserRole = 'school-admin' | 'teacher' | 'parent';

export function RoleSelection({ role }: { role: UserRole }) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-8">
                <Logo className="h-10 text-primary dark:text-white mx-auto"/>
                <h1 className="text-2xl font-semibold tracking-tight mt-4">Welcome to Ugbekun</h1>
                <p className="text-muted-foreground mt-1">Your selected role: <span className="font-bold text-primary">{role}</span></p>
            </div>
        </div>
    );
}
