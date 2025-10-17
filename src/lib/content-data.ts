

import type { iconMap } from './notifications-data';

export type LandingPageFeature = {
    id: string;
    icon: keyof typeof iconMap;
    title: string;
    description: string;
}

export const initialLandingPageFeatures: LandingPageFeature[] = [
  {
    id: "feat-1",
    icon: "Users",
    title: "Unified Profiles",
    description: "Centralize students, guardians, staff, and classes with quick search and bulk actions.",
  },
  {
    id: "feat-2",
    icon: "Wallet",
    title: "Finance & Fees",
    description: "Automate invoicing, discounts, and receipts with transparent reporting.",
  },
  {
    id: "feat-3",
    icon: "BarChart2",
    title: "Analytics",
    description: "Real-time dashboards for attendance, performance, and finance.",
  },
  {
    id: "feat-4",
    icon: "MessageSquare",
    title: "Communication",
    description: "Message students and guardians via email, SMS, or push notifications.",
  },
  {
    id: "feat-5",
    icon: "CalendarClock",
    title: "Timetable & Exams",
    description: "Build timetables, schedule exams, and publish results securely.",
  },
  {
    id: "feat-6",
    icon: "Building2",
    title: "Multi-Campus",
    description: "Operate multiple branches with role-based access and permissions.",
  },
];


export type Testimonial = {
    id: string;
    quote: string;
    name: string;
    role: string;
    avatarId: string;
}

export const initialTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote: "Switching to Ugbekun cut our admin time in half and gave us real-time visibility into fees and attendance.",
    name: "Adaeze O.",
    role: "Principal, Unity College",
    avatarId: 'testimonial-1'
  },
  {
    id: "testimonial-2",
    quote: "Our teachers love the gradebook and messaging. Parents are more engaged than ever.",
    name: "Samuel T.",
    role: "Head of Academics",
    avatarId: 'testimonial-2'
  },
  {
    id: "testimonial-3",
    quote: "Billing is seamless. Automated reminders alone paid for the subscription.",
    name: "Chinwe B.",
    role: "Bursar, Cedar High",
    avatarId: 'testimonial-3'
  },
    {
    id: "testimonial-4",
    quote: "The analytics dashboard is a game-changer for tracking student performance across all our branches.",
    name: "Femi A.",
    role: "Director, Bright Futures Group",
    avatarId: 'testimonial-4'
  },
  {
    id: "testimonial-5",
    quote: "As a teacher, having all student info, grades, and communication in one place is incredibly efficient.",
    name: "John K.",
    role: "Teacher, Maple Grove",
    avatarId: 'testimonial-5'
  },
];

export type FAQItem = {
    id: string;
    question: string;
    answer: string;
}

export const initialFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: "Can we import data from our current system?",
    answer: "Yes. We offer guided imports for students, guardians, classes, and historical finances. Our team can assist with custom mappings.",
  },
  {
    id: 'faq-2',
    question: "Is Ugbekun compliant with local data regulations?",
    answer: "We follow strict security practices, data residency options, and provide DPA on request. Role-based access ensures least-privilege defaults.",
  },
  {
    id: 'faq-3',
    question: "How does pricing work for multiple campuses?",
    answer: "Contact us for a tailored quote. Growth and Enterprise plans support multiple branches with consolidated billing and analytics.",
  },
];
