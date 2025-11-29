

import { BookOpen, CalendarCheck, Edit, Users } from "lucide-react";

export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  department: "Academics" | "Administration" | "Health & Wellness" | "Operations";
  status: "Active" | "On Leave" | "Inactive";
  avatar: string;
  salary: number;
  teacherType?: 'Form Teacher' | 'Subject Teacher' | 'Both';
  formClass?: string;
  assignedClasses: {
    class: string;
    subject: string;
    students: number;
  }[];
  performance: number; // Overall performance metric
};

export const staff: Staff[] = [
  { 
    id: "stf-001", 
    name: "Mr. Adebayo", 
    email: "adebayo@ugbekun.com", 
    phone: "+234 801 234 5678",
    address: "123 School Lane, Lagos",
    role: "Mathematics Teacher", 
    department: "Academics", 
    status: "Active", 
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    salary: 250000,
    teacherType: 'Both',
    formClass: 'JSS 1A',
    assignedClasses: [
        { class: "JSS 1A", subject: "Mathematics", students: 1 },
        { class: "JSS 2A", subject: "Mathematics", students: 1 },
    ],
    performance: 85
  },
  { 
    id: "stf-002", 
    name: "Mrs. Chioma", 
    email: "chioma@ugbekun.com", 
    phone: "+234 802 345 6789",
    address: "456 Education Avenue, Abuja",
    role: "Science Coordinator", 
    department: "Academics", 
    status: "Active", 
    avatar: "https://i.pravatar.cc/40?img=31",
    salary: 300000,
    teacherType: 'Form Teacher',
    formClass: 'SSS 1A (Science)',
    assignedClasses: [
        { class: "SSS 1A (Science)", subject: "Physics", students: 1 },
        { class: "JSS 1A", subject: "Basic Science", students: 1 },
    ],
    performance: 92
  },
  { 
    id: "stf-003", 
    name: "Mr. Okoro", 
    email: "okoro@ugbekun.com", 
    phone: "+234 803 456 7890",
    address: "789 Knowledge Crescent, Port Harcourt",
    role: "English Teacher", 
    department: "Academics", 
    status: "On Leave", 
    avatar: "https://i.pravatar.cc/40?img=60",
    salary: 240000,
    teacherType: 'Form Teacher',
    formClass: 'JSS 2A',
    assignedClasses: [
        { class: "JSS 1A", subject: "English Language", students: 1 },
        { class: "JSS 2A", subject: "English Language", students: 1 },
        { class: "JSS 2A", subject: "History", students: 1 },
    ],
    performance: 88
  },
  { 
    id: "stf-006", 
    name: "Ms. Eze", 
    email: "eze@ugbekun.com", 
    phone: "+234 806 789 0123",
    address: "789 Arts Boulevard, Enugu",
    role: "Arts Teacher", 
    department: "Academics", 
    status: "Active", 
    avatar: "https://i.pravatar.cc/40?img=40",
    salary: 220000,
    teacherType: 'Form Teacher',
    formClass: 'JSS 1B',
    assignedClasses: [
        { class: "JSS 1B", subject: "Literature in English", students: 1 },
    ],
    performance: 89
  },
  { 
    id: "stf-007", 
    name: "Mr. Chukwu", 
    email: "chukwu@ugbekun.com", 
    phone: "+234 807 890 1234",
    address: "456 Commerce Drive, Aba",
    role: "Commercial Teacher", 
    department: "Academics", 
    status: "Active", 
    avatar: "https://i.pravatar.cc/40?img=50",
    salary: 230000,
    teacherType: 'Form Teacher',
    formClass: 'SSS 1B (Arts)',
    assignedClasses: [
        { class: "SSS 1B (Arts)", subject: "Data Processing", students: 1 },
    ],
    performance: 86
  },
  { 
    id: "stf-004", 
    name: "Bisi Adewale", 
    email: "bisi@ugbekun.com", 
    phone: "+234 804 567 8901",
    address: "101 Admin Block, Lagos",
    role: "Bursar", 
    department: "Administration", 
    status: "Active", 
    avatar: "https://i.pravatar.cc/40?img=5",
    salary: 350000,
    assignedClasses: [],
    performance: 95
  },
  { 
    id: "stf-005", 
    name: "Ngozi Okeke", 
    email: "ngozi@ugbekun.com", 
    phone: "+234 805 678 9012",
    address: "School Clinic, Lagos",
    role: "School Nurse", 
    department: "Health & Wellness", 
    status: "Active", 
    avatar: "https://i.pravatar.cc/40?img=33",
    salary: 200000,
    assignedClasses: [],
    performance: 98
  },
];
