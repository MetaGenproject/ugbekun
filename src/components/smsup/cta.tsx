
'use client';
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function Cta() {
    const { isLoggedIn, userRole, isLoading } = useAuth();
    const dashboardHref = !isLoading && userRole ? `/${userRole}/dashboard` : "/login";


    return (
        <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground ring-1 ring-border text-center p-8 md:p-12">
                    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl"></div>
                     <h3 className="display text-2xl sm:text-3xl font-semibold tracking-tight">Ready to Secure Your School's Future?</h3>
                    <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Enable SMSUP+ to offer parents the peace of mind that comes with verifiable, on-chain academic credentials.</p>
                     <div className="mt-6">
                        {isLoggedIn ? (
                             <Button asChild size="lg" variant="secondary">
                                <Link href={dashboardHref}>
                                    <LayoutDashboard className="h-4 w-4 mr-2" /> Return to Dashboard
                                </Link>
                            </Button>
                        ) : (
                             <Button asChild size="lg" variant="secondary">
                                <Link href="/onboarding">
                                    Get Started with SMSUP+
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                        )}
                     </div>
                </div>
            </div>
        </section>
    );
}
