
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type TeamMember, initialTeamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Mail, Phone, Building, Briefcase, CheckCircle, Shield, ShieldOff, KeyRound } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { AddTeamMemberDialog } from '@/components/super-admin-dashboard/add-team-member-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { recentActivities } from '@/lib/super-admin-data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const permissions = [
    { id: 'schools', label: 'School Management', description: 'Can view, add, edit, and remove schools.' },
    { id: 'billing', label: 'Billing & Subscriptions', description: 'Can view financial data and manage subscriptions.' },
    { id: 'users', label: 'User Management', description: 'Can invite, edit, and remove team members.' },
    { id: 'support', label: 'Support Tickets', description: 'Can view and respond to support escalations.' },
    { id: 'analytics', label: 'Platform Analytics', description: 'Can view platform-wide analytics and growth metrics.' },
];

interface TeamMemberProfileClientProps {
    member: TeamMember;
    allTeamMembers: TeamMember[];
}

export default function TeamMemberProfileClient({ member: initialMember, allTeamMembers }: TeamMemberProfileClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [team, setTeam] = useLocalStorage<TeamMember[]>('internal-team', allTeamMembers);
    
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
    
    const member = team.find(m => m.id === initialMember.id) || initialMember;

    const handleUpdateMember = (updatedMember: TeamMember) => {
        setTeam(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    };

     const handleDeactivate = () => {
        if (!member) return;
        handleUpdateMember({ ...member, status: 'Inactive' });
        setIsDeactivateOpen(false);
        toast({ variant: 'destructive', title: "Account Deactivated", description: `${member.name}'s account has been deactivated.` });
    };

    const handlePasswordReset = () => {
        toast({ title: "Password Reset Triggered", description: `A reset link has been sent to ${member?.email}.` });
    };
    
    if (!member) {
        return null; // Or a loading skeleton while redirecting
    }

    const memberActivity = recentActivities.slice(0, 3).map((act, i) => ({
        ...act,
        id: i,
        description: `onboarded ${act.school.name}.`,
    }));
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Team Member Profile</h1>
                </div>

                 <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Avatar className="h-24 w-24 border">
                            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <CardTitle className="text-2xl">{member.name}</CardTitle>
                                <Badge variant={member.status === "Active" ? "secondary" : "outline"} className={member.status === 'Active' ? 'bg-green-100 text-green-800' : ''}>
                                    {member.status}
                                </Badge>
                            </div>
                            <CardDescription className="text-base flex items-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4" /> {member.role}
                            </CardDescription>
                             <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {member.email}</div>
                                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 08012345678</div>
                                <div className="flex items-center gap-2"><Building className="h-4 w-4" /> {member.department}</div>
                            </div>
                        </div>
                        <Button onClick={() => setIsEditDialogOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    </CardHeader>
                </Card>

                 <Tabs defaultValue="activity">
                    <TabsList>
                        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="activity" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Log</CardTitle>
                                <CardDescription>Recent actions performed by this team member.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {memberActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarFallback>{activity.school.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">
                                                <span className="font-semibold">{member.name}</span> {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="permissions" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Role-Based Permissions</CardTitle>
                                <CardDescription>Enable or disable access to specific platform modules for this user.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                {permissions.map(permission => (
                                    <div key={permission.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <Label htmlFor={`switch-${permission.id}`} className="font-medium">{permission.label}</Label>
                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                        </div>
                                        <Switch id={`switch-${permission.id}`} defaultChecked />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="account-settings" className="mt-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Account Actions</CardTitle>
                                <CardDescription>Manage this user's account status and security.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div>
                                        <Label className="font-medium">Trigger Password Reset</Label>
                                        <p className="text-xs text-muted-foreground">Send a secure link to the user's email to reset their password.</p>
                                    </div>
                                    <Button variant="outline" onClick={handlePasswordReset}>
                                        <KeyRound className="mr-2 h-4 w-4" /> Send Reset Link
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                                    <div>
                                        <Label className="font-medium text-destructive">Deactivate Account</Label>
                                        <p className="text-xs text-muted-foreground">Immediately revoke this user's access to the platform.</p>
                                    </div>
                                    <Button variant="destructive" onClick={() => setIsDeactivateOpen(true)}>
                                        <ShieldOff className="mr-2 h-4 w-4" /> Deactivate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
             <AddTeamMemberDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onAddMember={() => {}}
                onUpdateMember={handleUpdateMember}
                memberToEdit={member}
            />
            <ConfirmationDialog
                isOpen={isDeactivateOpen}
                onClose={() => setIsDeactivateOpen(false)}
                onConfirm={handleDeactivate}
                title="Deactivate Team Member?"
                description={`Are you sure you want to deactivate ${member.name}'s account? Their access will be revoked immediately.`}
                confirmText="Yes, Deactivate"
            />
        </>
    )
}

    