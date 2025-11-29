/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Book,
  FileText,
  PieChart,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Bell,
  Users,
  GraduationCap,
  CalendarCheck2,
  User,
  UserRound,
  BookHeart,
  Building,
  ShieldCheck,
  Clock,
  LayoutDashboard,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PreloaderLink } from '@/components/ui/preloader-link';
import { useAuth } from '@/hooks/use-auth';

const chartData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 94 },
  { name: 'Thu', value: 96 },
  { name: 'Fri', value: 97 },
  { name: 'Sat', value: 90 },
  { name: 'Sun', value: 93 },
];

const animatedWordsDesktop = [
    "everyone.",
    "schools.",
    "students.",
    "parents.",
    "teachers.",
];

const animatedWordsMobile = [
    "For everyone.",
    "For schools.",
    "For students.",
    "For parents.",
    "For teachers.",
];


const searchPlaceholders = ["Search 'Ada Okoro'", "Search 'Femi Adebayo'", "Search 'Chinwe Nwosu'", "Search 'Daniel Innocent'"];


export function HeroSection() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-student');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const router = useRouter();

  const [placeholder, setPlaceholder] = useState("Search...");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentCount, setStudentCount] = useState(932);
  const [showUserIcon, setShowUserIcon] = useState(true);
  const { isLoggedIn, userRole, isLoading } = useAuth();
  
  const dashboardHref = !isLoading && userRole ? `/${userRole}/dashboard` : '/login';

  useEffect(() => {
    const iconInterval = setInterval(() => {
        setShowUserIcon(prev => !prev);
    }, 2000);
    return () => clearInterval(iconInterval);
  }, []);

  useEffect(() => {
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const delay = 2000;

    const handleTyping = () => {
      const currentPlaceholder = searchPlaceholders[placeholderIndex];
      if (!isDeleting) {
        if (charIndex < currentPlaceholder.length) {
          setPlaceholder(currentPlaceholder.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(currentPlaceholder.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, placeholderIndex]);


  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % animatedWordsDesktop.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const numberInterval = setInterval(() => {
      const dip = Math.floor(Math.random() * 5) + 1; // dip by 1 to 5
      setStudentCount(932 - dip);
      
      setTimeout(() => {
        setStudentCount(932);
      }, 300); // stay dipped for 300ms
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(numberInterval);
  }, []);
  
  return (
    <section className="relative pt-6 pb-12 md:pt-10 md:pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-[28px] bg-primary min-h-[720px] sm:min-h-[680px] md:min-h-[680px] overflow-hidden ring-1 ring-border">
          <div className="pointer-events-none absolute -top-32 -left-20 h-[480px] w-[480px] rounded-full bg-primary-foreground/10 blur-3xl"></div>
          
           <div
            className="absolute z-0 bottom-0 right-0 h-auto w-full md:h-[640px] md:w-[640px] pointer-events-none flex justify-center md:block"
          >
            <div className="h-[400px] w-[400px] md:h-full md:w-full">
              {heroImage && (
                <div className="h-full w-full object-contain md:hidden" style={{transform: 'translate(0, 20%) scale(1.4)'}}>
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    width={600}
                    height={600}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
                 {heroImage && (
                  <div className="hidden md:block h-full w-full" style={{transform: 'translate(10%, 17%) scale(0.95)'}}>
                    <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      data-ai-hint={heroImage.imageHint}
                      width={600}
                      height={600}
                      priority
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
            </div>
          </div>
          
          <div className="absolute inset-0 z-10 p-6 sm:p-10 md:p-12">
            <div className="flex flex-col h-full md:justify-center md:gap-8 pt-16 md:pt-0">
              <div className="space-y-6 text-primary-foreground text-center md:text-left">
                 <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 ring-1 ring-border/15 w-max mx-auto md:mx-0">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Your All-in one School Platform</span>
                </div>
                <div className="display text-[40px] sm:text-[56px] md:text-[64px] leading-[1.05] tracking-tight font-semibold">
                    {/* Mobile version */}
                    <div className="flex flex-col items-center justify-center md:hidden">
                        <span>Excellence.</span>
                        <div className="relative h-16 w-full">
                            {animatedWordsMobile.map((word, index) => (
                                <span
                                    key={word}
                                    className={cn(
                                    "absolute inset-0 flex w-full items-center justify-center text-center transition-all duration-500 ease-in-out",
                                    index === currentWordIndex
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-4'
                                    )}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Desktop version */}
                    <div className="hidden md:flex flex-col items-start justify-start">
                        <span>Excellence.</span>
                        <div className="flex flex-row items-center justify-start">
                            <span>For&nbsp;</span>
                            <div className="relative h-20 w-80">
                                {animatedWordsDesktop.map((word, index) => (
                                    <span
                                        key={word}
                                        className={cn(
                                        "absolute inset-0 flex items-center justify-start transition-all duration-500 ease-in-out",
                                        index === currentWordIndex
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 -translate-y-4'
                                        )}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-primary-foreground/80 text-base sm:text-lg max-w-md mx-auto md:mx-0">
                  School Management. Just got easier.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-4 mt-auto md:mt-8 md:flex-row">
                 <div className="glass flex-1 flex-col rounded-2xl bg-background/70 p-3 shadow-lg ring-1 ring-black/5 sm:p-4 w-full md:max-w-lg flex animate-in-up backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder={placeholder}
                          className="h-10 w-full rounded-xl bg-background pl-9 pr-3 text-sm text-foreground ring-1 ring-border placeholder:text-muted-foreground focus:outline-none focus:ring-ring/40"
                        />
                      </div>
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-background/50 text-foreground/70 hover:bg-background/80 ring-1 ring-border">
                        <PreloaderLink href={isLoggedIn && dashboardHref ? `${dashboardHref}/notifications` : '/login'}>
                            <motion.div
                            animate={{ rotate: [0, 15, -10, 15, 0] }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: 'loop',
                                repeatDelay: 2,
                                ease: 'easeInOut',
                            }}
                            >
                                <Bell className="h-5 w-5" />
                            </motion.div>
                        </PreloaderLink>
                      </Button>
                       <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full bg-background/50 text-foreground/70 hover:bg-background/80 ring-1 ring-border">
                        <PreloaderLink href={isLoggedIn && dashboardHref ? `${dashboardHref}/settings` : '/login'}>
                          <AnimatePresence mode="wait">
                            {showUserIcon ? (
                                <motion.div
                                    key="user"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <User className="h-5 w-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="user-round"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <UserRound className="h-5 w-5" />
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </PreloaderLink>
                      </Button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-background p-3 ring-1 ring-border text-foreground">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Students
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="display text-xl font-semibold tracking-tight transition-all duration-300">
                            {studentCount}
                          </p>
                           <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-primary p-3 text-primary-foreground ring-1 ring-border">
                        <p className="text-[10px] uppercase tracking-wider text-primary-foreground/70">
                          Teachers
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="display text-xl font-semibold tracking-tight">
                            54
                          </p>
                          <GraduationCap className="h-5 w-5 text-primary-foreground/80" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-background p-3 ring-1 ring-border text-foreground">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          Events
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="display text-xl font-semibold tracking-tight">
                            40
                          </p>
                          <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-20 mt-[-24px] hidden justify-center md:flex">
          <Link href="#features" className="group" aria-label="Scroll down">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-md transition-colors group-hover:border-border/30 group-hover:bg-accent">
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </Link>
        </div>


        <div className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="rounded-2xl bg-card ring-1 ring-border p-3 sm:p-4 flex items-center gap-3">
                <BookHeart className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80 shrink-0" />
                <span className="display tracking-tight text-foreground font-medium text-sm sm:text-base">Ugbekun</span>
            </div>
            <div className="rounded-2xl bg-card ring-1 ring-border p-3 sm:p-4 flex items-center gap-3">
                 <Building className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80 shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">Trusted by schools</span>
            </div>
            <div className="rounded-2xl bg-card ring-1 ring-border p-3 sm:p-4 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80 shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">Secure & Compliant</span>
            </div>
            <div className="rounded-2xl bg-card ring-1 ring-border p-3 sm:p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-foreground/80 shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">Reliable 24/7</span>
            </div>
        </div>

      </div>
    </section>
  );
}
