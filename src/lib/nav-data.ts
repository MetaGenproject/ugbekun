
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import type { ReactElement } from 'react';
import {
  LayoutDashboard, Users, User, CalendarDays, Wallet, BookOpen, FileCheck,
  GraduationCap, BookCopy, CalendarClock, ClipboardList, Library, Car,
  Hotel, Settings, ShieldAlert, FileBarChart, MessageSquareMore,
  HeartHandshake, NotebookText, WalletCards, Bus, ListChecks, Award, CalendarCheck2, ShieldCheck,
  Building, CreditCard, UserPlus, Server, LifeBuoy, Megaphone, WandSparkles, Users2, Briefcase, HeartPulse, AreaChart, CircleDollarSign, BarChartHorizontal, Cpu, Network, Ticket, History, ShieldQuestion, KeyRound, Globe, Landmark, Scale, GitPullRequest, File, TestTube2, Workflow, Link, Fingerprint, Lock, Presentation, HandCoins, Receipt, Banknote, LandmarkIcon, ShoppingCart, Archive, Building2, Wrench, Utensils, BadgeHelp, Siren, MessageCircle, FileQuestion, BookLock, UserCog, LineChart, FileCog, BrainCircuit, Bot, Database, Train, Globe2, ScanFace, CheckCheck, FileDigit, GanttChartSquare, Route, Hospital, Salad, IdCard, Handshake, GraduationCapIcon, BookMarked, Video, BookHeadphones, LandmarkOff, ScrollText, GitBranch, Shield, Eye, Info, Coins, Dna, PiggyBank, BriefcaseBusiness, Gavel, FileText, FileLock, SlidersHorizontal, Clock3,
  School, Edit, HardDrive, PenSquare, BookHeart
} from 'lucide-react';
import type { PlanFeatures } from '@/context/plan-context';


export interface NavItem {
  href?: string;
  icon?: ReactElement;
  label: string;
  description?: string;
  isHeader?: boolean;
  isDockItem?: boolean;
  featureKey?: keyof PlanFeatures;
}

export const superAdminNavItems: NavItem[] = [
    { href: '/super-admin/dashboard', icon: <LayoutDashboard />, label: 'Dashboard', isDockItem: true, description: "The master control panel for platform oversight, school management, and global analytics." },
    
    { isHeader: true, label: 'Content Management' },
    { href: '/super-admin/cms/content', icon: <HardDrive />, label: 'CMS', description: "Manage the public-facing website. Edit the features, testimonials, and FAQ sections that appear on the landing page for prospective customers." },
    { href: '/super-admin/cms/schools', icon: <Building />, label: 'Schools', description: "View, manage, and edit all schools operating on the Ugbekun platform. You can onboard new schools or deactivate existing ones from this dashboard." },
    { href: '/super-admin/cms/admins', icon: <UserCog />, label: 'Admins', description: "Manage your internal Ugbekun team members. Invite new staff, edit their roles and permissions, and manage their access to the super admin dashboard." },
    { href: '/super-admin/cms/subjects', icon: <BookCopy />, label: 'Global Subjects', description: "Manage a global repository of subjects that new schools can inherit during onboarding." },
    { href: '/super-admin/cms/settings', icon: <Settings />, label: 'Platform Settings', description: "Configure global settings for the entire Ugbekun platform, including branding, default integrations, and subscription plan details." },

    { isHeader: true, label: 'Client Management' },
    { href: '/super-admin/team', icon: <Users2 />, label: 'Team', description: "Manage your internal Ugbekun team members. Invite new staff, edit their roles and permissions, and manage their access to the super admin dashboard." },
    
    { isHeader: true, label: 'Growth' },
    { href: '/super-admin/marketing', icon: <AreaChart />, label: 'Marketing', description: "View marketing analytics, including website visitors, leads generated, and campaign performance." },
    { href: '/super-admin/announcements', icon: <Megaphone />, label: 'Announcements', description: "Broadcast messages to all schools on the platform, such as maintenance notices or new feature announcements." },
    
    { isHeader: true, label: 'Platform' },
    { href: '/super-admin/analytics', icon: <BarChartHorizontal />, label: 'Analytics', description: "Dive deep into platform-wide data. Analyze growth trends, revenue by subscription plan, and user engagement metrics to make informed business decisions." },
    { href: '/super-admin/health', icon: <Cpu />, label: 'System Health', description: "Monitor the real-time health and status of all platform services, including APIs, databases, and third-party integrations." },
    { href: '/super-admin/support', icon: <Ticket />, label: 'Support Tickets', description: "Handle escalated support tickets from school administrators, ensuring high-priority issues are resolved quickly." },
    { href: '/super-admin/subscriptions', icon: <CreditCard />, label: 'Subscriptions', description: "Get a financial overview of the platform. View revenue breakdowns by subscription plan and manage the different tiers offered to schools." },
    { href: '/super-admin/history', icon: <History />, label: 'Audit Log', description: "View a complete, immutable log of all major actions taken across the entire platform by both super admins and school admins for security and compliance." },
];

export const adminNavItems: NavItem[] = [
  { href: '/admin/dashboard', icon: <LayoutDashboard />, label: 'Dashboard', isDockItem: true, featureKey: 'DASHBOARD' },
  { href: '/admin/my-school', icon: <School />, label: 'My School', featureKey: 'DASHBOARD' },
  
  { isHeader: true, label: 'Core' },
  { href: '/admin/admissions', icon: <UserPlus />, label: 'Admissions', featureKey: 'ADMISSIONS' },
  { href: '/admin/students', icon: <Users />, label: 'Students', isDockItem: true, featureKey: 'STUDENT_PROFILES' },
  { href: '/admin/hr', icon: <Briefcase />, label: 'Staff (HR)', featureKey: 'ADVANCED' },

  { isHeader: true, label: 'Academics' },
  { href: '/admin/classes', icon: <Building2 />, label: 'Classes' },
  { href: '/admin/subjects', icon: <BookCopy />, label: 'Subjects' },
  { href: '/admin/timetable', icon: <CalendarClock />, label: 'Timetable', featureKey: 'TIMETABLE' },
  { href: '/admin/examinations', icon: <ShieldAlert />, label: 'Exams & Grading', featureKey: 'EXAMS' },
  { href: '/admin/results', icon: <BarChartHorizontal />, label: 'Results' },
  { href: '/admin/reports', icon: <FileBarChart />, label: 'AI Reports', isDockItem: true, featureKey: 'AI_REPORTS' },
  { href: '/admin/reports/designer', icon: <SlidersHorizontal />, label: 'Report Designer', featureKey: 'ADVANCED' },
  
  { isHeader: true, label: 'Finance' },
  { href: '/admin/finance', icon: <Wallet />, label: 'Finance', isDockItem: true, featureKey: 'FINANCE' },
  { href: '/admin/hr/payroll', icon: <HandCoins />, label: 'Payroll', featureKey: 'ADVANCED' },
  
  { isHeader: true, label: 'Operations' },
  { href: '/teacher/clock-in', icon: <Clock3 />, label: 'Staff Clock-in', featureKey: 'ADVANCED' },
  { href: '/admin/library', icon: <Library />, label: 'Library', featureKey: 'ADVANCED' },
  { href: '/admin/transport', icon: <Route />, label: 'Transport', featureKey: 'ADVANCED' },
  { href: '/admin/hostel', icon: <Hotel />, label: 'Hostels', featureKey: 'ADVANCED' },
  
  { isHeader: true, label: 'Engagement' },
  { href: '/admin/events', icon: <CalendarDays />, label: 'Events Calendar' },
  { href: '/admin/messages', icon: <MessageSquareMore />, label: 'Communications', featureKey: 'COMMUNICATIONS' },
  
  { isHeader: true, label: 'Configuration' },
  { href: '/admin/history', icon: <History />, label: 'Audit Log' },
  { href: '/admin/settings', icon: <Settings />, label: 'Settings', featureKey: 'DASHBOARD' },
  { href: '/documentation', icon: <BookHeart />, label: 'Documentation' },
];

export const parentNavItems: NavItem[] = [
    { href: '/parent/dashboard', icon: <LayoutDashboard />, label: 'Dashboard', isDockItem: true },
    { href: '/parent/children', icon: <Users />, label: 'My Children'},
    { href: '/parent/payments', icon: <WalletCards />, label: 'Fees', isDockItem: true },
    { href: '/parent/assignments', icon: <NotebookText />, label: 'Assignments', isDockItem: true },
    { href: '/parent/messages', icon: <MessageSquareMore />, label: 'Messages', isDockItem: true },
    { href: '/parent/attendance', icon: <CalendarCheck2 />, label: 'Attendance' },
    { href: '/parent/examinations', icon: <ShieldAlert />, label: 'Exams' },
    { href: '/parent/grades', icon: <Award />, label: 'Grades' },
    { href: '/parent/calendar', icon: <CalendarDays />, label: 'Calendar' },
    { href: '/parent/transport', icon: <Bus />, label: 'Transport' },
    { href: '/parent/settings', icon: <Settings />, label: 'Settings' },
    { href: '/credentials', icon: <FileCheck />, label: 'Check Result' },
];

export const studentNavItems: NavItem[] = [
    { href: '/student/dashboard', icon: <LayoutDashboard />, label: 'Overview', isDockItem: true },
    { href: '/student/grades', icon: <Award />, label: 'My Grades', isDockItem: true },
    { href: '/student/subjects', icon: <BookOpen />, label: 'Subjects', isDockItem: true },
    { href: '/student/assignments', icon: <NotebookText />, label: 'Assignments', isDockItem: true },
    { href: '/student/examinations', icon: <ShieldAlert />, label: 'Examinations' },
    { href: '/student/profile', icon: <User />, label: 'Profile' },
    { href: '/student/calendar', icon: <CalendarDays />, label: 'Calendar' },
    { href: '/student/messages', icon: <MessageSquareMore />, label: 'Messages' },
    { href: '/student/community', icon: <Users />, label: 'Community' },
    { href: '/student/my-credentials', icon: <ShieldCheck />, label: 'My Credentials' },
    { href: '/student/resources', icon: <BookHeadphones />, label: 'Resources' },
    { href: '/student/settings', icon: <Settings />, label: 'Settings' },
];

export const teacherNavItems: NavItem[] = [
    { href: '/teacher/dashboard', icon: <LayoutDashboard />, label: 'Dashboard', isDockItem: true },
    { isHeader: true, label: 'Classroom' },
    { href: '/teacher/classes', icon: <BookCopy />, label: 'My Classes', isDockItem: true },
    { href: '/teacher/attendance', icon: <CheckCheck />, label: 'Attendance' },
    { href: '/teacher/students', icon: <Users />, label: 'Students' },
    { href: '/teacher/subjects', icon: <BookMarked />, label: 'Subjects' },
    { href: '/teacher/results/entry', icon: <FileDigit />, label: 'Results Entry' },
    { href: '/teacher/grading', icon: <Edit />, label: 'Grading' },
    { href: '/teacher/examinations', icon: <ShieldAlert />, label: 'Exams' },
    { href: '/teacher/resources', icon: <BookHeadphones />, label: 'Resources' },
    { isHeader: true, label: 'Instruction' },
    { href: '/teacher/planner', icon: <WandSparkles />, label: 'AI Planner', isDockItem: true },
    { href: '/teacher/assessment', icon: <ScanFace />, label: 'Assessments' },
    { isHeader: true, label: 'Engagement & Admin' },
    { href: '/teacher/messages', icon: <MessageSquareMore />, label: 'Messages', isDockItem: true },
    { href: '/teacher/clock-in', icon: <Clock3 />, label: 'Clock-in' },
    { href: '/teacher/settings', icon: <Settings />, label: 'Settings' },
];
