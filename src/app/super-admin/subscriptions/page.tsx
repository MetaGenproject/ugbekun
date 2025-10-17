
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { RevenueByPlanChart } from "@/components/super-admin-dashboard/revenue-by-plan-chart";

export default function SuperAdminSubscriptionsPage() {
    return (
         <Card>
            <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Overview of platform revenue and subscriptions by plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <RevenueByPlanChart />
                </div>
            </CardContent>
        </Card>
    )
}
