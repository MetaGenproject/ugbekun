
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image';
import { superAdminNavItems } from '@/lib/nav-data';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../logo';
import { LogoIcon } from '../logo-icon';
import { PreloaderLink } from '../ui/preloader-link';

export function SuperAdminSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="hidden xl:flex xl:w-72 xl:flex-col xl:shrink-0">
        <aside id="sidebar" className="bg-ugbekun-blue-dark text-ugbekun-white flex flex-col h-full overflow-hidden">
            <div className="flex flex-col items-center gap-4 px-4 py-6 h-auto shrink-0">
              <div className="w-full rounded-xl bg-ugbekun-blue-light/10 p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-ugbekun-white grid place-items-center text-ugbekun-blue-dark shadow-sm shrink-0">
                      <LogoIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold tracking-tight text-white truncate">Ugbekun Platform</div>
                    <div className="text-xs text-ugbekun-blue-light/70">Super Admin</div>
                  </div>
              </div>
            </div>
            <nav className="px-4 py-4 space-y-1 text-sm flex-1 overflow-y-auto no-scrollbar">
                {superAdminNavItems.map((item, index) => {
                if (item.isHeader) {
                    return (
                    <div key={index} className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-ugbekun-blue-light/50 tracking-wider">
                        {item.label}
                    </div>
                    );
                }

                const isActive = item.href === '/super-admin/dashboard' 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href || '#') && item.href !== '/super-admin/dashboard';
                
                return (
                    <PreloaderLink
                    key={item.href}
                    href={item.href || '#'}
                    className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-ugbekun-white transition-colors",
                        isActive
                        ? "bg-background text-foreground font-medium rounded-r-none -mr-4 pr-8 rounded-l-full dark:bg-gradient-to-r dark:from-ugbekun-blue-light/20 dark:to-transparent dark:border-r dark:border-ugbekun-blue-light/20"
                        : "hover:bg-gradient-to-r from-ugbekun-blue-light/10 to-transparent"
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
                    <span className={cn(isActive && "font-semibold")}>{item.label}</span>
                    </PreloaderLink>
                );
                })}
            </nav>
            <div className="mt-auto px-4 py-6">
                <div className="rounded-xl p-4 bg-ugbekun-blue-light/20 border border-ugbekun-blue-light/30 text-ugbekun-white shadow-lg">
                  <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-ugbekun-white grid place-items-center text-ugbekun-blue-dark">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Platform Security</div>
                        <div className="text-xs opacity-90">All data encrypted</div>
                      </div>
                  </div>
                </div>
            </div>
        </aside>
    </div>
  );
}

    