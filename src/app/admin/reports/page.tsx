
"use client";

import { ReportGeneratorForm } from "./report-generator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePlan } from "@/context/plan-context";
import { Lock, Eye } from "lucide-react";
import { recentStudents } from "@/lib/admin-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Student } from "@/lib/admin-data";

export default function ReportGeneratorPage() {
  const { hasFeature, openUpgradeDialog } = usePlan();
  const [students] = useLocalStorage<Student[]>("students", recentStudents);
  const demoStudentId = students.length > 0 ? students[0].id : 'none';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row justify-between items-center">
            <div>
              <CardTitle>AI-Powered Report Generation</CardTitle>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="outline" asChild>
                    <Link href={`/admin/reports/${demoStudentId}`} target="_blank"><Eye className="mr-2 h-4 w-4"/> Preview Report Card</Link>
                </Button>
                <Button variant="secondary" asChild>
                    <Link href="/admin/reports/designer">Report Card Designer</Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent className="relative">
            {!hasFeature("AI_REPORTS") && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8">
                    <div className="h-14 w-14 rounded-full bg-primary/10 grid place-items-center mb-4">
                        <Lock className="h-7 w-7 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-lg">Upgrade to Generate AI Reports</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">This feature is part of our Growth plan. Unlock AI-powered report summaries and insights by upgrading your subscription.</p>
                    <Button onClick={() => openUpgradeDialog('AI_REPORTS')} className="mt-4">Upgrade to Growth</Button>
                </div>
            )}
            <ReportGeneratorForm />
        </CardContent>
      </Card>
    </div>
  );
}

    