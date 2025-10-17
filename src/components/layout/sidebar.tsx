
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { adminNavItems, type NavItem } from '@/lib/nav-data';
import { Settings } from 'lucide-react';
import { LogoIcon } from '../logo-icon';
import { usePlan, type PlanFeatures } from '@/context/plan-context';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { PreloaderLink } from '../ui/preloader-link';
import { useSidebar } from '../ui/sidebar';

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { plan, hasFeature, openUpgradeDialog, isLoading } = usePlan();
  const { setOpenMobile } = useSidebar();

  if (isLoading || !plan) {
    return <Skeleton className="h-10 rounded-lg bg-white/10" />;
  }

  // The feature is allowed if the plan is Enterprise, OR if the plan has the specific feature flag.
  const isFeatureAllowed = plan === 'Enterprise' || (item.featureKey && hasFeature(item.featureKey));

  const isActive = item.href === '/admin/dashboard' 
    ? pathname === item.href 
    : (item.href && item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
  
  const showUpgradeBadge = !isFeatureAllowed && plan !== 'Enterprise';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFeatureAllowed) {
      e.preventDefault();
      openUpgradeDialog(item.featureKey as keyof PlanFeatures);
    } else {
        setOpenMobile(false);
    }
  }

  return (
    <PreloaderLink
      href={isFeatureAllowed ? (item.href || '#') : '#'}
      onClick={handleClick}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 text-ugbekun-white transition-colors",
        isActive && isFeatureAllowed
          ? "bg-background text-foreground font-medium -mr-4 pr-8 rounded-l-full rounded-r-none dark:bg-gradient-to-r dark:from-ugbekun-blue-light/20 dark:to-transparent dark:border-r dark:border-ugbekun-blue-light/20"
          : isFeatureAllowed
          ? "hover:bg-gradient-to-r from-ugbekun-blue-light/10 to-transparent rounded-lg"
          : "opacity-60 cursor-not-allowed"
      )}
    >
       {isActive && isFeatureAllowed && (
            <>
                <span className="absolute right-0 top-[-16px] h-4 w-4 rounded-br-xl shadow-[0_5px_0_0_hsl(var(--background))] dark:shadow-[0_5px_0_0_hsl(var(--ugbekun-blue-dark))]"></span>
                <span className="absolute right-0 bottom-[-16px] h-4 w-4 rounded-tr-xl shadow-[0_-5px_0_0_hsl(var(--background))] dark:shadow-[0_-5px_0_0_hsl(var(--ugbekun-blue-dark))]"></span>
            </>
        )}
      <div className={cn(
          "transition-colors", 
          (isActive && isFeatureAllowed) ? "text-primary" : "text-ugbekun-white",
          (!isActive && isFeatureAllowed) && "group-hover:text-ugbekun-white"
        )}>
          {item.icon && React.cloneElement(item.icon, { className: "h-5 w-5" })}
      </div>
      <span className={cn(isActive && isFeatureAllowed && 'font-semibold')}>{item.label}</span>
      {showUpgradeBadge && <Badge variant="secondary" className="ml-auto text-xs bg-amber-400/20 text-amber-300 border-amber-400/30">Upgrade</Badge>}
    </PreloaderLink>
  );
}

const NavItemsSkeleton = () => (
    <>
        {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1">
                <Skeleton className="h-5 w-20 my-4 ml-3 bg-white/10" />
                <Skeleton className="h-10 rounded-lg bg-white/10" />
                <Skeleton className="h-10 rounded-lg bg-white/10" />
                <Skeleton className="h-10 rounded-lg bg-white/10" />
            </div>
        ))}
    </>
)

export function SidebarContent() {
    const { plan, isLoading } = usePlan();
    
    const planConfig = {
        "Starter": { color: "bg-gray-400/20 text-gray-300 border-gray-400/30", text: "Starter" },
        "Growth": { color: "bg-blue-400/20 text-blue-300 border-blue-400/30", text: "Growth" },
        "Enterprise": { color: "bg-amber-400/20 text-amber-300 border-amber-400/30", text: "Enterprise" },
    }

    const currentPlanConfig = plan ? planConfig[plan] : planConfig["Starter"];

    return (
        <aside id="sidebar" className="bg-ugbekun-blue-dark text-ugbekun-white flex flex-col h-full overflow-hidden">
            <div className="flex flex-col items-center gap-4 px-4 py-6 h-auto shrink-0">
                <div className="w-full rounded-xl bg-ugbekun-blue-light/10 p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-ugbekun-white grid place-items-center text-ugbekun-blue-dark shadow-sm shrink-0">
                        <LogoIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold tracking-tight text-white truncate">Unity College</div>
                        <div className="text-xs text-ugbekun-blue-light/70 flex items-center gap-1.5">
                            Admin Portal
                            {isLoading || !plan ? (
                               <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
                            ) : (
                               <Badge variant="secondary" className={cn("px-1.5 py-0.5 text-[10px]", currentPlanConfig.color)}>{currentPlanConfig.text}</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <nav className="px-4 py-4 space-y-1 text-sm flex-1 overflow-y-auto no-scrollbar">
                {isLoading ? <NavItemsSkeleton /> : (
                    <>
                        {adminNavItems.map((item, index) => {
                            if (item.isHeader) {
                                return (
                                    <div key={index} className="px-3 pt-4 pb-1 text-xs font-semibold uppercase text-ugbekun-blue-light/50 tracking-wider">
                                        {item.label}
                                    </div>
                                );
                            }
                            return <NavLink key={item.href} item={item} />
                        })}
                    </>
                )}
            </nav>
            <div className="mt-auto px-4 py-6 shrink-0">
                <div className="rounded-xl p-4 bg-ugbekun-blue-light/20 border border-ugbekun-blue-light/30 text-ugbekun-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-ugbekun-white grid place-items-center text-ugbekun-blue-dark">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div className="text-sm">
                            <div className="font-medium">School Management</div>
                            <div className="text-xs opacity-90">Admin Controls</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default function AppSidebar() {
  return (
    <div className="hidden xl:flex xl:w-72 xl:flex-col xl:shrink-0">
        <SidebarContent />
    </div>
  );
}

    
