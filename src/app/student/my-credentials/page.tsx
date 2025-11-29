"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { type VerifiableCredential, initialVerifiableCredentials } from "@/lib/credentials-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, FileText } from "lucide-react";
import type { Student } from "@/lib/admin-data";
import { recentStudents } from "@/lib/admin-data";

export default function StudentMyCredentialsPage() {
    // In a real app, this would come from auth context. We'll mock it for Aisha Bello.
    const studentId = 'UC-AB-2024'; 
    const [credentials, setCredentials] = useLocalStorage<VerifiableCredential[]>("verifiable-credentials", initialVerifiableCredentials);
    
    const myCredentials = credentials.filter(c => c.studentId === studentId);

    const handleTogglePublic = (credentialId: string, isPublic: boolean) => {
        setCredentials(prev => prev.map(c => 
            c.id === credentialId ? { ...c, isPublic } : c
        ));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Verifiable Credentials</CardTitle>
                <CardDescription>
                    Manage your on-chain academic records issued by the school. Toggle which credentials are publicly visible on your profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[60vh]">
                    <div className="space-y-4 pr-4">
                        {myCredentials.map(credential => (
                             <div key={credential.id} className="p-4 rounded-lg border flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                     <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center shrink-0">
                                        <FileText className="h-5 w-5 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{credential.title}</p>
                                        <p className="text-xs text-muted-foreground">Issued: {credential.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id={`switch-${credential.id}`}
                                        checked={credential.isPublic}
                                        onCheckedChange={(checked) => handleTogglePublic(credential.id, checked)}
                                    />
                                    <Label htmlFor={`switch-${credential.id}`} className="text-sm font-medium">
                                        Public
                                    </Label>
                                </div>
                            </div>
                        ))}
                         {myCredentials.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <ShieldCheck className="mx-auto h-12 w-12 opacity-50" />
                                <p className="mt-4">You have no verifiable credentials yet.</p>
                            </div>
                         )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
