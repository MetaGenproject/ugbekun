/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { TeacherSidebar } from "@/components/layout/teacher-sidebar";
import { AppTopbar } from "@/components/layout/topbar";
import { FadingLine } from "@/components/ui/fading-line";
import { MobileDock } from "@/components/layout/mobile-dock";
import { teacherNavItems } from "@/lib/nav-data";
import { PageHeader } from "@/components/layout/page-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { initializeDemoData } from "@/lib/data-initializer";

export default function TeacherAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeDemoData();
  }, []);

  const userDetails = {
    name: "Mr. Adebayo",
    role: "Teacher" as const,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    fallback: "MA",
  };
  const searchPlaceholders = ["Search students...", "Find JSS 1 class", "Create lesson plan", "Grade assignments"];

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-row overflow-hidden">
        <TeacherSidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
          <AppTopbar
            userRole="teacher"
            navItems={teacherNavItems}
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
        </main>
        <MobileDock navItems={teacherNavItems} />
      </div>
    </SidebarProvider>
  );
}
