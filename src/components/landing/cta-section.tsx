/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PreloaderLink } from "@/components/ui/preloader-link";
import { useAuth } from "@/hooks/use-auth";

export function CtaSection() {
    const { isLoggedIn, userRole } = useAuth();
    const dashboardHref = userRole ? `/${userRole}/dashboard` : '/login';

    return (
        <section id="get-started" className="relative py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground ring-1 ring-border">
                    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"></div>
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="md:col-span-2 p-8 md:p-10">
                             {isLoggedIn ? (
                                <>
                                    <h3 className="display text-2xl sm:text-3xl font-semibold tracking-tight">Ready to jump back in?</h3>
                                    <p className="mt-2 text-primary-foreground/80">Continue managing your school with ease.</p>
                                    <div className="mt-6">
                                        <Button asChild size="lg" variant="secondary">
                                            <PreloaderLink href={dashboardHref}>
                                                <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
                                            </PreloaderLink>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="display text-2xl sm:text-3xl font-semibold tracking-tight">Ready to modernize your school?</h3>
                                    <p className="mt-2 text-primary-foreground/80">Start free today. No credit card required.</p>
                                     <div className="mt-6">
                                        <Button asChild size="lg" variant="secondary">
                                            <PreloaderLink href="/onboarding">
                                                <span>Create an account</span>
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </PreloaderLink>
                                        </Button>
                                    </div>
                                </>
                             )}
                        </div>
                        <div className="p-8 md:p-10 bg-primary-foreground/5 ring-1 ring-border">
                            <ul className="space-y-3 text-sm text-primary-foreground/90">
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Guided onboarding</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Import from CSV</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> 24/7 monitoring</li>
                                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Cancel anytime</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
