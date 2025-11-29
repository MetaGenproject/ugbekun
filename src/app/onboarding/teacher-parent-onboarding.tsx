
"use client";

import { useState, useContext } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PreloaderContext } from "@/context/preloader-context";
import { UserRole } from "./role-selection";

export function TeacherParentOnboarding({ role, onBack }: { role: UserRole, onBack: () => void }) {
    const { toast } = useToast();
    const { showPreloader } = useContext(PreloaderContext);
    const [isLoading, setIsLoading] = useState(false);

    const title = role === 'teacher' ? "Join Your School" : "Connect to Your Child";
    const description = role === 'teacher' 
        ? "Enter the unique School ID and invite code provided by your administrator."
        : "Enter the code from your school to link to your child's profile.";
    const redirectPath = role === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard';
    const successMessage = role === 'teacher' ? "Account created! Redirecting to your dashboard." : "Account linked! Redirecting now.";
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast({
                variant: 'success',
                title: 'Verification Successful',
                description: successMessage,
            });
            showPreloader(redirectPath);
        }, 1000);
    }

    return (
        <div className="w-full max-w-md mx-auto">
             <Card className="animate-in-up">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="school-id">School ID</Label>
                            <Input id="school-id" placeholder="e.g., UGB-0123" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="invite-code">Verification Code</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input id="invite-code" placeholder="Enter your 6-digit code" className="pl-10" required />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" type="button" onClick={onBack} disabled={isLoading}>
                                <ArrowLeft className="mr-2 h-4 w-4"/> Back
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Continue"}
                            </Button>
                        </div>
                        {role === 'parent' && (
                            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                                Don't have an invite code? <a href="#" className="font-medium text-primary underline">Find your school to apply</a>.
                            </div>
                        )}
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
