
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { createContext, useState, useEffect, type ReactNode, useCallback, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { preloaderContent, type PreloaderItem, type ProTip } from '@/lib/preloader-data';

const PRELOADER_EXIT_DELAY = 2000; // Stay on screen for 2 seconds *after* page load

interface PreloaderContextType {
  isPreloading: boolean;
  content: PreloaderItem | null;
  showPreloader: (href?: string) => void;
  isPreloaderEnabled: boolean;
  setIsPreloaderEnabled: (enabled: boolean) => void;
}

export const PreloaderContext = createContext<PreloaderContextType>({
  isPreloading: false,
  content: null,
  showPreloader: () => {},
  isPreloaderEnabled: true,
  setIsPreloaderEnabled: () => {},
});

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isPreloading, setIsPreloading] = useState(false);
  const [content, setContent] = useState<PreloaderItem | null>(null);
  const [isPreloaderEnabled, setIsPreloaderEnabledState] = useState(true);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs once on mount to check the user's saved setting.
    const storedSetting = localStorage.getItem('ugbekun-preloader-enabled');
    if (storedSetting === null) {
      setIsPreloaderEnabledState(true);
      localStorage.setItem('ugbekun-preloader-enabled', JSON.stringify(true));
    } else {
      setIsPreloaderEnabledState(JSON.parse(storedSetting));
    }
  }, []);
  
  useEffect(() => {
    // The core logic for exiting the preloader.
    // This now listens for a custom event dispatched from the root layout.
    const handlePageLoaded = () => {
      if (isPreloading) {
        // Page is loaded, now wait for the exit delay.
        const exitTimer = setTimeout(() => {
          setIsPreloading(false);
          setNavigationPath(null);
        }, PRELOADER_EXIT_DELAY);

        return () => clearTimeout(exitTimer);
      }
    };
    
    window.addEventListener('page-loaded', handlePageLoaded);
    return () => {
      window.removeEventListener('page-loaded', handlePageLoaded);
    };
  }, [isPreloading]);

  const setIsPreloaderEnabled = (enabled: boolean) => {
    localStorage.setItem('ugbekun-preloader-enabled', JSON.stringify(enabled));
    setIsPreloaderEnabledState(enabled);
  }

  const selectRandomContent = (href?: string) => {
    // Logic to select content remains the same...
    if (href && Math.random() < 0.3) {
      const relevantTips = preloaderContent.proTips.filter(tip => href.startsWith(tip.path));
      if (relevantTips.length > 0) {
        setContent(relevantTips[Math.floor(Math.random() * relevantTips.length)]);
        return;
      }
    }
    
    const categories = Object.keys(preloaderContent).filter(k => k !== 'proTips') as (keyof Omit<typeof preloaderContent, 'proTips'>)[];
    const randomCategoryKey = categories[Math.floor(Math.random() * categories.length)];
    const randomCategory = preloaderContent[randomCategoryKey];
    const randomItem = randomCategory[Math.floor(Math.random() * randomCategory.length)];
    setContent(randomItem);
  };
  
  const showPreloader = useCallback((href?: string) => {
    if (!isPreloaderEnabled || !href || href === pathname) {
      if (href && href !== pathname) {
        router.push(href);
      }
      return;
    }
    selectRandomContent(href);
    setIsPreloading(true);
    setNavigationPath(href); // Set path to trigger navigation
  }, [isPreloaderEnabled, router, pathname]);
  
  // Navigate when the path is set by showPreloader
  useEffect(() => {
    if (navigationPath) {
      router.push(navigationPath);
    }
  }, [navigationPath, router]);

  return (
    <PreloaderContext.Provider value={{ isPreloading, content, showPreloader, isPreloaderEnabled, setIsPreloaderEnabled }}>
      {children}
    </PreloaderContext.Provider>
  );
}

// A new component to be placed in the root layout to signal page load
function PageLoadTrigger() {
  const pathname = usePathname();
  useEffect(() => {
    // Dispatch a custom event to signal that the page has finished rendering on the client
    window.dispatchEvent(new Event('page-loaded'));
  }, [pathname]); // Re-dispatch on every path change
  return null;
}

// Add the PageLoadTrigger to the children in the main provider if needed,
// but for this fix, it's better to add it directly in the root layout.
// The context itself doesn't need to export it.
