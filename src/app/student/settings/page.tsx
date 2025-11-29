
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
import { Textarea } from "@/components/ui/textarea";

export default function StudentSettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();

    // State for profile information
    const [fullName, setFullName] = useState("Alex Morgan");
    const [bio, setBio] = useState("Aspiring software engineer and member of the Debate Club.");

    // State for notifications
    const [assignmentNotifications, setAssignmentNotifications] = useState(true);
    const [gradeNotifications, setGradeNotifications] = useState(true);

    const handleProfileUpdate = () => {
        // In a real app, you'd make an API call here.
        console.log("Profile updated:", { fullName, bio });
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
                  <AvatarImage src="https://i.pravatar.cc/80?img=1" alt="Alex Morgan" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => toast({ title: "Feature not available", description: "Profile picture uploads are coming soon."})}>Change Photo</Button>
              </div>
              <div className="space-y-1">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us a little about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
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
                    <Input id="email" defaultValue="student@ugbekun.com" disabled />
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
                  <Label htmlFor="assignments-switch">New Assignments</Label>
                  <p className="text-xs text-muted-foreground">
                    When a teacher posts a new assignment.
                  </p>
                </div>
                <Switch id="assignments-switch" checked={assignmentNotifications} onCheckedChange={setAssignmentNotifications} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="grades-switch">Grades Published</Label>
                  <p className="text-xs text-muted-foreground">
                    When a new grade is available for you.
                  </p>
                </div>
                <Switch id="grades-switch" checked={gradeNotifications} onCheckedChange={setGradeNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    