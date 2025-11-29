
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FeaturesSectionManager } from "@/components/super-admin-dashboard/content/features-section-manager";
import { TestimonialsSectionManager } from "@/components/super-admin-dashboard/content/testimonials-section-manager";
import { FaqSectionManager } from "@/components/super-admin-dashboard/content/faq-section-manager";

export default function CmsContentPage() {
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Frontend Content</CardTitle>
                </CardHeader>
            </Card>

            <FeaturesSectionManager />
            <TestimonialsSectionManager />
            <FaqSectionManager />
        </div>
    )
}

    