
"use client";

import { useRouter } from "next/navigation";
import { type School } from "@/lib/super-admin-data";
import { type Student } from "@/lib/admin-data";
import { type Event } from "@/lib/events-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Rss, Users, Calendar, Building2, CheckCircle, Mail, GraduationCap, Wallet, XCircle, LayoutDashboard, ShieldCheck, FileSearch } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PreloaderLink } from "@/components/ui/preloader-link";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CoverPattern } from "@/components/smsup/cover-pattern";
import { useEffect, useState } from "react";

const announcements = [
    { id: 1, content: "Mid-term break begins next Friday, October 25th. We wish all our students a restful holiday.", timestamp: "2 hours ago" },
    { id: 2, content: "Congratulations to the JSS 3 students for their outstanding performance in the regional debate competition!", timestamp: "1 day ago" },
    { id: 3, content: "The annual Inter-House Sports competition is scheduled for November 15th. Get your house colours ready!", timestamp: "3 days ago" },
];

interface SchoolProfileClientProps {
    school: School;
    allStudents: Student[];
    allEvents: Event[];
}

export default function SchoolProfileClient({ school, allStudents, allEvents }: SchoolProfileClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { isLoggedIn, userRole } = useAuth();
    
    // In a real multi-school app, you would not hardcode the ID.
    const isOwnSchool = isLoggedIn && userRole === 'admin' && school.id === 'unity-college';
    
    const handleFollow = () => {
        toast({
            variant: "success",
            title: "School Followed",
            description: `You will now receive notifications and updates from ${school.name}.`
        })
    }
    
    const handlePayFees = () => {
        if (isLoggedIn) {
            router.push('/parent/dashboard');
        } else {
             router.push('/login');
        }
        toast({
            title: "Redirecting to Payments",
            description: isLoggedIn ? "You are being taken to your payment dashboard." : "Please log in to pay fees for your child."
        });
    }

    const renderActionButtons = () => {
      if (isOwnSchool) {
        return (
          <Button size="sm" asChild>
            <PreloaderLink href="/admin/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Admin Dashboard
            </PreloaderLink>
          </Button>
        );
      }
      if (isLoggedIn && (userRole === 'admin' || userRole === 'super-admin')) {
        return null;
      }

      return (
        <>
          <Button asChild variant="outline" size="sm"><Link href="/results/check"><FileSearch className="mr-2 h-4 w-4"/> Check Result</Link></Button>
          <Button variant="outline" size="sm" asChild><PreloaderLink href="/onboarding">Apply Now</PreloaderLink></Button>
          <Button size="sm" onClick={handleFollow}><Rss className="mr-2 h-4 w-4"/> Follow School</Button>
        </>
      )
    }

    return (
        <div className="bg-background py-16">
            <header className="h-48 md:h-64 bg-secondary relative">
                {school.coverImageUrl ? 
                    <Image src={school.coverImageUrl} alt={`${school.name} campus`} fill objectFit="cover" />
                    : <CoverPattern />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            </header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 md:-mt-24">
                     <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                        <Avatar className="h-32 w-32 rounded-2xl border-4 border-background bg-card shrink-0">
                           {school.logoUrl && <AvatarImage src={school.logoUrl} alt={school.name} />}
                           <AvatarFallback className="text-4xl">{school.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{school.name}</h1>
                            <p className="text-muted-foreground mt-1">Excellence and Integrity</p>
                            {school.verified && (
                                <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm font-semibold text-green-600">
                                    <ShieldCheck className="h-5 w-5"/> Verified by SMSUP+
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
                           {renderActionButtons()}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <main className="lg:col-span-8 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Announcements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {announcements.map(item => (
                                    <div key={item.id} className="p-4 rounded-lg border bg-card flex items-start gap-4">
                                        <Avatar className="h-10 w-10 mt-1">
                                            {school.logoUrl && <AvatarImage src={school.logoUrl} alt={school.name} />}
                                            <AvatarFallback>{school.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm">{item.content}</p>
                                            <p className="text-xs text-muted-foreground mt-2">{item.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Students Directory</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                {allStudents.map(student => (
                                     <Link href={`/p/${student.id}`} key={student.id} className="text-center group cursor-pointer">
                                        <Avatar className="h-16 w-16 mx-auto transition-transform group-hover:scale-105">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback>{student.initials}</AvatarFallback>
                                        </Avatar>
                                        <p className="text-xs font-medium mt-2 truncate">{student.name}</p>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </main>
                    <aside className="lg:col-span-4 space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-3"><Building2 className="h-4 w-4 shrink-0" /> {school.name}</div>
                                <div className="flex items-center gap-3"><Users className="h-4 w-4 shrink-0" /> {school.students.toLocaleString()} Students</div>
                                <div className="flex items-center gap-3"><GraduationCap className="h-4 w-4 shrink-0" /> {school.teachers.toLocaleString()} Teachers</div>
                                {school.verified ? (
                                    <div className="flex items-center gap-3 text-green-600 font-semibold"><CheckCircle className="h-4 w-4 shrink-0" /> Verified by SMSUP+</div>
                                ) : (
                                    <div className="flex items-center gap-3 text-amber-600 font-medium"><XCircle className="h-4 w-4 shrink-0" /> Not Verified</div>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                               {allEvents.slice(0, 4).map(event => (
                                   <div key={event.id} className="flex items-center gap-3">
                                       <div className="h-10 w-10 rounded-lg bg-secondary flex-col flex items-center justify-center shrink-0">
                                            <div className="text-xs font-bold text-secondary-foreground">{format(new Date(event.date), 'MMM')}</div>
                                            <div className="text-lg font-bold leading-tight text-secondary-foreground">{format(new Date(event.date), 'd')}</div>
                                       </div>
                                        <div>
                                            <p className="text-sm font-medium">{event.title}</p>
                                            <p className="text-xs text-muted-foreground">{event.category}</p>
                                       </div>
                                   </div>
                               ))}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    )
}
