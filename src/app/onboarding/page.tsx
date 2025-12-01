
"use client";

<<<<<<< HEAD
import { useState } from 'react';
import { OnboardingForm } from "./onboarding-form";
import { RoleSelection } from './role-selection';
import { TeacherParentOnboarding } from './teacher-parent-onboarding';
import type { UserRole } from './role-selection';

export default function OnboardingPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
=======
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from "./onboarding-form";
import { TeacherParentOnboarding } from './teacher-parent-onboarding';
import type { UserRole } from './role-selection';
import Link from 'next/link';

export default function OnboardingPage() {
    // Default to school-admin so visiting /onboarding opens the admin onboarding form directly
    const [selectedRole, setSelectedRole] = useState<UserRole | null>('school-admin');
    const router = useRouter();

    // If a role is provided via query param (e.g. ?role=super-admin) or from localStorage,
    // map it to the onboarding `UserRole` and skip the role selection step.
    useEffect(() => {
        const mapRole = (r?: string | null): UserRole | null => {
            if (!r) return null;
            const rr = r.toLowerCase();
            if (rr === 'super-admin' || rr === 'admin') return 'school-admin';
            if (rr === 'teacher') return 'teacher';
            if (rr === 'guardian' || rr === 'parent' || rr === 'student') return 'parent';
            return null;
        };

        try {
            const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
            const roleParam = params?.get('role');
            const stored = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
            const mapped = mapRole(roleParam) || mapRole(stored);
            if (mapped) {
                setSelectedRole(mapped);
            } else {
                // No explicit role; ensure URL indicates school-admin so the onboarding form loads reliably.
                try {
                    if (typeof window !== 'undefined' && !roleParam) {
                        const newUrl = `${window.location.pathname}?role=school-admin`;
                        // Use replace to avoid polluting history
                        router.replace(newUrl);
                        setSelectedRole('school-admin');
                    } else {
                        setSelectedRole('school-admin');
                    }
                } catch (e) {
                    setSelectedRole('school-admin');
                }
            }
        } catch (err) {
            // ignore and fall back to manual selection
        }
    }, []);
>>>>>>> origin/new-feature

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleBack = () => {
<<<<<<< HEAD
        setSelectedRole(null);
    }

    if (!selectedRole) {
        return <RoleSelection onSelectRole={handleRoleSelect} />;
    }

    if (selectedRole === 'school-admin') {
        return <OnboardingForm onBackToRoleSelection={handleBack} />;
=======
        // No role selection screen anymore; go back to login/signup so user can choose role there.
        if (typeof window !== 'undefined') window.location.href = '/login';
    }

    if (!selectedRole) {
        // If no role was provided, prompt the user to sign up or login where role is selected.
        return (
            <div className="w-full max-w-lg mx-auto p-12 text-center">
                <h2 className="text-2xl font-semibold mb-4">Role not specified</h2>
                <p className="text-muted-foreground mb-6">Onboarding requires a role selected at signup. Please sign up or login and choose your role to continue.</p>
                <div className="flex items-center justify-center gap-4">
                    <Link href="/login" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Go to Login / Signup</Link>
                </div>
            </div>
        );
    }

    if (selectedRole === 'school-admin') {
        return <OnboardingForm onBackToRoleSelection={handleBack} role={selectedRole} />;
>>>>>>> origin/new-feature
    }

    return <TeacherParentOnboarding role={selectedRole} onBack={handleBack} />;
}
