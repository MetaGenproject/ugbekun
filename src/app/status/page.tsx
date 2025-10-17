
"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, eachDayOfInterval } from "date-fns";

type ServiceStatus = "Operational" | "Degraded" | "Outage" | "Maintenance";

const services = [
    { name: "Web Application", status: "Operational" as ServiceStatus, description: "Frontend application and user dashboards." },
    { name: "API Services", status: "Operational" as ServiceStatus, description: "Backend infrastructure and server-side logic." },
    { name: "AI Generation (Genkit)", status: "Operational" as ServiceStatus, description: "AI-powered features like report and lesson plan generation." },
    { name: "Database", status: "Operational" as ServiceStatus, description: "Primary data storage and retrieval." },
    { name: "Authentication", status: "Operational" as ServiceStatus, description: "User sign-in, sign-up, and session management." },
    { name: "On-chain Services (SMSUP+)", status: "Maintenance" as ServiceStatus, description: "Blockchain credential verification services." },
];

const incidents = [
    {
        date: format(subDays(new Date(), 2), "MMMM d, yyyy"),
        title: "Resolved: Brief API Latency",
        description: "We experienced a brief period of increased API latency. The issue has been identified and a fix has been implemented.",
        status: "Resolved"
    },
    {
        date: format(subDays(new Date(), 22), "MMMM d, yyyy"),
        title: "Resolved: Database Maintenance",
        description: "Scheduled database maintenance was completed successfully.",
        status: "Resolved"
    }
];

const statusConfig: Record<ServiceStatus, { icon: React.ElementType, color: string, label: string }> = {
    "Operational": { icon: CheckCircle, color: "text-green-500", label: "Operational" },
    "Degraded": { icon: AlertTriangle, color: "text-yellow-500", label: "Degraded Performance" },
    "Outage": { icon: XCircle, color: "text-red-500", label: "Major Outage" },
    "Maintenance": { icon: Wrench, color: "text-blue-500", label: "Under Maintenance" },
};

export default function StatusPage() {
    const today = new Date();
    const ninetyDaysAgo = subDays(today, 89);
    const dateInterval = eachDayOfInterval({ start: ninetyDaysAgo, end: today });
    const overallStatus = services.some(s => s.status === 'Outage') ? 'Outage' 
                        : services.some(s => s.status === 'Degraded' || s.status === 'Maintenance') ? 'Degraded' 
                        : 'Operational';
    
    return (
        <div className="bg-background py-16 md:py-24">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="max-w-3xl mx-auto text-center">
                    <h1 className="display text-4xl sm:text-5xl tracking-tight font-semibold text-foreground">
                        System Status
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Current status of all Ugbekun services and incident history.
                    </p>
                </header>

                <div className="mt-12 max-w-4xl mx-auto">
                    <div className={cn(
                        "p-4 rounded-lg flex items-center gap-3",
                        overallStatus === 'Operational' && "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300",
                        overallStatus === 'Outage' && "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
                        overallStatus === 'Degraded' && "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
                    )}>
                        <CheckCircle className="h-6 w-6"/>
                        <p className="font-semibold">
                            {overallStatus === 'Operational' ? "All Systems Operational" : "Some Systems are Experiencing Issues"}
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        {services.map(service => {
                            const config = statusConfig[service.status];
                            return (
                                <div key={service.name} className="p-4 rounded-lg border bg-card flex items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{service.name}</p>
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                    </div>
                                    <div className={cn("flex items-center gap-2 text-sm font-semibold shrink-0", config.color)}>
                                        <config.icon className="h-4 w-4" />
                                        <span>{config.label}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                     <div className="mt-12">
                        <h3 className="font-semibold text-lg">Uptime History</h3>
                        <div className="mt-4 p-4 rounded-lg border bg-card">
                             <div className="grid grid-cols-[auto_repeat(31,minmax(0,1fr))] items-center text-xs text-muted-foreground">
                                <div className="text-right pr-2"></div>
                                <div className="col-span-31 grid grid-cols-31 text-center">
                                    <span>{format(subDays(today, 90), 'MMM')}</span>
                                    <span className="col-start-[31] text-right">{format(today, 'MMM')}</span>
                                </div>
                            </div>
                            <div className="grid grid-rows-7 grid-flow-col gap-1 mt-2">
                                {dateInterval.map((day, i) => {
                                    // Make some random days have issues for visual effect
                                    const hasIssue = day.getDate() % 29 === 0 ? 'degraded' : day.getDate() % 17 === 0 ? 'outage' : 'operational';
                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-3 w-3 rounded-sm",
                                                hasIssue === 'operational' && "bg-green-500",
                                                hasIssue === 'degraded' && "bg-yellow-500",
                                                hasIssue === 'outage' && "bg-red-500",
                                            )}
                                            title={format(day, 'PP')}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12">
                         <h3 className="font-semibold text-lg">Past Incidents</h3>
                         <div className="mt-4 space-y-6">
                            {incidents.map(incident => (
                                <div key={incident.date}>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">{incident.date}</p>
                                    <div className="p-4 rounded-lg border bg-card space-y-2">
                                        <p className="font-semibold flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4"/> {incident.title}</p>
                                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>

                </div>
             </div>
        </div>
    )
}
