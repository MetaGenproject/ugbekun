
"use client";

import SubjectsPage from "@/app/admin/subjects/page";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CmsSubjectsPage() {
    // This page re-uses the main subject management component from the admin dashboard
    // to manage the global list of subjects.
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Global Subjects</CardTitle>
                </CardHeader>
            </Card>
            <SubjectsPage />
        </div>
    );
}

    