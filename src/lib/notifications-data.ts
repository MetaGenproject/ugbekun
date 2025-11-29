
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import type { LucideIcon } from 'lucide-react';
import {
  FileCheck, Wallet, UserPlus, Megaphone, ServerCrash, BarChart2,
  FileText, CalendarCheck2, MessageSquare, AlertTriangle,
  GraduationCap, ListChecks, Award, Building, ClipboardCheck,
  History, HandCoins, Users, WalletCards, Bus, NotebookText,
  Building2, BookCopy, CalendarClock, ShieldAlert, FileBarChart,
  Library, Car, Hotel, Settings, Briefcase, HeartPulse, AreaChart,
  CircleDollarSign, BarChartHorizontal, Cpu, Network, Ticket, LifeBuoy,
  WandSparkles, Users2, Clock3, HardDrive, PenSquare, UserCog,
  BookMarked, Edit, CheckCheck, ScanFace, BookHeadphones,
  LayoutDashboard, School, HeartHandshake, CheckCircle2, Shield, Rocket,
  BookOpen, Heart, Receipt, Trophy, Calendar, Check, SlidersHorizontal,
  Eye, Info, Coins, Dna, PiggyBank, BriefcaseBusiness, Gavel, FileLock,
  Clock, Route, Hospital, Salad, IdCard, Handshake, GitBranch, ScrollText,
  Video, GitPullRequest, Link, Fingerprint, Lock, Presentation,
  Landmark, Scale, XCircle, KeyRound, Database,
  Bell, Bot, Code, CloudCog, Recycle, Mail, CircleDot,
} from "lucide-react";

export interface Notification {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  read: boolean;
  href?: string;
}

export const iconMap: { [key in keyof typeof import('lucide-react')]?: LucideIcon } = {
    FileCheck, Wallet, UserPlus, Megaphone, ServerCrash, BarChart2,
    FileText, CalendarCheck2, MessageSquare, AlertTriangle,
    GraduationCap, ListChecks, Award, Building, ClipboardCheck,
    History, HandCoins, Users, WalletCards, Bus, NotebookText,
    Building2, BookCopy, CalendarClock, ShieldAlert, FileBarChart,
    Library, Car, Hotel, Settings, Briefcase, HeartPulse, AreaChart,
    CircleDollarSign, BarChartHorizontal, Cpu, Network, Ticket, LifeBuoy,
    WandSparkles, Users2, Clock3, HardDrive, PenSquare, UserCog,
    BookMarked, Edit, CheckCheck, ScanFace, BookHeadphones,
    LayoutDashboard, School, HeartHandshake, CheckCircle2, Shield, Rocket,
    BookOpen, Heart, Receipt, Trophy, Calendar, Check, SlidersHorizontal,
    Eye, Info, Coins, Dna, PiggyBank, BriefcaseBusiness, Gavel, FileLock,
    Clock, Route, Hospital, Salad, IdCard, Handshake, GitBranch, ScrollText,
    Video, GitPullRequest, Link, Fingerprint, Lock, Presentation,
    Landmark, Scale, XCircle, KeyRound, Database, Bell, Bot, Code, CloudCog,
    Recycle, Mail, CircleDot,
};

export const superAdminNotifications: Notification[] = [
  { id: 1, title: "New School Onboarded", description: "Graceland Academy has joined the Growth plan.", icon: "Building", read: false, href: "/super-admin/schools" },
  { id: 2, title: "Subscription Payment", description: "Unity College paid their termly subscription.", icon: "Wallet", read: false, href: "/super-admin/subscriptions" },
  { id: 3, title: "High Memory Usage", description: "Server instance `prod-main-3` is at 92% memory.", icon: "ServerCrash", read: true, href: "/super-admin/health" },
  { id: 4, title: "Weekly Report Ready", description: "Your platform growth report is available.", icon: "BarChart2", read: true, href: "/super-admin/analytics" },
];

export const adminNotifications: Notification[] = [
  { id: 1, title: "New Admission Application", description: "Adaobi Okeke has applied for JSS 1.", icon: "UserPlus", read: false, href: "/admin/admissions" },
  { id: 2, title: "Invoice Paid", description: "Femi Adebayo (Guardian) paid outstanding fees.", icon: "Wallet", read: false, href: "/admin/finance" },
  { id: 3, title: "Teacher Report Submitted", description: "Mr. Adebayo submitted end-of-term reports.", icon: "FileText", read: true, href: "/admin/reports" },
  { id: 4, title: "Global Announcement", description: "From Super Admin: Platform maintenance scheduled.", icon: "Megaphone", read: true, href: "/admin/dashboard" },
];

export const teacherNotifications: Notification[] = [
  { id: 1, title: "Assignment Submitted", description: "John Doe submitted 'Algebra II - Chapter 4 Quiz'.", icon: "FileCheck", read: false, href: "/teacher/grading" },
  { id: 2, title: "Parent Message", description: "Mrs. Johnson sent a message about Maya.", icon: "MessageSquare", read: false, href: "/teacher/messages" },
  { id: 3, title: "Class Cancellation", description: "Your 2:00 PM class has been cancelled.", icon: "CalendarCheck2", read: true, href: "/teacher/schedule" },
  { id: 4, title: "Grade Dispute", description: "A student has disputed a grade for 'Essay 1'.", icon: "AlertTriangle", read: true, href: "/teacher/grading" },
];

export const parentNotifications: Notification[] = [
  { id: 1, title: "New Grade Published", description: "Maya scored an A in her recent Math test.", icon: "Award", read: false, href: "/parent/grades" },
  { id: 2, title: "Attendance Marked", description: "Maya was marked present for all classes today.", icon: "CalendarCheck2", read: false, href: "/parent/attendance" },
  { id: 3, title: "Teacher's Note", description: "Ms. Carter left a positive note about Maya's participation.", icon: "FileText", read: true, href: "/parent/messages" },
  { id: 4, title: "Fee Reminder", description: "Your second term fees are due next week.", icon: "Wallet", read: true, href: "/parent/payments" },
];

export const studentNotifications: Notification[] = [
    { id: 1, title: "New Assignment Posted", description: "Prof. Carter posted 'Problem Set 5'.", icon: "ListChecks", read: false, href: "/student/assignments" },
    { id: 2, title: "Grade Published", description: "You received an A on 'Lab Report 3'.", icon: "Award", read: false, href: "/student/grades" },
    { id: 3, title: "Class Update", description: "Tomorrow's 'Microeconomics' lecture is moved to Hall B.", icon: "CalendarCheck2", read: true, href: "/student/calendar" },
    { id: 4, title: "Study Group", description: "You have been added to the 'CS204 Finals' study group.", icon: "GraduationCap", read: true, href: "/student/community" },
];
