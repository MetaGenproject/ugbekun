import { CheckCircle2, Clock, UserCheck, XCircle, FileSearch, Users, ClipboardList, Phone, MessageSquare, CircleSlash } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ApplicantStatus = "Applied" | "Pending" | "Reviewed" | "Screening" | "Accepted" | "Rejected";
export type EnquiryStatus = "New" | "Contacted" | "Follow-up" | "Not Interested" | "Converted";

export interface Applicant {
    id: string;
    name: string;
    class: string;
    avatar: string;
    initials: string;
    submissionDate: string;
    status: ApplicantStatus;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
}

export interface Enquiry {
    id: string;
    studentName: string;
    classOfInterest: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    enquiryDate: string;
    status: EnquiryStatus;
}

export const initialEnquiries: Enquiry[] = [
    {
        id: "enq-001",
        studentName: "Bolanle Adeyemi",
        classOfInterest: "JSS 1A",
        parentName: "Mrs. Adeyemi",
        parentPhone: "08012345678",
        parentEmail: "adeyemi@example.com",
        enquiryDate: "2024-09-08",
        status: "New",
    },
    {
        id: "enq-002",
        studentName: "Femi Ojo",
        classOfInterest: "SSS 1A",
        parentName: "Mr. Ojo",
        parentPhone: "08023456789",
        parentEmail: "ojo@example.com",
        enquiryDate: "2024-09-10",
        status: "Contacted",
    }
];

export const initialApplicants: Applicant[] = [
    {
        id: "UC/24/001",
        name: "Aisha Bello",
        class: "JSS 1A",
        avatar: "https://i.pravatar.cc/40?img=1",
        initials: "AB",
        submissionDate: "2024-09-01",
        status: "Accepted",
        parentName: "Mr. & Mrs. Bello",
        parentEmail: "bello@example.com",
        parentPhone: "08011112222",
    },
    {
        id: "UC/24/002",
        name: "David Okon",
        class: "SSS 1A",
        avatar: "https://i.pravatar.cc/40?img=2",
        initials: "DO",
        submissionDate: "2024-09-02",
        status: "Screening",
        parentName: "Mr. Okon",
        parentEmail: "okon@example.com",
        parentPhone: "08033334444",
    },
    {
        id: "UC/24/003",
        name: "Chiamaka Nwosu",
        class: "JSS 1B",
        avatar: "https://i.pravatar.cc/40?img=3",
        initials: "CN",
        submissionDate: "2024-09-02",
        status: "Reviewed",
        parentName: "Ms. Nwosu",
        parentEmail: "nwosu@example.com",
        parentPhone: "08055556666",
    },
    {
        id: "UC/24/004",
        name: "Tunde Adeboye",
        class: "JSS 2A",
        avatar: "https://i.pravatar.cc/40?img=4",
        initials: "TA",
        submissionDate: "2024-09-03",
        status: "Rejected",
        parentName: "Mr. Adeboye",
        parentEmail: "adeboye@example.com",
        parentPhone: "08077778888",
    },
    {
        id: "UC/24/005",
        name: "Fatima Aliyu",
        class: "SSS 1B",
        avatar: "https://i.pravatar.cc/40?img=5",
        initials: "FA",
        submissionDate: "2024-09-04",
        status: "Applied",
        parentName: "Alhaji Aliyu",
        parentEmail: "aliyu@example.com",
        parentPhone: "08099990000",
    },
];

export const statusConfig: Record<ApplicantStatus, { icon: LucideIcon, color: string }> = {
    Applied: {
        icon: UserCheck,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300",
    },
    Pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
    },
    Reviewed: {
        icon: FileSearch,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
    },
     Screening: {
        icon: ClipboardList,
        color: "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300",
    },
    Accepted: {
        icon: CheckCircle2,
        color: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
    },
    Rejected: {
        icon: XCircle,
        color: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
    },
};

export const enquiryStatusConfig: Record<EnquiryStatus, { icon: LucideIcon, color: string }> = {
    New: {
        icon: UserCheck,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
    },
    Contacted: {
        icon: Phone,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300",
    },
    'Follow-up': {
        icon: MessageSquare,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
    },
    'Not Interested': {
        icon: CircleSlash,
        color: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
    },
    Converted: {
        icon: CheckCircle2,
        color: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
    },
}
