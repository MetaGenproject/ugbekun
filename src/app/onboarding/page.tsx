
"use client";

import { useState } from 'react';
import { OnboardingForm } from "./onboarding-form";
import { RoleSelection } from './role-selection';
import { TeacherParentOnboarding } from './teacher-parent-onboarding';
import type { UserRole } from './role-selection';

export default function OnboardingPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
    };

    const handleBack = () => {
        setSelectedRole(null);
    }

    if (!selectedRole) {
        return <RoleSelection onSelectRole={handleRoleSelect} />;
    }

    if (selectedRole === 'school-admin') {
        return <OnboardingForm onBackToRoleSelection={handleBack} />;
    }

    return <TeacherParentOnboarding role={selectedRole} onBack={handleBack} />;
}
