

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/nav-data';
import { ScrollArea } from '../ui/scroll-area';
import { PreloaderLink } from '../ui/preloader-link';
import { useSidebar } from '../ui/sidebar';

type MobileDockProps = {
  navItems: NavItem[];
};

export function MobileDock({ navItems }: MobileDockProps) {
  const pathname = usePathname();
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
  const { setOpenMobile } = useSidebar();

  const dockItems = navItems.filter(item => !item.isHeader && item.isDockItem).slice(0, 4);
  const flyoutItems = navItems.filter(item => !item.isHeader && !item.isDockItem);

  const handleLinkClick = () => {
    setIsFlyoutOpen(false);
    setOpenMobile(false);
  }

  return (
    <>
      <div className="xl:hidden fixed bottom-0 inset-x-0 z-50 flex justify-center pb-3 pointer-events-none">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="pointer-events-auto"
        >
          <div className="h-14 w-auto rounded-full bg-foreground text-background/80 border border-border/20 shadow-lg backdrop-blur-md">
            <nav className="flex items-center justify-center h-full px-3 gap-1">
              {dockItems.map(item => {
                const isActive = item.href && pathname.startsWith(item.href);
                return (
                  <PreloaderLink key={item.href} href={item.href || '#'} className={cn(
                      "relative h-full flex items-center justify-center text-center transition-colors px-2",
                      isActive ? "text-foreground" : "hover:text-background w-12"
                    )}>
                    {isActive && (
                        <motion.div 
                            layoutId="active-pill" 
                            className="absolute inset-x-0 h-10 my-auto bg-background rounded-full"
                            transition={{ type: "spring", duration: 0.6 }}
                        />
                    )}
                     <div className={cn("relative z-10 flex items-center gap-2", isActive && "px-3")}>
                         {item.icon && (
                          <div className="h-5 w-5">
                            {item.icon}
                          </div>
                        )}
                        {isActive && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                       </div>
                  </PreloaderLink>
                );
              })}
               <button
                onClick={() => setIsFlyoutOpen(true)}
                className="relative flex items-center justify-center h-full w-12 text-center hover:text-background transition-colors"
                >
                    <div className="h-6 w-6">
                        <MoreVertical />
                    </div>
                </button>
            </nav>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFlyoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFlyoutOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="absolute bottom-0 left-0 right-0 h-[70vh] bg-background rounded-t-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <header className="p-4 flex items-center justify-between border-b">
                <h3 className="text-lg font-semibold ml-2">All Features</h3>
                <button onClick={() => setIsFlyoutOpen(false)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-muted">
                    <X className="h-5 w-5"/>
                </button>
              </header>
              <ScrollArea className="h-[calc(70vh-70px)]">
                <div className="p-4 space-y-3">
                  {flyoutItems.map(item => (
                    <PreloaderLink key={item.href} href={item.href || '#'} onClick={handleLinkClick} className="block">
                      <div className="flex items-start gap-4 rounded-xl border p-4 hover:bg-muted transition-colors">
                          <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center text-secondary-foreground shrink-0">
                              {item.icon && (
                                <div className="h-5 w-5">
                                    {item.icon}
                                </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                          </div>
                      </div>
                    </PreloaderLink>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
