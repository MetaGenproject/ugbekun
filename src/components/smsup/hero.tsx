
import { Lock, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { HeroAnimation } from './hero-animation';
import { Button } from '../ui/button';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative pt-6 pb-12 md:pt-10 md:pb-20 overflow-hidden">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 ring-1 ring-inset ring-primary/20">
                    <Lock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Ugbekun SMSUP+</span>
                </div>
                <h1 className="display text-4xl sm:text-6xl tracking-tight font-semibold text-foreground mt-4">
                    The Future of Academic Credentials, On-Chain
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Introducing a new standard for trust and security in education. SMSUP+ anchors your school's most critical data on the blockchain, creating verifiable, parent-controlled digital identities for every student.
                </p>
                <div className="mt-8 flex justify-center">
                    <Button asChild size="lg">
                        <Link href="/credentials">
                           <ShieldCheck className="mr-2 h-4 w-4" /> Verify a Credential
                        </Link>
                    </Button>
                </div>
            </div>
             <div className="relative mt-12 px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-full bg-primary/10 rounded-[28px] blur-3xl -z-10" />
                <div className="max-w-6xl mx-auto rounded-2xl border bg-background/50 p-2 shadow-2xl backdrop-blur-md">
                    <div className="rounded-xl border bg-background/80 overflow-hidden">
                        <div className="h-9 flex items-center gap-1.5 px-3 border-b">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="h-[500px]">
                            <HeroAnimation />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
