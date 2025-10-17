
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function SuperAdminAnnouncementsPage() {
    const { toast } = useToast();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Announcements</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="announcement">Message</Label>
                        <Textarea id="announcement" placeholder="Type your announcement here..." rows={6} />
                    </div>
                    <Button onClick={() => toast({ title: "Announcement Sent", description: "Your message has been broadcast to all schools." })}>
                        <Send className="mr-2 h-4 w-4" /> Send Announcement
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

    