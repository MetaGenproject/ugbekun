
"use client";
<<<<<<< HEAD
import { GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
=======

>>>>>>> origin/new-feature
import { Logo } from "@/components/logo";

export type UserRole = 'school-admin' | 'teacher' | 'parent';

<<<<<<< HEAD
const roles = [
    {
        id: "school-admin" as UserRole,
        title: "School Owner / Admin",
        description: "Create a new workspace for your entire school.",
        icon: ShieldCheck,
    },
    {
        id: "teacher" as UserRole,
        title: "Teacher",
        description: "Join your school's existing workspace with an invite code.",
        icon: GraduationCap,
    },
    {
        id: "parent" as UserRole,
        title: "Parent or Guardian",
        description: "Connect to your child's profile or find a school.",
        icon: HeartHandshake,
    },
];

export function RoleSelection({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-8">
                 <Logo className="h-10 text-primary dark:text-white mx-auto"/>
                <h1 className="text-2xl font-semibold tracking-tight mt-4">Welcome to Ugbekun</h1>
                <p className="text-muted-foreground mt-1">Please select your role to get started.</p>
            </div>
            <div className="space-y-4 animate-in-up">
                {roles.map(role => (
                    <Card
                        key={role.id}
                        onClick={() => onSelectRole(role.id)}
                        className="p-6 cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg grid place-items-center bg-secondary text-secondary-foreground">
                                <role.icon className="h-6 w-6"/>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{role.title}</h3>
                                <p className="text-muted-foreground text-sm">{role.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
=======
export function RoleSelection({ role }: { role: UserRole }) {
    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-8">
                <Logo className="h-10 text-primary dark:text-white mx-auto"/>
                <h1 className="text-2xl font-semibold tracking-tight mt-4">Welcome to Ugbekun</h1>
                <p className="text-muted-foreground mt-1">Your selected role: <span className="font-bold text-primary">{role}</span></p>
>>>>>>> origin/new-feature
            </div>
        </div>
    );
}
