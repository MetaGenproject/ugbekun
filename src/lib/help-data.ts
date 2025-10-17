
import type { iconMap } from './notifications-data';

export type HelpContent = {
    title: string;
    description: string;
    icon: keyof typeof iconMap;
}

export const helpData: Record<string, HelpContent> = {
    "/admin/dashboard": { title: "Dashboard", description: "This is your main command center. Here you can see key performance indicators (KPIs) like student and teacher counts, total revenue, and upcoming events. You can also view charts for financial overviews, academic performance, and see a list of recently added students.", icon: "LayoutDashboard" },
    "/admin/my-school": { title: "My School", description: "This page allows you to view and manage your school's public profile. The information here is what parents and prospective students will see when they view your school on the platform.", icon: "School" },
    "/admin/admissions": { title: "Admissions", description: "Manage your entire admissions pipeline. This Kanban-style board lets you track prospective students from initial enquiry, through application and screening, all the way to final enrollment. Use the menus on each applicant to update their status.", icon: "UserPlus" },
    "/admin/students": { title: "Students", description: "This is the complete directory of all students in your school. You can search for specific students, add new ones using the 'Add Student' button, edit their profiles, or send direct messages.", icon: "Users" },
    "/admin/hr": { title: "Staff (HR)", description: "Manage all teaching and non-teaching staff members in your school. You can add new staff, edit their profiles and assignments, and view detailed information including payroll and leave.", icon: "Briefcase" },
    "/admin/classes": { title: "Classes", description: "Organize and manage all academic classes. You can create new classes, assign form teachers, and see the number of students and subjects associated with each class.", icon: "Building2" },
    "/admin/subjects": { title: "Subjects", description: "Define and manage the academic subjects offered at your school. Assign subjects to specific teachers and categorize them (e.g., Science, Arts).", icon: "BookCopy" },
    "/admin/timetable": { title: "Timetable", description: "Create and manage schedules for all classes. You can manually edit the timetable or use the 'Generate with AI' feature to create a conflict-free schedule automatically.", icon: "CalendarClock" },
    "/admin/examinations": { title: "Examinations", description: "Schedule school-wide exams, set their dates, and manage the grading status. Once all grades are in, you can publish the results for students and parents to see.", icon: "ShieldAlert" },
    "/admin/results": { title: "Results Analysis", description: "Get a high-level view of your school's academic performance. This page shows the average scores by class and by subject, helping you identify trends and areas for improvement.", icon: "BarChartHorizontal" },
    "/admin/reports": { title: "Report Cards", description: "Use the AI-powered generator to create insightful, narrative remarks for student report cards. You can also preview and manage the final report card designs from here.", icon: "FileBarChart" },
    "/admin/reports/designer": { title: "Report Card Designer", description: "Customize the look, feel, and content of your school's official report cards. Adjust branding, grading scales, and the behavioral traits that appear on the reports.", icon: "SlidersHorizontal" },
    "/admin/finance": { title: "Finance", description: "This is your complete financial hub. Track income vs. expenses on the overview, manage all fee transactions, create and send invoices, and log operational expenses.", icon: "Wallet" },
    "/admin/hr/payroll": { title: "Payroll", description: "Process monthly salaries for all active staff members with a single click. The system automatically calculates the total amount and creates transaction records in the finance module.", icon: "HandCoins" },
    "/admin/library": { title: "Library", description: "Manage your school's library inventory. You can add new books, update the number of copies, and track availability.", icon: "Library" },
    "/admin/transport": { title: "Transport", description: "Organize your school's bus routes. Here you can add or edit routes, assign drivers and buses, and monitor the status of each route.", icon: "Route" },
    "/admin/hostel": { title: "Hostels", description: "Manage student residency. Assign students to specific hostels and rooms, and keep track of their check-in and check-out status.", icon: "Hotel" },
    "/admin/events": { title: "Events Calendar", description: "Create, manage, and publish school-wide events. View all events in a calendar format or as a list, and add new ones for the entire school to see.", icon: "CalendarDays" },
    "/admin/messages": { title: "Communications", description: "Use this central hub to send messages and announcements to individual students, parents, teachers, or groups. Your complete chat history is available here.", icon: "MessageSquareMore" },
    "/admin/history": { title: "Audit Log", description: "This page provides a complete, searchable history of all significant actions taken by users in your workspace, ensuring accountability and transparency.", icon: "History" },
    "/admin/settings": { title: "Settings", description: "Configure your school's profile, academic session dates, appearance, and manage your subscription plan. This is where you can also activate advanced features like SMSUP+.", icon: "Settings" },

    "/teacher/dashboard": { title: "Dashboard", description: "This is your daily command center. See your upcoming classes at a glance, view assignments that need grading, and check recent student activity to prepare for your day.", icon: "LayoutDashboard" },
    "/teacher/classes": { title: "My Classes", description: "View a summary of the classes and subjects you are assigned to. This page gives you a quick overview of student numbers and syllabus coverage for each class.", icon: "BookCopy" },
    "/teacher/attendance": { title: "Attendance", description: "Take and manage daily attendance for your classes. Select a class and mark each student as present, late, or absent. Your records are saved automatically.", icon: "CheckCheck" },
    "/teacher/students": { title: "My Students", description: "A directory of all the students in your assigned classes. You can quickly search for a student and click to view their detailed academic profile.", icon: "Users" },
    "/teacher/subjects": { title: "My Subjects", description: "Manage the curriculum for the subjects you teach. You can add, edit, or remove syllabus topics and mark them as complete to track your progress.", icon: "BookMarked" },
    "/teacher/results/entry": { title: "Results Entry", description: "Enter student scores for continuous assessments (CAs) and exams. The system automatically calculates the total score as you enter the data.", icon: "FileDigit" },
    "/teacher/grading": { title: "Grading Center", description: "This is your hub for grading all student submissions for both assignments and exams. Select an item to see all student work and provide scores and feedback.", icon: "Edit" },
    "/teacher/examinations": { title: "Examinations", description: "View all examinations you have scheduled. From here, you can enter grades for completed exams or publish the final results to students and parents.", icon: "ShieldAlert" },
    "/teacher/resources": { title: "Resources", description: "Upload and manage learning materials for your students. You can add PDFs, videos, documents, or external links to share with your classes.", icon: "BookHeadphones" },
    "/teacher/planner": { title: "AI Lesson Planner", description: "Use the power of AI to create detailed and engaging lesson plans. Simply provide the topic, subject, and objectives, and the AI will generate a structured plan for you.", icon: "WandSparkles" },
    "/teacher/assessment": { title: "Student Assessment", description: "Rate students on non-academic skills. Your ratings on traits like 'Attentiveness' and skills like 'Public Speaking' will appear on their end-of-term report cards.", icon: "ScanFace" },
    "/teacher/messages": { title: "Messages", description: "Communicate securely with parents, students, and other staff members. All your conversations are organized and easily accessible here.", icon: "MessageSquareMore" },
    "/teacher/clock-in": { title: "Staff Clock-In", description: "This is the secure kiosk for staff attendance. Staff can clock in or out by presenting their unique QR code to the camera or by using a staff ID and a one-time passcode provided by an admin.", icon: "Clock3" },
    "/teacher/settings": { title: "Settings", description: "Manage your personal profile information and set your notification preferences to control how and when you receive alerts.", icon: "Settings" },

    "/student/dashboard": { title: "Dashboard", description: "This is your personal academic hub. See your key stats like GPA, view upcoming assignments, and check your calendar for important events.", icon: "LayoutDashboard" },
    "/student/grades": { title: "My Grades", description: "Track your academic performance. This page shows your recent grades, teacher feedback, and a chart of your performance over time.", icon: "Award" },
    "/student/subjects": { title: "Subjects", description: "Explore all the subjects you are enrolled in. Click on a subject to view its syllabus, track your progress, and access learning materials.", icon: "BookOpen" },
    "/student/assignments": { title: "Assignments", description: "Stay organized with a complete list of your homework and projects. You can mark items as complete and even add your own personal tasks and reminders.", icon: "NotebookText" },
    "/student/examinations": { title: "Examinations", description: "View your schedule for upcoming exams. When an exam is live, you can start it from this page. After it's graded, you can also view your results here.", icon: "ShieldAlert" },
    "/student/profile": { title: "My Profile", description: "View your detailed academic profile, including your performance trends in different areas. This is a summary of your journey at the school.", icon: "User" },
    "/student/calendar": { title: "Calendar", description: "Stay up-to-date with your personal and school-wide event calendar. Check for assignment due dates, school holidays, and other important events.", icon: "CalendarDays" },
    "/student/messages": { title: "Messages", description: "Communicate with your teachers and classmates. Ask questions, get help, and stay connected with your school community.", icon: "MessageSquareMore" },
    "/student/community": { title: "Community", description: "Join clubs, societies, and other school groups. Participate in discussions and connect with students who share your interests.", icon: "Users" },
    "/student/my-credentials": { title: "My Credentials", description: "Manage your official, on-chain academic records issued by the school. You have full control over which credentials are made publicly visible on your profile.", icon: "ShieldCheck" },
    "/student/resources": { title: "Resources", description: "Access the school's digital library. Find lecture notes, videos, and other learning materials uploaded by your teachers to help you succeed.", icon: "BookHeadphones" },
    "/student/settings": { title: "Settings", description: "Customize your public profile, change your theme, and manage how you receive notifications from the platform.", icon: "Settings" },

    "/parent/dashboard": { title: "Dashboard", description: "This is your one-stop overview of your child's academic life. See their GPA, attendance, recent grades, and upcoming assignments at a glance.", icon: "LayoutDashboard" },
    "/parent/children": { title: "My Children", description: "If you have multiple children enrolled in the school, use this page to switch between their individual profiles and dashboards.", icon: "Users" },
    "/parent/payments": { title: "Fees & Payments", description: "Manage all financial matters here. View outstanding invoices, make secure online payments for school fees, and see your full payment history.", icon: "WalletCards" },
    "/parent/assignments": { title: "Assignments", description: "Keep track of your child's workload. This page shows a list of their upcoming assignments and due dates, as well as tasks they have already completed.", icon: "NotebookText" },
    "/parent/messages": { title: "Messages", description: "Communicate directly and securely with your child's teachers and school administrators. Ask questions, get updates, and stay involved.", icon: "MessageSquareMore" },
    "/parent/attendance": { title: "Attendance", description: "View your child's complete attendance record for the term. The calendar view shows which days they were present, late, or absent.", icon: "CalendarCheck2" },
    "/parent/examinations": { title: "Examinations", description: "See your child's exam schedule and view their results once they have been published by the teacher.", icon: "ShieldAlert" },
    "/parent/grades": { title: "Grades", description: "Get a detailed look at your child's academic performance, including recent grades, teacher feedback, and performance trends over time.", icon: "Award" },
    "/parent/calendar": { title: "School Calendar", description: "Stay informed about all important school events, holidays, PTA meetings, and other key dates for the academic year.", icon: "CalendarDays" },
    "/parent/transport": { title: "Transport", description: "If your child uses the school bus, you can track its status and get information about the route and driver here.", icon: "Bus" },
    "/parent/settings": { title: "Settings", description: "Manage your personal profile information and customize your notification preferences to stay informed in the way that works best for you.", icon: "Settings" },

    "/super-admin/dashboard": { title: "Platform Dashboard", description: "This is the master control panel. Get a high-level overview of all schools on the platform, track key metrics like revenue and sign-ups, and see recent platform-wide activity.", icon: "LayoutDashboard" },
    "/super-admin/cms/content": { title: "Content Management", description: "Manage the public-facing website. Edit the features, testimonials, and FAQ sections that appear on the landing page for prospective customers.", icon: "HardDrive" },
    "/super-admin/cms/schools": { title: "Schools", description: "View, manage, and edit all schools operating on the Ugbekun platform. You can onboard new schools or deactivate existing ones from this dashboard.", icon: "Building" },
    "/super-admin/team": { title: "Team Management", description: "Manage your internal Ugbekun team members. Invite new staff, edit their roles and permissions, and manage their access to the super admin dashboard.", icon: "Users2" },
    "/super-admin/analytics": { title: "Platform Analytics", description: "Dive deep into platform-wide data. Analyze growth trends, revenue by subscription plan, and user engagement metrics to make informed business decisions.", icon: "BarChartHorizontal" },
    "/super-admin/subscriptions": { title: "Subscriptions", description: "Get a financial overview of the platform. View revenue breakdowns by subscription plan and manage the different tiers offered to schools.", icon: "CreditCard" },
    "/super-admin/support": { title: "Support", description: "This is where you would handle escalated support tickets from school administrators, ensuring high-priority issues are resolved quickly.", icon: "Ticket" },
    "/super-admin/history": { title: "Platform Audit Log", description: "View a complete, immutable log of all major actions taken across the entire platform by both super admins and school admins for security and compliance.", icon: "History" },
    "/super-admin/settings": { title: "Platform Settings", description: "Configure global settings for the entire Ugbekun platform, including branding, default integrations, and subscription plan details.", icon: "Settings" },

    "/documentation": { title: "Documentation", description: "This is the central knowledge base for the Ugbekun platform, containing comprehensive guides for developers, administrators, and end-users.", icon: "BookHeart" },
    "/": { title: "Welcome to Ugbekun", description: "This is the main public-facing landing page, designed to attract new schools and showcase the platform's features and benefits.", icon: "Sparkles" },
    "/onboarding": { title: "School Onboarding", description: "The multi-step wizard for new school administrators to create their workspace, configure initial settings, and launch their school on the platform.", icon: "Rocket" },
    "/login": { title: "Sign In", description: "The universal sign-in portal for all user roles. Select your role (Admin, Teacher, etc.) to access your respective dashboard.", icon: "KeyRound" },
    "/credentials": { title: "Verify a Credential", description: "Use this public portal to instantly confirm the authenticity of any Ugbekun-issued academic credential by entering a student's unique on-chain ID.", icon: "ShieldCheck" },
    "/p": { title: "Public Credential", description: "You are viewing a student's public, on-chain academic profile. This page displays only the credentials that the student or their guardian has chosen to make publicly verifiable.", icon: "Shield" },
    "/smsup": { title: "SMSUP+", description: "Learn about the School Management System on Ugbekun Platform (SMSUP+), our revolutionary feature for creating secure, on-chain academic credentials.", icon: "Fingerprint" }
};

    