
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

export default function TeacherSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();

    // State for profile information
    const [fullName, setFullName] = useState("Mr. Adebayo");

    // State for notifications
    const [assignmentNotifications, setAssignmentNotifications] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);

    const handleProfileUpdate = () => {
        toast({
            variant: "success",
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop" alt="Mr. Adebayo" />
                  <AvatarFallback>MA</AvatarFallback>
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
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="adebayo@ugbekun.com" disabled />
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="assignments-switch">Student Submissions</Label>
                  <p className="text-xs text-muted-foreground">
                    When a student submits an assignment for grading.
                  </p>
                </div>
                <Switch id="assignments-switch" checked={assignmentNotifications} onCheckedChange={setAssignmentNotifications} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="messages-switch">New Messages</Label>
                  <p className="text-xs text-muted-foreground">
                    When you receive a new message from a parent or student.
                  </p>
                </div>
                <Switch id="messages-switch" checked={messageNotifications} onCheckedChange={setMessageNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    