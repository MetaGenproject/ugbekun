
"use client";

import { SchoolsOverview } from "@/components/super-admin-dashboard/schools-overview";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CmsSchoolsPage() {
    return (
       <div className="space-y-6">
         <Card>
            <CardHeader>
                <CardTitle>Manage Schools</CardTitle>
            </CardHeader>
        </Card>
        <SchoolsOverview />
       </div>
    )
}

    