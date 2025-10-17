
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function SuperAdminSupportPage() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-24 text-muted-foreground">
                    <LifeBuoy className="h-12 w-12 mx-auto" />
                    <p className="mt-4">Support ticket management system will be here.</p>
                </div>
            </CardContent>
        </Card>
    )
}

    