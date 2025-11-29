
"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type School, schoolsData } from "@/lib/super-admin-data";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { usePlan, type Plan } from "@/context/plan-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { CalendarIcon, Star, ShieldCheck, Zap, Wallet, ShieldOff, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PaymentGatewayDialog } from "@/components/ui/payment-gateway-dialog";
import { ConnectWalletDialog } from "@/components/ui/connect-wallet-dialog";
import { SmsupActivationDialog } from "@/components/admin-dashboard/smsup-activation-dialog";
import { ResponsiveCalendar } from "@/components/ui/responsive-calendar";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { DepartmentManager } from "@/components/admin-dashboard/department-manager";
import { FeaturesSectionManager } from "@/components/super-admin-dashboard/content/features-section-manager";
import { TestimonialsSectionManager } from "@/components/super-admin-dashboard/content/testimonials-section-manager";
import { FaqSectionManager } from "@/components/super-admin-dashboard/content/faq-section-manager";

type AcademicSettings = {
    session: string;
    term: string;
    nextResumption: Date | undefined;
}

const planPrices: Record<Plan, number> = {
    "Starter": 0,
    "Growth": 75000,
    "Enterprise": 250000, // Example price
}

function SettingsClientContent() {
  const { theme, setTheme } = useTheme();
  const [schools, setSchools] = useLocalStorage<School[]>("schools", schoolsData);
  const [schoolName, setSchoolName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null | undefined>("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState(false);
  const [isSmsupActivateOpen, setIsSmsupActivateOpen] = useState(false);
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [mockWallet, setMockWallet] = useLocalStorage('mock-wallet-connection', { connected: false, address: '' });
  
  const [academicSettings, setAcademicSettings] = useLocalStorage<AcademicSettings>("academic-settings", {
      session: "2024/2025",
      term: "First Term",
      nextResumption: new Date(2025, 0, 9),
  });
  
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { plan, setPlan: setContextPlan } = usePlan();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "general");
  
  const school = schools[0];

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
        setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (school) {
      setSchoolName(school.name);
      setLogoUrl(school.logoUrl);
      setCoverImageUrl(school.coverImageUrl);
      setContextPlan(school.plan);
    }
  }, [school, setContextPlan]);
  
  const handleUpgradePaymentSuccess = () => {
    const nextPlanMap: Record<Plan, Plan> = {
      "Starter": "Growth",
      "Growth": "Enterprise",
      "Enterprise": "Enterprise",
    };
    const currentPlan = school.plan;
    const nextPlan = nextPlanMap[currentPlan];
    
    setSchools(prev => {
        const updatedSchools = [...prev];
        if (updatedSchools.length > 0) {
            updatedSchools[0].plan = nextPlan;
        }
        return updatedSchools;
    });

    setIsPaymentOpen(false);
    toast({
      variant: 'success',
      title: "Upgrade Successful!",
      description: `Your school is now on the ${nextPlan} plan.`,
    })
  }

  const handleGeneralSaveChanges = () => {
    setSchools(prev => {
        const updatedSchools = [...prev];
        if (updatedSchools.length > 0) {
            updatedSchools[0].name = schoolName;
            updatedSchools[0].logoUrl = logoUrl;
            updatedSchools[0].coverImageUrl = coverImageUrl;
        }
        return updatedSchools;
    });
    toast({
      variant: 'success',
      title: "Settings Saved",
      description: "Your school's information has been updated.",
    })
  };
  
  const handleAcademicSaveChanges = () => {
    toast({
        variant: 'success',
        title: "Academic Settings Saved",
        description: "The academic session information has been updated.",
    })
  }

  const handleUpgradeClick = () => {
    if (plan !== 'Enterprise') {
        setIsPaymentOpen(true);
    } else {
        toast({ title: "You are already on the highest plan." });
    }
  };

  const handleCancelSubscription = () => {
    setIsCancelConfirmOpen(false);
    setSchools(prev => {
        const updatedSchools = [...prev];
        if (updatedSchools.length > 0) {
            updatedSchools[0].plan = 'Starter';
        }
        return updatedSchools;
    });
    toast({
        variant: 'destructive',
        title: "Subscription Canceled",
        description: "Your plan has been downgraded to the Starter plan at the end of your billing cycle.",
    });
  }

  const handleActivateSmsup = () => {
      setIsWalletConnectOpen(true);
  }
  
  const handleDeactivateSmsup = () => {
    setSchools(prev => prev.map(s => s.id === school.id ? { ...s, system: 'Standard', verified: false } : s));
    toast({ variant: 'destructive', title: 'SMSUP+ Deactivated', description: 'On-chain credentialing has been disabled for your school.' });
    setIsDeactivateConfirmOpen(false);
  }

  const handleWalletConnected = (address: string) => {
      setMockWallet({ connected: true, address });
      setIsWalletConnectOpen(false);
      setIsSmsupActivateOpen(true);
  }

  const handleSmsupActivation = (verificationFee: number) => {
    setSchools(prev => prev.map(s => s.id === school.id ? { ...s, system: 'SMSUP+', verified: true, verificationFee } : s));
    toast({ variant: 'success', title: 'SMSUP+ Activated!', description: 'Your school is now issuing on-chain credentials.' });
    setIsSmsupActivateOpen(false);
  }

  if (!school) {
      return <div>Loading school data...</div>;
  }

  return (
      <>
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="smsup">SMSUP+</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
              <CardDescription>
                Update your school's public information and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school-name">School Name</Label>
                <Input id="school-name" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="logo-url">School Logo URL</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-lg border">
                    <AvatarImage src={logoUrl || ''} alt={schoolName} />
                    <AvatarFallback>{schoolName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Input id="logo-url" placeholder="https://example.com/logo.png" value={logoUrl || ''} onChange={e => setLogoUrl(e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="cover-url">Cover Photo URL</Label>
                 <div className="aspect-video relative rounded-lg border bg-muted w-full max-w-sm overflow-hidden">
                    {coverImageUrl && <Image src={coverImageUrl} alt="Cover preview" fill className="object-cover" />}
                 </div>
                <Input id="cover-url" placeholder="https://example.com/cover.png" value={coverImageUrl || ''} onChange={e => setCoverImageUrl(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school-address">Address</Label>
                <Input
                  id="school-address"
                  defaultValue="123 Education Way, Lagos, Nigeria"
                />
              </div>
               <Button onClick={handleGeneralSaveChanges}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="academic" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Academic Settings</CardTitle>
                    <CardDescription>Manage current session, term, and resumption dates for reports.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Current Session</Label>
                            <Input value={academicSettings.session} onChange={e => setAcademicSettings(s => ({...s, session: e.target.value}))} placeholder="e.g., 2024/2025" />
                        </div>
                         <div className="space-y-2">
                            <Label>Current Term</Label>
                             <Select value={academicSettings.term} onValueChange={(value: string) => setAcademicSettings(s => ({...s, term: value}))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="First Term">First Term</SelectItem>
                                    <SelectItem value="Second Term">Second Term</SelectItem>
                                    <SelectItem value="Third Term">Third Term</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2 max-w-xs">
                        <Label>Next Resumption Date</Label>
                         <ResponsiveCalendar
                            selected={academicSettings.nextResumption}
                            onSelect={(date) => setAcademicSettings(s => ({...s, nextResumption: date}))}
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !academicSettings.nextResumption && "text-muted-foreground")}
                         >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {academicSettings.nextResumption ? format(academicSettings.nextResumption, 'PPP') : <span>Pick a date</span>}
                        </ResponsiveCalendar>
                    </div>
                    <Button onClick={handleAcademicSaveChanges}>Save Academic Settings</Button>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
             <DepartmentManager />
            <FeaturesSectionManager />
            <TestimonialsSectionManager />
            <FaqSectionManager />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-xs text-muted-foreground">
                    Select the theme for the dashboard.
                  </p>
                </div>
                <Select
                  value={theme}
                  onValueChange={(value) => setTheme(value)}
                >
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
        
        <TabsContent value="smsup">
           {school.system === 'SMSUP+' ? (
               <Card>
                    <CardHeader>
                        <CardTitle>SMSUP+ Status</CardTitle>
                        <CardDescription>Your school is issuing on-chain verifiable credentials.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300">
                             <div className="flex items-center gap-3">
                                 <ShieldCheck className="h-6 w-6"/>
                                 <p className="font-semibold">SMSUP+ is active on your account.</p>
                             </div>
                        </div>
                        <div className="p-4 border rounded-lg space-y-2">
                             <Label>Connected Wallet</Label>
                             <p className="font-mono text-sm text-muted-foreground bg-muted p-2 rounded-md truncate">{mockWallet.address}</p>
                        </div>
                         <div className="p-4 border rounded-lg space-y-2">
                             <Label>Verification Fee</Label>
                             <p className="text-xl font-bold">₦{school.verificationFee?.toLocaleString() || '500'}</p>
                             <p className="text-xs text-muted-foreground">This is the amount you charge third parties to verify a credential.</p>
                        </div>
                        <Button variant="destructive" onClick={() => setIsDeactivateConfirmOpen(true)}>
                            <ShieldOff className="mr-2 h-4 w-4"/> Deactivate SMSUP+
                        </Button>
                    </CardContent>
               </Card>
           ) : (
             <Card className="bg-primary text-primary-foreground border-primary/50">
                <CardHeader>
                    <CardTitle>Activate SMSUP+ Verifiable Credentials</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Upgrade your school's trust and security by issuing tamper-proof, on-chain academic records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm mb-6">
                        <li className="flex items-center gap-2"><Zap className="h-4 w-4"/> Enhance school reputation</li>
                        <li className="flex items-center gap-2"><Wallet className="h-4 w-4"/> Create new revenue from verifications</li>
                        <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Eliminate credential fraud</li>
                    </ul>
                    <Button variant="secondary" size="lg" onClick={handleActivateSmsup}>Activate SMSUP+</Button>
                </CardContent>
            </Card>
           )}
        </TabsContent>

         <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan & Billing</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold">
                                Ugbekun {school.plan} Plan
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Your current subscription plan.
                            </p>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="destructive" size="sm" onClick={() => setIsCancelConfirmOpen(true)} disabled={plan === 'Starter'}>
                                Cancel
                            </Button>
                           <Button variant="outline" size="sm" onClick={handleUpgradeClick} disabled={plan === 'Enterprise'}>
                               <Star className="mr-2 h-4 w-4" /> Upgrade
                            </Button>
                        </div>
                    </div>
                    <Separator className="my-4"/>
                    <p className="text-sm text-muted-foreground">Next payment of ₦{school.revenue.toLocaleString()} due on October 1, 2024.</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    <PaymentGatewayDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handleUpgradePaymentSuccess}
        amount={plan === 'Starter' ? planPrices['Growth'] : planPrices['Enterprise']}
        description={`Upgrade to ${plan === 'Starter' ? 'Growth' : 'Enterprise'} Plan`}
      />
      <ConnectWalletDialog 
        isOpen={isWalletConnectOpen}
        onClose={() => setIsWalletConnectOpen(false)}
        onConnect={handleWalletConnected}
      />
      <SmsupActivationDialog
        isOpen={isSmsupActivateOpen}
        onClose={() => setIsSmsupActivateOpen(false)}
        onActivate={handleSmsupActivation}
      />
      <ConfirmationDialog
        isOpen={isDeactivateConfirmOpen}
        onClose={() => setIsDeactivateConfirmOpen(false)}
        onConfirm={handleDeactivateSmsup}
        title="Deactivate SMSUP+?"
        description="This will disable on-chain credentialing for your school. You can reactivate it at any time."
        confirmText="Yes, Deactivate"
      />
       <ConfirmationDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription?"
        description="Your plan will be downgraded to the Starter plan at the end of your current billing cycle. Are you sure you want to continue?"
        confirmText="Yes, Cancel"
      />
    </>
  );
}

export function SettingsPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsClientContent />
    </Suspense>
  )
}
