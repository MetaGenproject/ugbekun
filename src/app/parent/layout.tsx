/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { ParentSidebar } from "@/components/layout/parent-sidebar";
import { AppTopbar } from "@/components/layout/topbar";
import { FadingLine } from "@/components/ui/fading-line";
import { MobileDock } from "@/components/layout/mobile-dock";
import { parentNavItems } from "@/lib/nav-data";
import { PageHeader } from "@/components/layout/page-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { initializeDemoData } from "@/lib/data-initializer";

export default function ParentAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   useEffect(() => {
    initializeDemoData();
  }, []);

   const userDetails = {
    name: "Alex Johnson",
    role: "Parent" as const,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    fallback: "AJ",
  };
  const searchPlaceholders = ["Search for Maya's grades", "Message Ms. Carter", "Check attendance", "View transport schedule"];

  return (
    <SidebarProvider>
      <div className="h-screen w-full flex flex-row overflow-hidden">
        <ParentSidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-background text-foreground">
          <AppTopbar
            userRole="parent"
            navItems={parentNavItems}
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
        <MobileDock navItems={parentNavItems} />
      </div>
    </SidebarProvider>
  );
}
