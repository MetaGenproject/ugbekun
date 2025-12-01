
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import { PreloaderLink } from '../ui/preloader-link';
import { Badge } from '../ui/badge';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/schools", label: "Schools" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, userRole, isLoading } = useAuth();
  const dashboardHref = !isLoading && userRole ? `/${userRole}/dashboard` : '/login';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      )}>
      <div className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300",
          isScrolled ? "max-w-6xl pt-0" : "pt-6"
        )}>
        <div className={cn(
          "flex items-center justify-between transition-all duration-300 h-16",
           isScrolled ? 'bg-background/80 backdrop-blur-lg border-x border-b border-border shadow-lg px-4 rounded-b-2xl' : 'bg-transparent border-transparent'
          )}>
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 text-foreground" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <PreloaderLink key={link.href} href={link.href} className="text-foreground/80 hover:text-foreground text-sm font-medium">
                {link.label}
              </PreloaderLink>
            ))}
             <PreloaderLink href="/smsup">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 ring-1 ring-inset ring-primary/20 gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>SMSUP+</span>
                    <span className="animate-pulse">New</span>
                </Badge>
            </PreloaderLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
             {isLoading ? (
                 <>
                    <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
                    <div className="h-9 w-28 rounded-md bg-muted animate-pulse" />
                 </>
             ) : isLoggedIn ? (
                <Button asChild>
                    <PreloaderLink href={dashboardHref}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        <span>Go to Dashboard</span>
                    </PreloaderLink>
                </Button>
            ) : (
                <>
                    <Button variant="ghost" asChild>
<<<<<<< HEAD
                        <PreloaderLink href="/login">Sign in</PreloaderLink>
=======
                        <PreloaderLink href="/login">Log in</PreloaderLink>
>>>>>>> origin/new-feature
                    </Button>
                    <Button asChild>
                    <PreloaderLink href="/onboarding">
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4" />
                    </PreloaderLink>
                    </Button>
                </>
            )}
          </div>

          <button
            aria-label="Open menu"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary shadow-sm ring-1 ring-border"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="mt-2 rounded-2xl bg-card p-4 shadow-lg ring-1 ring-border">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <PreloaderLink key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-card-foreground/80 hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                    {link.label}
                  </PreloaderLink>
                ))}
                 <PreloaderLink href="/smsup" className="rounded-lg px-3 py-2 text-sm font-medium text-card-foreground/80 hover:bg-muted" onClick={() => setIsMenuOpen(false)}>
                    SMSUP+
                </PreloaderLink>
                <div className="flex items-center justify-between gap-3 pt-2">
                    {isLoggedIn ? (
                         <Button asChild className="w-full">
                            <PreloaderLink href={dashboardHref} onClick={() => setIsMenuOpen(false)}>
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                <span>Go to Dashboard</span>
                            </PreloaderLink>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <PreloaderLink href="/login" onClick={() => setIsMenuOpen(false)}>Sign in</PreloaderLink>
                            </Button>
                            <Button asChild>
                                <PreloaderLink href="/onboarding" onClick={() => setIsMenuOpen(false)}>
                                    <span>Get Started</span>
                                    <ArrowRight className="h-4 w-4" />
                                </PreloaderLink>
                            </Button>
                        </>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
