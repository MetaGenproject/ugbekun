
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type School, schoolsData } from '@/lib/super-admin-data';
import { UpgradeDialog } from '@/components/layout/upgrade-dialog';

export type Plan = "Starter" | "Growth" | "Enterprise";

export interface PlanFeatures {
    DASHBOARD: boolean;
    STUDENT_PROFILES: boolean;
    FINANCE: boolean;
    AI_REPORTS: boolean;
    ADMISSIONS: boolean;
    TIMETABLE: boolean;
    EXAMS: boolean;
    COMMUNICATIONS: boolean;
    ADVANCED: boolean; // For things like Library, HR, Transport, Report Designer etc.
}

export const planLimits: Record<Plan, { students: number }> = {
    "Starter": { students: 100 },
    "Growth": { students: 1000 },
    "Enterprise": { students: Infinity },
}

export const planFeatures: Record<Plan, PlanFeatures> = {
    "Starter": {
        DASHBOARD: true,
        STUDENT_PROFILES: true,
        FINANCE: false,
        AI_REPORTS: false,
        ADMISSIONS: false,
        TIMETABLE: false,
        EXAMS: false,
        COMMUNICATIONS: false,
        ADVANCED: false,
    },
    "Growth": {
        DASHBOARD: true,
        STUDENT_PROFILES: true,
        FINANCE: true,
        AI_REPORTS: true,
        ADMISSIONS: true,
        TIMETABLE: true,
        EXAMS: true,
        COMMUNICATIONS: true,
        ADVANCED: false,
    },
    "Enterprise": {
        DASHBOARD: true,
        STUDENT_PROFILES: true,
        FINANCE: true,
        AI_REPORTS: true,
        ADMISSIONS: true,
        TIMETABLE: true,
        EXAMS: true,
        COMMUNICATIONS: true,
        ADVANCED: true,
    },
};


interface PlanContextType {
    plan: Plan;
    isLoading: boolean;
    hasFeature: (feature: keyof PlanFeatures) => boolean;
    openUpgradeDialog: (featureKey: keyof PlanFeatures) => void;
    planLimits: typeof planLimits;
    setPlan: React.Dispatch<React.SetStateAction<Plan>>;
}

const PlanContext = createContext<PlanContextType>({
    plan: 'Starter',
    isLoading: true,
    hasFeature: () => false,
    openUpgradeDialog: () => {},
    planLimits,
    setPlan: () => {},
});

export const usePlan = () => useContext(PlanContext);

export function PlanProvider({ children }: { children: ReactNode }) {
    const [schools] = useLocalStorage<School[]>('schools', schoolsData);
    const [plan, setPlan] = useState<Plan>('Starter');
    const [isLoading, setIsLoading] = useState(true);
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState<keyof PlanFeatures | null>(null);

    useEffect(() => {
        if (schools && schools.length > 0) {
            setPlan(schools[0].plan);
        } else {
            // Default for a brand new user before school is created
            setPlan('Starter');
        }
        setIsLoading(false);
    }, [schools]);


    const hasFeature = (feature: keyof PlanFeatures) => {
        if (isLoading) return false;
        // Enterprise plan has all features
        if (plan === 'Enterprise') return true;
        return planFeatures[plan][feature];
    };

    const openUpgradeDialog = (featureKey: keyof PlanFeatures) => {
        if (plan === 'Enterprise') return;
        setUpgradeFeature(featureKey);
        setIsUpgradeDialogOpen(true);
    };

    const value = {
        plan,
        isLoading,
        hasFeature,
        openUpgradeDialog,
        planLimits,
        setPlan,
    };

    return (
        <PlanContext.Provider value={value}>
            {children}
            <UpgradeDialog 
                isOpen={isUpgradeDialogOpen}
                onClose={() => setIsUpgradeDialogOpen(false)}
                featureKey={upgradeFeature}
                currentPlan={plan}
            />
        </PlanContext.Provider>
    );
}
