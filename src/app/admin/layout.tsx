/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";
import AppSidebar from "@/components/layout/sidebar";
import { AppTopbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/layout/page-header";
import { FadingLine } from "@/components/ui/fading-line";
import { MobileDock } from "@/components/layout/mobile-dock";
import { adminNavItems } from "@/lib/nav-data";
import { PlanProvider } from "@/context/plan-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { initializeDemoData } from "@/lib/data-initializer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeDemoData();
  }, []);

  const userDetails = {
    name: "Nabila A.",
    role: "Admin" as const,
    avatar: "https://placehold.co/40x40/95a8ff/122B5E?text=A",
    fallback: "NA",
  };
  const searchPlaceholders = ["Search students...", "Search teachers...", "Find class JSS 2A", "Generate finance report"];

  return (
    <SidebarProvider>
      <PlanProvider>
          <div className="h-screen w-full flex flex-row overflow-hidden">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
              <AppTopbar 
                userRole="admin"
                navItems={adminNavItems}
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
            <MobileDock navItems={adminNavItems} />
          </div>
      </PlanProvider>
    </SidebarProvider>
  );
}
