
"use client";

import { useState, Suspense } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function ParentSettingsContent() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState(tab || "profile");
    const [fullName, setFullName] = useState("Alex Johnson");

    const [assignmentNotifications, setAssignmentNotifications] = useState(true);
    const [gradeNotifications, setGradeNotifications] = useState(true);
    const [eventNotifications, setEventNotifications] = useState(true);

    const handleProfileUpdate = () => {
        toast({
            variant: "success",
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>
                Manage your public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop" alt="Alex Johnson" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => toast({ title: "Feature not available", description: "Profile picture uploads are coming soon."})}>Change Photo</Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <Button onClick={handleProfileUpdate}>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account and theme preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="guardian@ugbekun.com" disabled />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label>Theme</Label>
                        <p className="text-xs text-muted-foreground">Select a theme for your dashboard.</p>
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

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                How do you want to be notified about your child's activities?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="assignments-switch">New Assignments</Label>
                  <p className="text-xs text-muted-foreground">
                    When a teacher posts a new assignment for your child.
                  </p>
                </div>
                <Switch id="assignments-switch" checked={assignmentNotifications} onCheckedChange={setAssignmentNotifications} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="grades-switch">Grades Published</Label>
                  <p className="text-xs text-muted-foreground">
                    When a new grade is available for your child.
                  </p>
                </div>
                <Switch id="grades-switch" checked={gradeNotifications} onCheckedChange={setGradeNotifications} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="events-switch">School Events</Label>
                  <p className="text-xs text-muted-foreground">
                    Reminders for upcoming school events like PTA meetings.
                  </p>
                </div>
                <Switch id="events-switch" checked={eventNotifications} onCheckedChange={setEventNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function ParentSettingsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <ParentSettingsContent />
        </Suspense>
    )
}
