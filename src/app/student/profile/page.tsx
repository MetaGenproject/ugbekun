
"use client";

import { GpaChart } from "@/components/student-dashboard/gpa-chart";
import { RecentGrades } from "@/components/student-dashboard/recent-grades";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/dashboard/performance-chart";

export default function StudentProfilePage() {
    // In a real app, you would fetch the student's data here based on their authenticated session.
    // For this demo, we'll just show the components.

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Academic Profile</CardTitle>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Trend</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <PerformanceChart />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>GPA by Term</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <GpaChart />
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <RecentGrades />
                </div>
            </div>
        </div>
    )
}

    