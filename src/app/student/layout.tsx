/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { StudentSidebar } from "@/components/layout/student-sidebar";
import { AppTopbar } from "@/components/layout/topbar";
import { FadingLine } from "@/components/ui/fading-line";
import { MobileDock } from "@/components/layout/mobile-dock";
import { studentNavItems } from "@/lib/nav-data";
import { PageHeader } from "@/components/layout/page-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { initializeDemoData } from "@/lib/data-initializer";

export default function StudentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    useEffect(() => {
        initializeDemoData();
    }, []);
    
    const userDetails = {
        name: "Aisha Bello",
        role: "Student",
        avatar: "https://i.pravatar.cc/40?img=1",
        fallback: "AB",
    };
    const searchPlaceholders = ["Search for courses...", "Find 'Problem Set 4'", "Check my grades", "View calendar"];

  return (
    <SidebarProvider>
        <div className="flex h-svh w-full overflow-hidden">
          <StudentSidebar />
          <div className="flex flex-1 flex-col min-w-0 bg-background text-foreground">
            <AppTopbar
                userRole="student"
                navItems={studentNavItems}
                userDetails={userDetails}
                searchPlaceholders={searchPlaceholders}
            />
            <FadingLine />
            <div className="flex-1 overflow-y-auto pb-24 xl:pb-0">
              <div className="hidden xl:block">
                <PageHeader />
              </div>
              <div className="px-4 lg:px-6 xl:px-8 py-6">
                {children}
              </div>
            </div>
          </div>
          <MobileDock navItems={studentNavItems} />
        </div>
    </SidebarProvider>
  );
}
