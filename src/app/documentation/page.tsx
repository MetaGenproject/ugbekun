

"use client";

import { useState, useEffect, useRef, useMemo, type ReactElement } from 'react';
import {
  BookOpen,
  Terminal,
  Database,
  Palette,
  Rocket,
  WandSparkles,
  ShieldCheck,
  LayoutGrid,
  BarChart2,
  Code2,
  HardDrive,
  Users2,
  KeyRound,
  Cloud,
  Container,
  Server,
  Search,
  Type,
  CaseSensitive,
  Eye,
  Workflow,
  Shield,
  GraduationCap,
  HeartHandshake,
  User,
  Star,
  Settings,
  LogIn,
  UserPlus,
  Wallet,
  Calendar,
  ListChecks,
  CheckCheck,
  FilePen,
  Edit,
  MessageSquare,
  NotebookText,
  Award,
  Bus,
  ArrowRight,
  Gavel,
  Landmark,
  AlertTriangle,
  XCircle,
  CreditCard,
  Lightbulb,
  ShieldBan,
  Mail,
  Recycle,
  Bell,
  Fingerprint,
  Lock,
  Cog,
  Baby,
  Clock,
  RefreshCw,
  Scale,
  CircleDot,
  FileBarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// //////////////////////////////////////////////////////////////////
// SHARED COMPONENTS FOR DOCUMENTATION PAGE
// //////////////////////////////////////////////////////////////////

const devSections = [
  { id: 'introduction', title: 'Introduction', icon: <BookOpen /> },
  { id: 'status', title: 'Project Status', icon: <BarChart2 /> },
  { id: 'getting-started', title: 'Getting Started', icon: <Terminal /> },
  { id: 'architecture', title: 'Codebase Architecture', icon: <LayoutGrid /> },
  { id: 'production', title: 'Going to Production', icon: <Rocket /> },
  { id: 'auth', title: '1. Authentication', icon: <KeyRound />, parent: 'production' },
  { id: 'data', title: '2. Database Migration', icon: <Database />, parent: 'production' },
  { id: 'deployment', title: '3. Deployment', icon: <Cloud />, parent: 'production' },
  { id: 'ai-genkit', title: 'AI & Genkit', icon: <WandSparkles /> },
  { id: 'ui-styling', title: 'UI & Styling', icon: <Palette /> },
  { id: 'smsup', title: 'SMSUP+ Credentials', icon: <ShieldCheck /> },
];

type Role = "super-admin" | "admin" | "teacher" | "parent" | "student";

const pageRegistry: Record<string, { role: Role[], title: string, description: string, functionality: string }> = {
    "/": { role: [], title: "Landing Page", description: "The main marketing and entry point for the application.", functionality: "Features hero, features, pricing, testimonials, and FAQ sections. Serves as the public face of the platform." },
    "/onboarding": { role: [], title: "Onboarding", description: "A guided, multi-step process for new school administrators.", functionality: "Collects school identity, admin details, curriculum preferences, and plan selection to generate a new school workspace in the system." },
    "/auth/login": { role: [], title: "Authentication", description: "A centralized portal for all user roles to sign in.", functionality: "Features a role-selector to pre-fill test credentials. In production, this would integrate with a real authentication provider." },
    "/credentials": { role: [], title: "Credential Verification", description: "A public portal for third parties to verify academic credentials.", functionality: "Allows anyone to enter a student's unique ID to check for publicly verifiable on-chain records, simulating a real verification process." },
    "/p/[studentId]": { role: [], title: "Public Credential Profile", description: "A non-editable, public-facing profile that displays verified credentials.", functionality: "Shows a student's name, school, and a list of their publicly shared academic achievements, mimicking a public DID profile." },
    "/admin/dashboard": { role: ['admin'], title: "Admin Dashboard", description: "The central command center for a school administrator.", functionality: "Displays key performance indicators (KPIs) like student/teacher counts, revenue, and events. Features charts for financial overview and academic performance, and lists recent students." },
    "/admin/admissions": { role: ['admin'],title: "Admissions Pipeline", description: "A four-step Kanban-style board for managing new student admissions.", functionality: "Allows admins to track prospective students from 'Enquiry' through 'Application', 'Screening', and final 'Enrollment', changing their status at each stage." },
    "/admin/students": { role: ['admin'], title: "Student Management", description: "A comprehensive directory of all student profiles.", functionality: "Features search and filtering. Admins can add new students, edit profiles, send messages, or delete records. Each student row links to a detailed profile page." },
    "/admin/students/promotions": { role: ['admin'], title: "Student Promotions", description: "An end-of-session tool for bulk-promoting students.", functionality: "The AI suggests promotion mappings (e.g., JSS 1 to JSS 2). The admin reviews, adjusts if needed, and confirms to update all student records at once." },
    "/admin/hr": { role: ['admin'], title: "Staff (HR) Management", description: "A complete directory for managing all teaching and non-teaching staff.", functionality: "Displays staff by department, allows adding/editing profiles, and links to detailed staff pages for managing leave and payroll." },
    "/admin/hr/payroll": { role: ['admin'], title: "Payroll Management", description: "A dedicated interface to process monthly payroll.", functionality: "With a single click, the system calculates and processes salaries for all active staff, creating corresponding transaction records in the finance module." },
    "/admin/finance": { role: ['admin'], title: "Finance Module", description: "A complete financial overview with multiple tabs.", functionality: "Tracks income vs. expenses, manages all fee transactions, creates and sends invoices, and logs operational expenses." },
    "/admin/reports/designer": { role: ['admin'], title: "Report Card Designer", description: "A powerful tool to customize the official school report card.", functionality: "Allows admins to change school branding, logos, and adjust the grading scale, behavioral traits, and skills that appear on reports." },
    "/teacher/dashboard": { role: ['teacher'], title: "Teacher Dashboard", description: "A teacher's daily hub for their schedule and tasks.", functionality: "Shows upcoming classes, assignments that need grading, and recent student activity, providing a clear overview of the day's priorities." },
    "/teacher/planner": { role: ['teacher'], title: "AI Lesson Planner", description: "An AI-powered tool for generating detailed lesson plans.", functionality: "Teachers input a topic, subject, and objectives. The AI then creates a structured lesson plan with sections for introduction, activities, and assessment." },
    "/teacher/grading": { role: ['teacher'], title: "Grading Center", description: "A centralized hub to view and grade student submissions.", functionality: "Lists all assignments and exams. Teachers can select an assignment to view all student submissions, enter scores, and use an AI assistant to generate constructive feedback." },
    "/student/dashboard": { role: ['student'], title: "Student Dashboard", description: "A personal overview of academic progress and tasks.", functionality: "Summarizes recent grades, upcoming assignments, and provides a view of the school calendar. Designed to keep students organized and informed." },
    "/student/subjects": { role: ['student'], title: "My Subjects", description: "A portal for students to access all enrolled subjects.", functionality: "Students can view the syllabus for each subject, track their completion progress, and access learning materials uploaded by the teacher." },
    "/parent/dashboard": { role: ['parent'], title: "Parent Dashboard", description: "An all-in-one view of a child's academic life.", functionality: "Displays their child's grades, attendance statistics, financial status, and upcoming assignments, providing a complete picture of their school life." },
    "/parent/children": { role: ['parent'], title: "Manage My Children", description: "Allows a parent to switch between different children's profiles.", functionality: "Provides a list of all linked children, allowing the parent to select one to view their specific dashboard and academic information." },
    "/super-admin/dashboard": { role: ['super-admin'], title: "Super Admin Dashboard", description: "The master control panel for overseeing the entire platform.", functionality: "Manages all schools on the platform, views platform-wide analytics (growth, revenue), and manages subscriptions and content." },
};

const adminWorkflow = {
  title: "Administrator Workflow",
  description: "The core journey for a school administrator, from setting up the school to managing daily operations.",
  icon: <Shield />,
  steps: [
    { icon: <LogIn />, title: "Login/Onboarding", description: "Admin creates a new school workspace or logs into an existing one.", color: "bg-gray-100 text-gray-800" },
    { icon: <UserPlus />, title: "Onboard Student", description: "Admin receives an application and uses the 'Admissions' module to enroll a new student.", color: "bg-sky-100 text-sky-800" },
    { icon: <Wallet />, title: "Generate Invoice", description: "Admin uses the 'Finance' module to create and send a tuition invoice to the new student's parents.", color: "bg-amber-100 text-amber-800" },
    { icon: <Calendar />, title: "Set Timetable", description: "Using the 'Timetable' module, Admin generates a conflict-free schedule for all classes.", color: "bg-purple-100 text-purple-800" },
    { icon: <FileBarChart />, title: "Generate Reports", description: "At term's end, Admin uses the 'AI Reports' module to generate official report cards for students.", color: "bg-rose-100 text-rose-800" },
  ]
};

const teacherWorkflow = {
  title: "Teacher Workflow",
  description: "The daily and weekly flow for a teacher, focusing on instruction and assessment.",
  icon: <GraduationCap />,
  steps: [
    { icon: <LogIn />, title: "Login", description: "Teacher logs into their dedicated dashboard to view their schedule and tasks.", color: "bg-gray-100 text-gray-800" },
    { icon: <WandSparkles />, title: "Plan Lesson", description: "Teacher uses the 'AI Planner' to generate a structured lesson plan for an upcoming class.", color: "bg-teal-100 text-teal-800" },
    { icon: <CheckCheck />, title: "Take Attendance", description: "At the start of a class, the teacher uses the 'Attendance' module to mark students present.", color: "bg-blue-100 text-blue-800" },
    { icon: <FilePen />, title: "Grade Assignment", description: "Teacher goes to the 'Grading' module to review a student's submission and uses 'AI Assist' to generate feedback.", color: "bg-indigo-100 text-indigo-800" },
    { icon: <MessageSquare />, title: "Communicate with Parent", description: "Teacher uses the 'Messages' feature to send a note to a student's parent regarding their performance.", color: "bg-lime-100 text-lime-800" },
  ]
};

const studentWorkflow = {
  title: "Student Workflow",
  description: "A typical academic loop for a student engaging with their coursework and results.",
  icon: <User />,
  steps: [
    { icon: <LogIn />, title: "Login", description: "Student logs into their personal dashboard to see updates and assignments.", color: "bg-gray-100 text-gray-800" },
    { icon: <NotebookText />, title: "Check Assignments", description: "Student checks the 'Assignments' page to see upcoming homework and due dates.", color: "bg-fuchsia-100 text-fuchsia-800" },
    { icon: <Edit />, title: "Take Exam", description: "Student navigates to the 'Examinations' module to start and complete a scheduled online test.", color: "bg-orange-100 text-orange-800" },
    { icon: <Award />, title: "View Grade", description: "After grading, student receives a notification and checks the 'Grades' page to see their score.", color: "bg-green-100 text-green-800" },
    { icon: <FileBarChart />, title: "View Report Card", description: "At the end of term, student uses a scratch card PIN on the public portal to view their official report card.", color: "bg-sky-100 text-sky-800" },
  ]
};

const parentWorkflow = {
  title: "Parent/Guardian Workflow",
  description: "A parent's journey to stay informed and engaged with their child's school life.",
  icon: <HeartHandshake />,
  steps: [
    { icon: <LogIn />, title: "Login", description: "Parent logs into their dashboard for a complete overview of their child's activities.", color: "bg-gray-100 text-gray-800" },
    { icon: <ListChecks />, title: "Check Child's Progress", description: "Parent views the dashboard to get an overview of their child's attendance and recent grades.", color: "bg-rose-100 text-rose-800" },
    { icon: <MessageSquare />, title: "Message Teacher", description: "Parent uses the 'Messages' feature to ask the class teacher a question about an assignment.", color: "bg-lime-100 text-lime-800" },
    { icon: <Wallet />, title: "Pay School Fees", description: "Parent navigates to the 'Fees' page and uses the integrated payment gateway to pay an outstanding invoice.", color: "bg-amber-100 text-amber-800" },
    { icon: <Bus />, title: "Track School Bus", description: "Parent checks the 'Transport' module to see the live location and ETA of their child's school bus.", color: "bg-cyan-100 text-cyan-800" },
  ]
};

const allWorkflows = [adminWorkflow, teacherWorkflow, studentWorkflow, parentWorkflow];


// //////////////////////////////////////////////////////////////////
// DEVELOPMENT GUIDE COMPONENTS
// //////////////////////////////////////////////////////////////////

const CodeBlock = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <pre className={cn("bg-muted/80 text-muted-foreground p-4 rounded-lg text-sm overflow-x-auto", className)}>
    <code>{children}</code>
  </pre>
);

const FeatureProgress = ({ name, ui, code, functionality }: { name: string, ui: number, code: number, functionality: number }) => (
    <div className="border rounded-lg p-4">
        <h4 className="font-semibold">{name}</h4>
        <div className="mt-3 space-y-3 text-xs">
            <div className="space-y-1">
                <div className="flex justify-between"><span>UI/UX</span><span>{ui}%</span></div>
                <Progress value={ui} />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between"><span>Backend Code</span><span>{code}%</span></div>
                <Progress value={code} />
            </div>
            <div className="space-y-1">
                <div className="flex justify-between"><span>Functionality</span><span>{functionality}%</span></div>
                <Progress value={functionality} />
            </div>
        </div>
    </div>
);

function DevelopmentGuide({ sections, activeSection, searchTerm }: { sections: any[], activeSection: string, searchTerm: string }) {
    const filteredSections = useMemo(() => {
        if (!searchTerm) return sections;
        return sections.filter(section =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sections, searchTerm]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside className="lg:col-span-3 lg:sticky lg:top-24 h-max">
                <nav className="space-y-1">
                {filteredSections.map((section) => (
                    <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        section.parent && 'pl-8',
                        activeSection === section.id
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    >
                    <div
                        className={cn(
                        'h-8 w-8 rounded-lg grid place-items-center shrink-0 transition-colors',
                        section.parent ? 'bg-transparent' : 
                        activeSection === section.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted group-hover:bg-secondary'
                        )}
                    >
                        <div className="h-5 w-5">{section.icon}</div>
                    </div>
                    <span className="font-medium">{section.title}</span>
                    </a>
                ))}
                </nav>
            </aside>
             <main className="lg:col-span-9 space-y-16 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                <section id="introduction">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><BookOpen className="text-primary"/>Introduction</h2>
                <p>Welcome to the Ugbekun Developer Documentation. This guide is the central source of truth for understanding the project's vision, architecture, current status, and the roadmap for future development. It is designed to empower any developer to take this functional prototype and evolve it into a production-ready application.</p>
                <h3 className="text-xl font-bold">Project Vision</h3>
                <p>The vision for Ugbekun is to create a comprehensive, modern, and intuitive School Management Platform tailored for the Nigerian educational landscape. It aims to unify administrative tasks, academic management, financial tracking, and parent-teacher-student communication into a single, seamless experience. This prototype is a significant first step, establishing a robust foundation with a modern tech stack and a rich set of features.</p>
                <h3 className="text-xl font-bold">Project Details</h3>
                <div className="not-prose text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg bg-card"><strong className="block text-muted-foreground text-xs">Author</strong>Daniel Innocent (@mdtbmw)</div>
                    <div className="p-3 border rounded-lg bg-card"><strong className="block text-muted-foreground text-xs">Start Date</strong>October 2023</div>
                    <div className="p-3 border rounded-lg bg-card col-span-1 sm:col-span-2">
                        <strong className="block text-muted-foreground text-xs">Client</strong>
                        METASPACE CONSULT LIMITED, 23 Evbuomwan Street, Etete Road, GRA, Benin City, Edo State
                    </div>
                    <div className="p-3 border rounded-lg bg-card col-span-1 sm:col-span-2">
                        <strong className="block text-muted-foreground text-xs">License and Ownership</strong>
                        Upon successful completion and final payment for this prototype, full ownership, copyright, and all intellectual property rights for this codebase are transferred to METASPACE CONSULT LIMITED. The underlying open-source libraries and frameworks retain their original licenses.
                    </div>
                </div>
                </section>
                
                <section id="status">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><BarChart2 className="text-primary"/>Project Status: A Functional MVP</h2>
                 <p className="border-l-4 border-yellow-400 pl-4 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md"><strong>Note on Credibility:</strong> This documentation describes the application as if it were a complete, production-ready system. However, the underlying code is a <strong>fully functional prototype</strong>. Complex backend systems are currently simulated (e.g., using browser localStorage) to demonstrate the complete user experience. This guide serves as the blueprint to replace those mocks with a real backend.</p>
                <p>This project began as a UI/UX prototype for METASPACE CONSULT LIMITED and has been expanded into a fully interactive Minimum Viable Product (MVP). The UI/UX is 100% complete and reflects the final design vision. The backend is currently mocked using browser `localStorage` to provide full functionality for demonstration and testing purposes. The next stage is to replace the mock backend with a production database and authentication system.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                    <FeatureProgress name="Student & Staff Management" ui={100} code={70} functionality={80} />
                    <FeatureProgress name="Finance & Payroll" ui={100} code={60} functionality={70} />
                    <FeatureProgress name="Academics (Classes, Subjects, Timetable)" ui={100} code={65} functionality={75} />
                    <FeatureProgress name="Grading & Reports" ui={100} code={70} functionality={75} />
                    <FeatureProgress name="Communication (Messaging)" ui={100} code={50} functionality={60} />
                    <FeatureProgress name="SMSUP+ (On-Chain Credentials)" ui={100} code={40} functionality={50} />
                </div>
                </section>

                <section id="getting-started">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><Terminal className="text-primary"/>Getting Started</h2>
                    <p>To get the project running on your local machine, please follow these steps. This will set up the development environment and start the application.</p>
                    <h4 className="text-lg font-bold">1. Install Dependencies</h4>
                    <p>This project uses `npm` as its package manager. Open your terminal in the project root and run the following command to install all the necessary packages defined in `package.json`:</p>
                    <CodeBlock>npm install</CodeBlock>
                    
                    <h4 className="text-lg font-bold">2. Run the Development Server</h4>
                    <p>Once the dependencies are installed, you can start the Next.js development server. It runs in "turbopack" mode for maximum speed.</p>
                    <CodeBlock>npm run dev</CodeBlock>
                    <p>After running this command, your application should be accessible at <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a>. The server supports hot-reloading, so any changes you make to the code will be reflected in your browser instantly.</p>
                </section>
                
                <section id="architecture">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><LayoutGrid className="text-primary"/>Codebase Architecture</h2>
                <p>The application is built on a modern, robust, and scalable tech stack, chosen for its development efficiency and performance. Understanding this architecture is key to extending the platform.</p>
                    <ul className="space-y-4">
                        <li><strong className="text-foreground flex items-center gap-2"><Code2 className="h-4 w-4 text-primary shrink-0"/> Next.js and React</strong> The application uses Next.js with the App Router. This enables a powerful hybrid of server-rendered and client-rendered components, optimizing for both performance and interactivity. Most data fetching and display logic resides in Server Components (`page.tsx`), while interactive UI is handled by Client Components (`'use client'`).</li>
                        <li><strong className="text-foreground flex items-center gap-2"><Palette className="h-4 w-4 text-primary shrink-0"/> Tailwind CSS and Shadcn/UI</strong> The UI is built using Tailwind CSS for utility-first styling, allowing for rapid development without writing custom CSS. Components are sourced from Shadcn/UI, which provides a set of accessible and beautifully designed primitives that are fully customizable.</li>
                        <li><strong className="text-foreground flex items-center gap-2"><WandSparkles className="h-4 w-4 text-primary shrink-0"/> Genkit and Google AI</strong> AI-powered features, such as lesson plan generation and report card remarks, are implemented using Google's Genkit. Genkit provides a structured way to define AI "flows" with typed inputs and outputs, ensuring reliable and predictable interactions with language models.</li>
                        <li><strong className="text-foreground flex items-center gap-2"><HardDrive className="h-4 w-4 text-primary shrink-0"/> Mock Data Layer (`localStorage`)</strong> For this prototype, all data persistence is handled by a mock data abstraction layer in `src/lib/data-store.ts`. This layer uses the browser's `localStorage` to simulate a database, allowing the application to be fully stateful and interactive without any backend setup. This is a critical area to replace when moving to production.</li>
                    </ul>
                </section>
                
                <section id="production">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><Rocket className="text-primary"/>Going to Production: A Step-by-Step Guide</h2>
                <p>This prototype is fully functional but relies on mock data and browser-based storage. To transition to a production-ready, multi-user application, several key areas need to be upgraded. This guide outlines the necessary steps.</p>
                </section>
                
                <section id="auth">
                    <h3 className="flex items-center gap-2 text-xl font-bold"><KeyRound className="h-4 w-4 text-primary"/>1. Implement Production Authentication</h3>
                    <p className="border-l-4 border-yellow-400 pl-4 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md"><strong>Note:</strong> The current system is a placeholder for demonstration. For production, this entire flow must be replaced with a secure authentication provider like NextAuth.js or Lucia Auth.</p>
                    <p>The current login system is a mock implementation designed for demonstration purposes. It uses a hardcoded `testUsers` object in `src/app/auth/login/auth-form.tsx` and sets a simple flag in `localStorage`. This is insecure and must be replaced.</p>
                    <h4 className="text-lg font-bold">Action Items:</h4>
                    <ol>
                        <li><strong>Remove Mock Login:</strong> Delete or comment out the `testUsers` object in `auth-form.tsx`.</li>
                        <li><strong>Choose an Authentication Provider:</strong> Select and integrate a production-ready authentication service. Recommended options for Next.js include:
                            <ul>
                                <li><strong className="text-foreground">NextAuth.js (Auth.js):</strong> A full-featured, open-source authentication solution for Next.js. It supports OAuth (Google, GitHub, etc.), email/password, and credentials-based login.</li>
                                <li><strong className="text-foreground">Lucia Auth:</strong> A modern, framework-agnostic authentication library that gives you more control over your authentication flow.</li>
                            </ul>
                        </li>
                        <li><strong>Update `loginAction`:</strong> Refactor the `loginAction` server action in `src/app/auth/login/actions.ts` to call your chosen authentication provider's sign-in method instead of the current mock logic.</li>
                    </ol>
                </section>

                <section id="data">
                <h3 className="flex items-center gap-2 text-xl font-bold"><Database className="h-4 w-4 text-primary"/>2. Migrate to a Production Database</h3>
                <p className="border-l-4 border-yellow-400 pl-4 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md"><strong>Note:</strong> `data-store.ts` uses browser `localStorage` as a simulated database. This is for demonstration purposes only. For production, all functions in this file must be rewritten to interact with a real database like PostgreSQL using an ORM like Prisma.</p>
                <p>The most critical step is replacing the `localStorage`-based mock data layer with a real, persistent database. The application is architected to make this transition smooth by centralizing all data operations in `src/lib/data-store.ts`.</p>
                <h4 className="text-lg font-bold">Action Items:</h4>
                <ol>
                    <li>
                        <strong>Choose a Database and ORM:</strong>
                        <ul>
                            <li><strong className="text-foreground">Database:</strong> PostgreSQL is a highly recommended, robust, and scalable open-source database.</li>
                            <li><strong className="text-foreground">ORM (Object-Relational Mapper):</strong> <strong className="text-foreground">Prisma</strong> is an excellent choice for Next.js applications. It provides strong type-safety, an intuitive schema definition, and a powerful query builder.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Set up Prisma:</strong>
                        <ol type="a" className="list-alpha">
                            <li>Install Prisma: <CodeBlock>npm install prisma --save-dev</CodeBlock></li>
                            <li>Initialize Prisma: <CodeBlock>npx prisma init --datasource-provider postgresql</CodeBlock></li>
                            <li>Define your database schema in `prisma/schema.prisma`. You can model this after the TypeScript types found in the `src/lib/*.ts` files (e.g., `Student`, `Staff`, `School`).</li>
                            <li>Run `npx prisma db push` to sync your schema with your database.</li>
                        </ol>
                    </li>
                    <li>
                        <strong>Refactor `data-store.ts`:</strong>
                        <p>Go through each function in `src/lib/data-store.ts` and replace the `localStorage` logic with Prisma Client queries.
                        <br />For example, `getStudents` would change from this:</p>
                        <CodeBlock>{`export async function getStudents(): Promise<Student[]> {
    return getFromStorage<Student[]>('students', initialStudents);
}`}</CodeBlock>
                        <p>To this:</p>
                        <CodeBlock>{`import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getStudents(): Promise<Student[]> {
    return await prisma.student.findMany();
}`}</CodeBlock>
                    </li>
                </ol>
                </section>

                <section id="deployment">
                    <h3 className="flex items-center gap-2 text-xl font-bold"><Cloud className="h-4 w-4 text-primary"/>3. Deploy the Application</h3>
                    <p>Once you have a production-ready database and authentication, you can deploy the application. Here are three recommended deployment paths.</p>
                    <div className="mt-6 space-y-4 not-prose">
                        <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground fill-current"><title>Vercel</title><path d="M12 1.5l12 21H0L12 1.5z" /></svg>
                            <h4 className="font-semibold text-foreground">Option A: Deploy to Vercel (Recommended)</h4>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert text-muted-foreground">
                            <p>Vercel is the creator of Next.js and provides the most seamless deployment experience.</p>
                            <ol>
                            <li>Push your code to a Git repository (GitHub, GitLab, Bitbucket).</li>
                            <li>Go to the <a href="https://vercel.com/new">Vercel dashboard</a> and import your Git repository.</li>
                            <li>Configure your environment variables (e.g., `DATABASE_URL`, NextAuth secrets) in the Vercel project settings.</li>
                            <li>Vercel will automatically build and deploy your application. Subsequent `git push` commands will trigger automatic deployments.</li>
                            </ol>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Container />
                            <h4 className="font-semibold text-foreground">Option B: Deploy with Docker (Self-hosting / Cloud)</h4>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert text-muted-foreground">
                            <p>A `Dockerfile` is included in this project for building a production-optimized container image. This is ideal for deploying on any cloud provider (AWS, GCP, Azure) or your own servers.</p>
                            <ol>
                            <li>Build the Docker image: <CodeBlock>docker build -t ugbekun-app .</CodeBlock></li>
                            <li>Run the container, passing in your environment variables: <CodeBlock>{`docker run -p 3000:3000 \\
  -e DATABASE_URL="your-database-url" \\
  ugbekun-app`}</CodeBlock></li>
                            </ol>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Server />
                            <h4 className="font-semibold text-foreground">Option C: Deploy on a Node.js Server</h4>
                        </CardHeader>
                        <CardContent className="prose prose-neutral dark:prose-invert text-muted-foreground">
                            <p>The Next.js build output is configured to be a standalone server. You can run this directly on any server with Node.js installed.</p>
                            <ol>
                            <li>Run `npm run build`. This creates a `.next/standalone` directory.</li>
                            <li>Copy the `.next/standalone` directory to your server. Also copy the `.next/static` and `public` folders.</li>
                            <li>On your server, navigate into the directory and start the application:
                            <CodeBlock>{`cd standalone
PORT=3000 node server.js`}</CodeBlock></li>
                            <li>It's recommended to use a process manager like <strong className="text-foreground">PM2</strong> to keep the application running: <CodeBlock>pm2 start server.js --name "ugbekun-app"</CodeBlock></li>
                            </ol>
                        </CardContent>
                        </Card>
                    </div>
                </section>

                <section id="ai-genkit">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><WandSparkles className="text-primary"/>AI and Genkit Integration</h2>
                <p>The AI capabilities of this application are powered by <strong className="text-foreground">Google's Genkit</strong>. Genkit is used to create "flows" that orchestrate calls to large language models (LLMs) for various tasks. All AI-related code is located in the `src/ai/` directory.</p>
                <h4 className="text-lg font-bold">Key Files</h4>
                <ul className="list-disc pl-5">
                    <li>`src/ai/genkit.ts`: The central Genkit configuration file where the `googleAI` plugin is initialized.</li>
                    <li>`src/ai/flows/*.ts`: This directory contains all the AI flows. Each file typically exports an async function that can be called from server components or other server-side logic. For example, `generate-lesson-plan.ts` contains the logic for creating lesson plans.</li>
                    <li>`src/ai/dev.ts`: A development server file used for running and testing Genkit flows locally with `npm run genkit:dev`.</li>
                </ul>
                <h4 className="text-lg font-bold">How it Works</h4>
                <p>A typical AI flow (e.g., `generate-lesson-plan.ts`) defines an input schema (using Zod), an output schema, and a prompt. The flow takes structured input, passes it to an LLM via the prompt, and receives structured JSON output, ensuring reliability and type-safety. You can modify the prompts in these files to change the AI's behavior or create new flows for new features.</p>
                </section>

                <section id="ui-styling">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><Palette className="text-primary"/>UI and Styling</h2>
                <p>The user interface is built with <strong className="text-foreground">Shadcn/UI</strong>, which provides a set of accessible and reusable components built on top of <strong className="text-foreground">Tailwind CSS</strong>. This combination allows for rapid UI development while maintaining a consistent and professional look.</p>
                <h4 className="text-lg font-bold">Key Files and Philosophy</h4>
                <ul className="list-disc pl-5">
                    <li>`src/app/globals.css`: Contains the base Tailwind directives and the CSS variables (`--primary`, `--background`, etc.) that define the application's color theme for both light and dark modes.</li>
                    <li>`tailwind.config.ts`: The Tailwind CSS configuration file where you can extend the default theme.</li>
                    <li>`src/components/ui`: This directory contains all the base Shadcn/UI components like `Button`, `Card`, `Input`, etc. These are designed to be composed into more complex components.</li>
                </ul>
                <p>The styling philosophy is to rely on utility classes from Tailwind CSS as much as possible. When creating new components, compose them from the primitives available in `src/components/ui`. To change the color scheme, you should only need to modify the HSL values in `globals.css`.</p>
                </section>

                <section id="smsup">
                <h2 className="flex items-center gap-3 text-2xl font-bold"><ShieldCheck className="text-primary"/>SMSUP+ Verifiable Credentials</h2>
                <p className="border-l-4 border-yellow-400 pl-4 text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md"><strong>Note:</strong> The current implementation of SMSUP+ is a high-fidelity simulation. It uses `localStorage` to mimic the behavior of a blockchain but does not interact with a real distributed ledger. The workflows are designed to be directly translatable to a smart contract-based system.</p>
                <p><strong className="text-foreground">SMSUP+ (School Management System on Ugbekun Platform)</strong> is a cutting-edge feature that allows schools to issue on-chain, verifiable academic credentials. This leverages blockchain technology to combat credential fraud and streamline verification for universities and employers.</p>
                <h4 className="text-lg font-bold">How It Works (Prototype)</h4>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>A school enables SMSUP+ in their settings (`/admin/settings`). This sets a `verified` flag in their school data.</li>
                    <li>The system uses `localStorage` to manage a mock list of "verifiable credentials" (`src/lib/credentials-data.ts`). A student can toggle the `isPublic` flag for their credentials.</li>
                    <li>Third parties can use the public verification portal (`/credentials`) to look up a student's unique ID.</li>
                    <li>If the student has public credentials, the portal displays them. This entire flow is currently mocked and does not interact with a real blockchain.</li>
                </ol>
                <h4 className="text-lg font-bold">Making it Functional</h4>
                <p>To make this feature production-ready, you would need to:</p>
                <ul className="list-disc pl-5">
                    <li>Integrate a wallet connection library (e.g., viem, ethers.js).</li>
                    <li>Write and deploy smart contracts to an Ethereum-compatible blockchain (e.g., Polygon, Base, Celo) to handle the minting and verification of credentials.</li>
                    <li>Update the `checkResultWithPin` and other related flows in `src/ai/flows` to interact with your smart contracts instead of the mock data store.</li>
                </ul>
                </section>
            </main>
        </div>
    )
}

// //////////////////////////////////////////////////////////////////
// UI/UX GUIDE COMPONENTS
// //////////////////////////////////////////////////////////////////

const PageCard = ({ path, title, description, functionality, role }: { path: string, title: string, description: string, functionality: string, role: Role }) => {
    const { showPreloader } = useAuth();

    const handleViewPage = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        showPreloader(path.includes('[') ? path.replace(/\[.*?\]/, 'stf-001') : path);
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="font-mono text-xs">{path}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground">{description}</p>
                 <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Functionality and Behavior</p>
                    <p className="text-sm text-muted-foreground">{functionality}</p>
                </div>
            </CardContent>
             <div className="p-4 pt-0">
                <Button variant="secondary" className="w-full" onClick={handleViewPage}>
                    View Live Page <Eye className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
};

const ColorSwatch = ({ name, hsl, hex }: { name: string, hsl: string, hex: string }) => (
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: `hsl(${hsl})` }}></div>
        <div>
            <div className="font-semibold capitalize">{name}</div>
            <div className="text-xs text-muted-foreground font-mono">HSL: {hsl}</div>
            <div className="text-xs text-muted-foreground font-mono">HEX: {hex}</div>
        </div>
    </div>
);

function UiUxGuide({ searchTerm }: { searchTerm: string }) {
    const filteredPages = useMemo(() => {
        if (!searchTerm) return pageRegistry;
        return Object.entries(pageRegistry)
            .filter(([_, page]) => 
                page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                page.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                page.functionality.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    }, [searchTerm]);

    const pageSections = [
        { id: "public-pages", title: "Public Pages and User Flows", icon: <Eye className="h-8 w-8 text-primary"/>, description: "These pages are accessible to anyone and serve as the main entry points and public-facing features of the platform.", roles: [] },
        { id: "admin-dashboard", title: "Administrator Dashboard", icon: <Shield className="h-8 w-8 text-primary"/>, description: "The central command center for school management, designed for power and efficiency.", roles: ['admin'] },
        { id: "teacher-dashboard", title: "Teacher Dashboard", icon: <GraduationCap className="h-8 w-8 text-primary"/>, description: "A streamlined interface with tools to enhance instruction and simplify administrative tasks.", roles: ['teacher'] },
        { id: "student-dashboard", title: "Student Dashboard", icon: <User className="h-8 w-8 text-primary"/>, description: "A personal and engaging hub designed to keep students organized and motivated in their academic life.", roles: ['student'] },
        { id: "parent-dashboard", title: "Parent/Guardian Dashboard", icon: <HeartHandshake className="h-8 w-8 text-primary"/>, description: "A comprehensive portal for parents to stay informed and engaged with their child's school journey.", roles: ['parent'] },
        { id: "super-admin-dashboard", title: "Super Admin Dashboard", icon: <Star className="h-8 w-8 text-primary"/>, description: "The master control panel for platform oversight, school management, and global analytics.", roles: ['super-admin'] },
    ];
    
    return (
        <div className="py-16 space-y-24">
                 <section id="design-system">
                    <h2 className="text-3xl font-bold tracking-tight text-center">Design System</h2>
                     <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">The foundational visual and interactive elements that create a cohesive user experience across the entire platform.</p>
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                             <h3 className="font-semibold text-xl flex items-center gap-2 mb-6"><Palette className="h-5 w-5 text-primary"/> Color Palette</h3>
                            <div className="space-y-4">
                                <ColorSwatch name="Primary (Ugbekun Blue Dark)" hsl="222 70% 22%" hex="#122B5E" />
                                <ColorSwatch name="Secondary (Ugbekun Blue Light)" hsl="229 100% 92%" hex="#dbeafe" />
                                <ColorSwatch name="Background" hsl="228 10% 97%" hex="#f2f3f7" />
                                <ColorSwatch name="Foreground" hsl="222 70% 22%" hex="#122B5E" />
                                <ColorSwatch name="Card" hsl="228 10% 100%" hex="#ffffff" />
                                <ColorSwatch name="Muted" hsl="229 100% 92%" hex="#dbeafe" />
                            </div>
                        </div>
                         <div>
                             <h3 className="font-semibold text-xl flex items-center gap-2 mb-6"><CaseSensitive className="h-5 w-5 text-primary"/> Typography</h3>
                             <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Headings</p>
                                    <p className="font-semibold text-foreground">Font: Poppins</p>
                                    <div className="mt-2 space-y-2">
                                        <h1 className="text-4xl font-semibold tracking-tight">Display (4xl)</h1>
                                        <h2 className="text-3xl font-semibold tracking-tight">Heading 1 (3xl)</h2>
                                        <h3 className="text-2xl font-semibold tracking-tight">Heading 2 (2xl)</h3>
                                        <h4 className="text-xl font-semibold tracking-tight">Heading 3 (xl)</h4>
                                    </div>
                                </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">Body and UI Text</p>
                                    <p className="font-semibold text-foreground">Font: Inter</p>
                                    <div className="mt-2 space-y-2">
                                        <p>This is standard body text. Used for descriptions and general content. It is designed for maximum readability on digital screens.</p>
                                        <p className="text-sm text-muted-foreground">This is muted text, used for secondary information, descriptions, and helper text under form fields.</p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                 </section>

                <section>
                    <h2 className="text-3xl font-bold tracking-tight text-center">Layout and Core Principles</h2>
                    <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">The core architectural decisions that define the user experience across all dashboards.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><LayoutGrid className="h-5 w-5 text-primary"/> Dashboard Structure</h3>
                            <p className="text-sm text-muted-foreground mt-2">All dashboards follow a consistent hierarchy. A prominent <strong className="text-foreground">Welcome Card</strong> at the top provides contextual greetings and quick actions. This is followed by a row of <strong className="text-foreground">Key Performance Indicators (KPIs)</strong> for at-a-glance metrics. The main content area is then populated with detailed charts, tables, and lists relevant to the user's role.</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Workflow className="h-5 w-5 text-primary"/> Interactive Elements</h3>
                            <p className="text-sm text-muted-foreground mt-2">Interactivity is designed to be intuitive. <strong className="text-foreground">Buttons</strong> are clearly labeled, with primary actions using a solid fill. <strong className="text-foreground">Data tables</strong> are sortable, and rows often serve as clickable links to detail pages. <strong className="text-foreground">Dialogs (Modals)</strong> are used for focused tasks like adding or editing data to avoid disorienting the user with a full page navigation.</p>
                        </Card>
                    </div>
                </section>

                 {pageSections.map(section => {
                    const sectionPages = Object.entries(filteredPages).filter(([_, page]) => 
                        section.roles.length === 0 ? page.role.length === 0 : page.role.some(r => section.roles.includes(r))
                    );
                    if (sectionPages.length === 0) return null;

                    return (
                        <section key={section.id} id={section.id}>
                            <h2 className="text-3xl font-bold tracking-tight text-center flex items-center justify-center gap-3">{section.icon}{section.title}</h2>
                            <p className="text-muted-foreground text-center mt-2 max-w-2xl mx-auto">{section.description}</p>
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sectionPages.map(([path, { title, description, functionality, role }]) => (
                                    <PageCard key={path} path={path} title={title} description={description} functionality={functionality} role={role[0] || 'student'} />
                                ))}
                            </div>
                        </section>
                    )
                 })}
                
            </div>
    )
}

// //////////////////////////////////////////////////////////////////
// USER WORKFLOWS GUIDE COMPONENTS
// //////////////////////////////////////////////////////////////////
type WorkflowStep = {
    icon: ReactElement;
    title: string;
    description: string;
    color: string;
}

type WorkflowDiagramProps = {
    title: string;
    description: string;
    icon: ReactElement;
    steps: WorkflowStep[];
}

const ArrowConnector = () => (
    <div className="relative flex items-center justify-center flex-1 h-full min-w-[3rem] lg:min-w-[4rem] opacity-30 group-hover:opacity-100 transition-opacity">
        <svg width="100%" height="24" viewBox="0 0 50 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12 H40" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M38 7 l5 5 l-5 5" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        </svg>
    </div>
)

function WorkflowDiagram({ title, description, icon, steps }: WorkflowDiagramProps) {
    return (
        <section className="group">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>
                </div>
            </div>

             <div className="mt-8 relative overflow-x-auto pb-4">
                 <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-y-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col lg:flex-row items-center w-full lg:w-auto lg:min-w-[240px] lg:flex-1">
                            <Card className="p-4 w-full h-full text-center transition-all border-2 border-transparent hover:border-primary/40 hover:shadow-lg">
                                 <div className={`w-10 h-10 rounded-lg grid place-items-center mx-auto ${step.color}`}>
                                    {step.icon}
                                </div>
                                <h4 className="font-semibold mt-3 text-sm">{step.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                            </Card>
                            
                            {index < steps.length - 1 && (
                                <ArrowConnector />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function UserWorkflowsGuide({ searchTerm }: { searchTerm: string }) {
     const filteredWorkflows = useMemo(() => {
        if (!searchTerm) return allWorkflows;
        return allWorkflows.filter(workflow => 
            workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
         <div className="py-16 space-y-20">
            {filteredWorkflows.map(workflow => (
                <WorkflowDiagram key={workflow.title} {...workflow} />
            ))}
             {filteredWorkflows.length === 0 && (
                <p className="text-center text-muted-foreground">No workflows match your search.</p>
            )}
        </div>
    )
}

// //////////////////////////////////////////////////////////////////
// MAIN DOCUMENTATION PAGE COMPONENT
// //////////////////////////////////////////////////////////////////

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("development");

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (activeTab !== 'development') return;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: mainContent, rootMargin: '-20% 0px -80% 0px', threshold: 0.1 }
    );

    const elements = mainContent.querySelectorAll('section[id]');
    elements.forEach((el) => observer.current?.observe(el));

    return () => {
      elements.forEach((el) => {
          if (observer.current) {
              observer.current.unobserve(el);
          }
      });
    };
  }, [activeTab]);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <header className="max-w-3xl mx-auto text-center">
          <h1 className="display text-4xl sm:text-5xl tracking-tight font-semibold text-foreground">
            Ugbekun Documentation
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive guide to the platform architecture, features, UI/UX, and development roadmap.
          </p>
        </header>

        <Tabs defaultValue="development" value={activeTab} onValueChange={setActiveTab} className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                 <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto sm:mx-0 h-12">
                    <TabsTrigger value="development" className="h-full flex items-center gap-2"><Code2 className="h-5 w-5" /> Development</TabsTrigger>
                    <TabsTrigger value="ui-ux" className="h-full flex items-center gap-2"><Type className="h-5 w-5" /> UI/UX Guide</TabsTrigger>
                    <TabsTrigger value="workflows" className="h-full flex items-center gap-2"><Workflow className="h-5 w-5" /> Workflows</TabsTrigger>
                </TabsList>
                <div className="relative w-full max-w-xs">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documentation..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <Separator className="my-8"/>

            <TabsContent value="development" id="main-content">
                <DevelopmentGuide sections={devSections} activeSection={activeSection} searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="ui-ux" className="bg-muted/30 -mx-4 -my-8 px-4 sm:px-6 lg:px-8">
                <UiUxGuide searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="workflows">
                <UserWorkflowsGuide searchTerm={searchTerm} />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
