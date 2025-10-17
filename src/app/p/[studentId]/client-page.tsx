
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Student } from "@/lib/admin-data";
import type { School } from "@/lib/super-admin-data";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CoverPattern } from "@/components/smsup/cover-pattern";
import type { VerifiableCredential } from "@/lib/credentials-data";
import { useEffect } from "react";

interface ClientPageProps {
    student: Student | undefined;
    school: School | undefined;
    publicCredentials: VerifiableCredential[];
}

export default function StudentCredentialClientPage({ student, school, publicCredentials }: ClientPageProps) {
    const router = useRouter();

    useEffect(() => {
        if (!student || !school) {
            router.replace('/credentials');
        }
    }, [student, school, router]);

    if (!student || !school) {
        return null;
    }

    return (
        <div className="bg-background min-h-screen">
             <header className="relative h-48 md:h-56">
                {school.coverImageUrl ? 
                    <Image src={school.coverImageUrl} alt={`${school.name} campus`} fill className="object-cover" />
                    : <CoverPattern />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
                 <div className="absolute top-6 left-6">
                    <Button asChild variant="secondary" className="bg-background/80 hover:bg-background text-foreground">
                        <Link href="/credentials"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Verification</Link>
                    </Button>
                </div>
            </header>

            <main className="relative -mt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                 <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
                        <div className="shrink-0 -mt-20">
                            <div className="h-32 w-32 rounded-full bg-card p-1.5">
                                 <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">{student.name}</h1>
                            <p className="mt-1 text-lg text-muted-foreground">{school.name}</p>
                            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-green-600">
                                <ShieldCheck className="h-5 w-5"/> Verified Student • ID: {student.id}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                         <h2 className="text-xl font-semibold tracking-tight">Public Credentials</h2>
                        <p className="text-muted-foreground mt-1">This student has made the following academic records publicly verifiable on the blockchain.</p>
                         <div className="mt-6 space-y-4">
                            {publicCredentials.length > 0 ? publicCredentials.map(vc => (
                                <div key={vc.id} className="p-4 rounded-xl border bg-background flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-500/10 grid place-items-center shrink-0">
                                        <FileCheck2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{vc.title}</p>
                                        <p className="text-sm text-muted-foreground">Issued by {vc.issuer} on {vc.date}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-xl">
                                    <p>This student has not made any credentials public.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
