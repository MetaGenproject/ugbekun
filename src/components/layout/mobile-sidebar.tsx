

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { Sheet, SheetContent } from "@/components/ui/sheet";
import AppSidebar, { SidebarContent as AdminSidebarContent } from "./sidebar";
import { StudentSidebar } from "./student-sidebar";
import { ParentSidebar } from "./parent-sidebar";
import { TeacherSidebar } from "./teacher-sidebar";
import { usePathname } from "next/navigation";
import { SuperAdminSidebar } from "./super-admin-sidebar";
import { useSidebar } from "../ui/sidebar";

function getSidebarForRole(role: string) {
    if (role.startsWith('/student')) return StudentSidebar;
    if (role.startsWith('/parent')) return ParentSidebar;
    if (role.startsWith('/teacher')) return TeacherSidebar;
    if (role.startsWith('/super-admin')) return SuperAdminSidebar;
    return AdminSidebarContent;
}


export function MobileSidebar() {
    const pathname = usePathname();
    const SidebarComponent = getSidebarForRole(pathname);
    const { openMobile, setOpenMobile } = useSidebar();
    
    return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetContent side="left" className="p-0 w-72 bg-ugbekun-blue-dark">
                <SidebarComponent />
            </SheetContent>
        </Sheet>
    )
}
