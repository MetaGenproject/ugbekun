
"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { CheckCircle, Star } from "lucide-react";
import type { Plan } from "@/context/plan-context";

const planData: Record<Plan, { price: string, features: string[], popular: boolean }> = {
    "Starter": {
        price: "Free",
        features: ["Up to 100 Students", "Core Profiles", "Basic Reporting"],
        popular: false,
    },
    "Growth": {
        price: "₦75,000 /term",
        features: ["Up to 1000 Students", "Finance Module", "AI Reports", "Parent Communication"],
        popular: true,
    },
    "Enterprise": {
        price: "Custom",
        features: ["Unlimited Students", "Multi-Campus", "Dedicated Support", "SSO & SAML"],
        popular: false,
    }
}


export default function SuperAdminSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [platformName, setPlatformName] = useState("Ugbekun");

    const handleSaveChanges = () => {
        toast({
            variant: "success",
            title: "Settings Saved",
            description: "Platform settings have been updated successfully."
        })
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Configuration</CardTitle>
                            <CardDescription>Update global branding and information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="platform-name">Platform Name</Label>
                                <Input id="platform-name" value={platformName} onChange={e => setPlatformName(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Platform Logo</Label>
                                <div className="flex items-center gap-4">
                                    <Logo className="h-10 text-primary dark:text-white"/>
                                    <Button variant="outline" onClick={() => toast({description: "Logo upload is not available."})}>Change Logo</Button>
                                </div>
                             </div>
                             <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the Super Admin dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label>Theme</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Select the theme for the dashboard.
                                    </p>
                                </div>
                                <Select value={theme} onValueChange={(value) => setTheme(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="plans" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Subscription Plans</CardTitle>
                            <CardDescription>Manage pricing and features for different tiers.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(Object.keys(planData) as Plan[]).map(planName => {
                                const plan = planData[planName];
                                return (
                                <Card key={planName} className={plan.popular ? "border-primary ring-2 ring-primary" : ""}>
                                    <CardHeader>
                                        {plan.popular && <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1"><Star className="h-3 w-3"/>Most Popular</div>}
                                        <CardTitle className="flex items-baseline gap-2">
                                            <span>{planName}</span>
                                            <span className="text-lg font-medium text-muted-foreground">{plan.price}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {plan.features.map(feature => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button variant="outline" className="w-full mt-6" onClick={() => toast({description: "Plan management is not implemented."})}>Edit Plan</Button>
                                    </CardContent>
                                </Card>
                            )})}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
