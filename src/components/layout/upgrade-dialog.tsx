
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Rocket, Star } from "lucide-react";
import type { Plan, PlanFeatures } from "@/context/plan-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UpgradeDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    featureKey: keyof PlanFeatures | null;
    currentPlan: Plan;
};

const featureDetails: Record<keyof PlanFeatures, { name: string, requiredPlan: Plan }> = {
    FINANCE: { name: "Finance & Invoicing", requiredPlan: 'Growth' },
    AI_REPORTS: { name: "AI Report Generation", requiredPlan: 'Growth' },
    ADMISSIONS: { name: "Admissions Management", requiredPlan: 'Growth' },
    COMMUNICATIONS: { name: "Parent Messaging", requiredPlan: 'Growth' },
    TIMETABLE: { name: "Advanced Timetabling", requiredPlan: 'Growth' },
    EXAMS: { name: "Examinations Module", requiredPlan: 'Growth' },
    ADVANCED: { name: "Enterprise Modules (HR, Library)", requiredPlan: 'Enterprise' },
    STUDENT_PROFILES: { name: "Adding More Students", requiredPlan: 'Growth' },
    DASHBOARD: { name: "Dashboard", requiredPlan: 'Starter' } // Should not be upgradeable
};

const planBenefits = {
    "Growth": ["Finance & Invoicing", "AI Reports", "Parent Communication", "Up to 1,000 Students"],
    "Enterprise": ["Multi-Campus Support", "Custom Integrations", "Dedicated Manager", "Unlimited Students"]
}


export function UpgradeDialog({ isOpen, onClose, featureKey, currentPlan }: UpgradeDialogProps) {
    const router = useRouter();
    if (!featureKey) return null;
    
    const details = featureDetails[featureKey];
    const targetPlan = details.requiredPlan;
    const benefits = planBenefits[targetPlan] || [];

    const handleUpgrade = () => {
        onClose();
        router.push('/admin/settings?tab=billing');
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 grid place-items-center mb-4 border-8 border-primary/5">
                        <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Upgrade to Unlock {details.name}</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        The "{details.name}" feature is available on the <span className="font-semibold text-foreground">{targetPlan}</span> plan.
                         Upgrade your account to access this and more powerful features.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h4 className="font-semibold text-center mb-3">The {targetPlan} Plan Includes:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {benefits.map(benefit => (
                            <li key={benefit} className="flex items-center gap-3">
                                <span className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-500/20 grid place-items-center">
                                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                </span>
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter className="sm:justify-center">
                     <Button type="button" variant="outline" onClick={onClose}>Maybe Later</Button>
                     <Button type="button" onClick={handleUpgrade}>
                        <Star className="mr-2 h-4 w-4" /> Upgrade Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
