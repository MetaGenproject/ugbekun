
'use client';

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { PreloaderProvider } from '@/context/preloader-context';
import { Preloader } from '@/components/preloader';
import { Toaster } from '@/components/ui/toaster';
<<<<<<< HEAD
=======
import { Provider } from 'react-redux';
import { store } from './store';
>>>>>>> origin/new-feature

function PageLoadTrigger() {
  const pathname = usePathname();
  useEffect(() => {
    // Dispatch a custom event to signal that the page has finished rendering on the client
    window.dispatchEvent(new Event('page-loaded'));
  }, [pathname]); // Re-dispatch on every path change
  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
<<<<<<< HEAD
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <PreloaderProvider>
                <Preloader />
                <Suspense>
                    <PageLoadTrigger />
                </Suspense>
                {children}
                <Toaster />
            </PreloaderProvider>
        </ThemeProvider>
=======
        <Provider store={store}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <PreloaderProvider>
                    <Preloader />
                    <Suspense>
                        <PageLoadTrigger />
                    </Suspense>
                    {children}
                    <Toaster />
                </PreloaderProvider>
            </ThemeProvider>
        </Provider>
>>>>>>> origin/new-feature
    )
}

