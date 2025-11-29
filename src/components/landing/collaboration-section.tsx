/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, MessageSquare } from 'lucide-react';

const slides = [
  {
    key: 'plans',
    title: 'Curriculum',
    tail: 'that adapts to you',
    color: '#5876de',
    icon: <BookOpen className="w-5 h-5" />,
    copy: 'Plan lessons, align objectives, and share materials with your team. Keep everyone teaching from the same playbook.',
    badges: ['Standards-aligned', 'Reusable', 'Versioned'],
  },
  {
    key: 'workflow',
    title: 'Approvals',
    tail: 'without the bottlenecks',
    color: '#00b894',
    icon: <CheckCircle2 className="w-5 h-5" />,
    copy: 'From fee waivers to event permits, set lightweight approval flows that keep work moving and audit trails clean.',
    badges: ['Audited', 'Role-based', 'Templates'],
  },
  {
    key: 'messages',
    title: 'Messages',
    tail: 'parents actually read',
    color: '#ffb02e',
    icon: <MessageSquare className="w-5 h-5" />,
    copy: 'Send targeted emails, SMS, or push to just the right guardians. Scheduled digests prevent notification overload.',
    badges: ['Segmentation', 'Schedules', 'Analytics'],
  },
];

export function CollaborationSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = slides[active];

  return (
    <section id="collab" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
        <div className="rounded-3xl bg-primary text-primary-foreground ring-1 ring-border overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_70%_30%,hsla(var(--primary-foreground),0.05),transparent_60%)]"></div>
            <div className="min-h-[520px] relative overflow-hidden">
              <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <div>
                    <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-center lg:text-left">Plan, write, and ship work that matters</h2>
                    <div className="mt-10 space-y-5">
                      {slides.map((slide, index) => (
                        <button
                          key={slide.key}
                          type="button"
                          className={`w-full text-left rounded-xl ring-1 p-4 transition ${
                            index === active ? 'bg-primary-foreground/20 ring-primary-foreground/30' : 'bg-primary-foreground/10 ring-primary-foreground/20 hover:ring-primary-foreground/30'
                          }`}
                          onClick={() => setActive(index)}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                              style={{ backgroundColor: `${slide.color}1a`, color: slide.color }}
                            >
                              {slide.icon}
                            </span>
                            <span className="text-sm font-medium">{slide.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="relative rounded-2xl border border-primary-foreground/10 bg-primary/80 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-primary-foreground/10 backdrop-blur-md overflow-hidden">
                      <div className="h-12 flex items-center gap-2 px-4 border-b border-primary-foreground/10 text-primary-foreground/70 text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span className="truncate">Ugbekun</span>
                        <span className="opacity-50">›</span>
                        <span className="truncate text-primary-foreground/90">Product brief</span>
                      </div>
                      <div className="relative px-6 md:px-8 py-8 md:py-10">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                          style={{ backgroundColor: `${activeSlide.color}1a`, color: activeSlide.color }}
                        >
                          {activeSlide.icon}
                        </div>
                        <div className="relative">
                          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center rounded-md px-2.5 py-1.5 ring-1 text-base sm:text-lg bg-primary-foreground/10 text-primary-foreground ring-primary-foreground/20">
                              {activeSlide.title}
                            </span>
                            <span className="block sm:inline">{activeSlide.tail}</span>
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {activeSlide.badges.map((badge) => (
                              <span key={badge} className="inline-flex items-center rounded-md bg-primary-foreground/10 text-primary-foreground text-xs px-2 py-1 ring-1 ring-primary-foreground/15">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="mt-5 text-primary-foreground/70 leading-relaxed max-w-prose text-[17px] sm:text-lg">{activeSlide.copy}</p>
                        <div className="mt-8 space-y-2 animate-pulse">
                          <div className="h-3 rounded bg-primary-foreground/10 w-2/3"></div>
                          <div className="h-3 rounded bg-primary-foreground/10 w-5/6"></div>
                          <div className="h-3 rounded bg-primary-foreground/10 w-1/2"></div>
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/80 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
