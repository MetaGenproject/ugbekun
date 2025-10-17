
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { studentNavItems } from '@/lib/nav-data';
import { Logo } from '../logo';
import { NotebookText } from 'lucide-react';
import { PreloaderLink } from '../ui/preloader-link';
import { useSidebar } from '../ui/sidebar';

function SidebarNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  
  return (
    <nav className="px-4 py-4 space-y-1 text-sm flex-1 overflow-y-auto no-scrollbar">
        {studentNavItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <div key={index} className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-ugbekun-blue-light/50 tracking-wider">
                {item.label}
              </div>
            );
          }

          const isActive = pathname.startsWith(item.href || '#');
          
          return (
            <PreloaderLink
              key={item.href}
              href={item.href || '#'}
              onClick={() => setOpenMobile(false)}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 text-ugbekun-white transition-colors",
                isActive
                  ? "bg-background text-foreground font-medium -mr-4 pr-8 rounded-l-full rounded-r-none dark:bg-gradient-to-r dark:from-ugbekun-blue-light/20 dark:to-transparent dark:border-r dark:border-ugbekun-blue-light/20"
                  : "hover:bg-gradient-to-r from-ugbekun-blue-light/10 to-transparent rounded-lg"
              )}
            >
              {isActive && (
                <>
                  <span className="absolute right-0 top-[-16px] h-4 w-4 rounded-br-xl shadow-[0_5px_0_0_hsl(var(--background))] dark:shadow-[0_5px_0_0_hsl(var(--ugbekun-blue-dark))]"></span>
                  <span className="absolute right-0 bottom-[-16px] h-4 w-4 rounded-tr-xl shadow-[0_-5px_0_0_hsl(var(--background))] dark:shadow-[0_-5px_0_0_hsl(var(--ugbekun-blue-dark))]"></span>
                </>
              )}
              <div className={cn(
                  "transition-colors", 
                  isActive ? "text-primary" : "text-ugbekun-white",
                  !isActive && "group-hover:text-ugbekun-white"
                )}>
                  {item.icon && React.cloneElement(item.icon, { className: "h-5 w-5" })}
              </div>
              <span className={cn(isActive && 'font-semibold')}>{item.label}</span>
            </PreloaderLink>
          );
        })}
      </nav>
  )
}

function SidebarHeader() {
    return (
        <div className="flex items-center justify-center px-4 py-6 h-auto">
             <PreloaderLink href="/student/dashboard">
                <Logo className="h-9 text-white" />
            </PreloaderLink>
        </div>
    )
}

function SidebarFooter() {
     return (
        <div className="mt-auto px-4 py-6 shrink-0">
            <div className="rounded-xl p-4 bg-ugbekun-blue-light/20 border border-ugbekun-blue-light/30 text-ugbekun-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-ugbekun-white grid place-items-center text-ugbekun-blue-dark">
                        <NotebookText className="h-5 w-5" />
                    </div>
                    <div className="text-sm">
                        <div className="font-medium">My Academic Space</div>
                        <div className="text-xs opacity-90">Your digital workspace</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function SidebarContent() {
    return (
        <div className="bg-ugbekun-blue-dark text-ugbekun-white flex flex-col h-full overflow-hidden">
            <SidebarHeader />
            <SidebarNav />
            <SidebarFooter />
        </div>
    )
}


export function StudentSidebar() {
  return (
    <div className="hidden xl:flex xl:w-64 xl:flex-col xl:shrink-0">
        <SidebarContent />
    </div>
  );
}

    