/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

import { CheckCircle2, Shield, Rocket, Settings, BookOpen, Heart, ListChecks, CreditCard, BarChart3, Calendar, FileCheck2, Users, Bell, Mail, Receipt, NotebookPen, Trophy, CalendarClock, GraduationCap } from "lucide-react";
import Image from "next/image";

export function RolesSection() {
  return (
    <section id="solutions" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-secondary/50 p-6 md:p-10 ring-1 ring-border overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">
                  Purpose-built for every role
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Admins, teachers, and guardians collaborate in one secure workspace with the right controls.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-background ring-1 ring-border text-foreground">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">Granular roles, permissions, and audit logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-background ring-1 ring-border text-foreground">
                      <Shield className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">Privacy by default with secure data export</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-background ring-1 ring-border text-foreground">
                      <Rocket className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">Fast onboarding and zero-downtime updates</span>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="rounded-2xl bg-card p-5 ring-1 ring-border hover:ring-border/20 transition group">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Settings className="h-5 w-5" />
                        </span>
                        <h3 className="display text-lg font-semibold tracking-tight text-card-foreground">Admins</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><ListChecks className="h-4 w-4" /> Bulk enrollments & promotions</li>
                        <li className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Fees, invoices, and receipts</li>
                        <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Branch-level analytics</li>
                    </ul>
                    <div className="mt-4 h-24 rounded-xl bg-background ring-1 ring-border relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-8 bg-card/80 flex items-center gap-2 px-3 ring-1 ring-border animate-[admin-header_4s_ease-in-out_infinite]">
                            <div className="h-3 w-16 rounded bg-secondary"></div>
                            <div className="h-3 w-10 rounded bg-secondary"></div>
                            <div className="ml-auto h-3 w-6 rounded bg-secondary"></div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-3 grid grid-cols-3 gap-2">
                            <div className="h-10 rounded bg-card ring-1 ring-border origin-bottom animate-[admin-bar-1_4s_ease-in-out_infinite]"></div>
                            <div className="h-10 rounded bg-card ring-1 ring-border origin-bottom animate-[admin-bar-2_4s_ease-in-out_infinite]"></div>
                            <div className="h-10 rounded bg-card ring-1 ring-border origin-bottom animate-[admin-bar-3_4s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-card p-5 ring-1 ring-border hover:ring-border/20 transition group">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BookOpen className="h-5 w-5" />
                        </span>
                        <h3 className="display text-lg font-semibold tracking-tight text-card-foreground">Teachers</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Timetables & lesson plans</li>
                        <li className="flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> Grading & assessments</li>
                        <li className="flex items-center gap-2"><Users className="h-4 w-4" /> Attendance with one tap</li>
                    </ul>
                    <div className="mt-4 h-24 rounded-xl bg-background ring-1 ring-border relative overflow-hidden">
                        <div className="absolute inset-0 p-3 grid grid-cols-4 gap-2">
                            <div className="col-span-3 space-y-2">
                                <div className="h-4 rounded bg-card ring-1 ring-border animate-[teacher-line-1_4s_ease-in-out_infinite]"></div>
                                <div className="h-4 rounded bg-card ring-1 ring-border w-5/6 animate-[teacher-line-2_4s_ease-in-out_infinite]"></div>
                                <div className="h-4 rounded bg-card ring-1 ring-border w-2/3 animate-[teacher-line-3_4s_ease-in-out_infinite]"></div>
                            </div>
                            <div className="col-span-1 space-y-2">
                                <div className="h-4 rounded bg-secondary animate-[teacher-check-1_4s_ease-in-out_infinite]"></div>
                                <div className="h-4 rounded bg-secondary animate-[teacher-check-2_4s_ease-in-out_infinite]"></div>
                                <div className="h-4 rounded bg-secondary animate-[teacher-check-3_4s_ease-in-out_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-card p-5 ring-1 ring-border hover:ring-border/20 transition group">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Heart className="h-5 w-5" />
                        </span>
                        <h3 className="display text-lg font-semibold tracking-tight text-card-foreground">Guardians</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><Bell className="h-4 w-4" /> Instant updates and reminders</li>
                        <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> Direct messages to teachers</li>
                        <li className="flex items-center gap-2"><Receipt className="h-4 w-4" /> Pay fees securely</li>
                    </ul>
                    <div className="mt-4 h-24 rounded-xl bg-background ring-1 ring-border relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center gap-2 px-3 animate-[guardian-card_4s_ease-in-out_infinite]">
                            <div className="h-12 flex-1 rounded-lg bg-card ring-1 ring-border"></div>
                            <div className="h-12 w-16 rounded-lg bg-secondary"></div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-card p-5 ring-1 ring-border hover:ring-border/20 transition group">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <GraduationCap className="h-5 w-5" />
                        </span>
                        <h3 className="display text-lg font-semibold tracking-tight text-card-foreground">Students</h3>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><NotebookPen className="h-4 w-4" /> Assignments & resources</li>
                        <li className="flex items-center gap-2"><Trophy className="h-4 w-4" /> Progress tracking</li>
                        <li className="flex items-center gap-2"><CalendarClock className="h-4 w-4" /> Exam schedules</li>
                    </ul>
                    <div className="mt-4 h-24 rounded-xl bg-background ring-1 ring-border relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-6 bg-card/80 ring-1 ring-border animate-[student-header_4s_ease-in-out_infinite]"></div>
                        <div className="absolute inset-x-0 bottom-0 p-3 grid grid-cols-2 gap-2">
                            <div className="h-4 rounded bg-card ring-1 ring-border animate-[student-item-1_4s_ease-in-out_infinite]"></div>
                            <div className="h-4 rounded bg-card ring-1 ring-border animate-[student-item-2_4s_ease-in-out_infinite]"></div>
                            <div className="col-span-2 h-4 rounded bg-card ring-1 ring-border animate-[student-item-3_4s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
