
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Building, Users, Wallet, TrendingUp } from "lucide-react";

export const platformStats = [
    { title: "Total Schools", value: "128", icon: Building },
    { title: "Active Users", value: "24,832", icon: Users },
    { title: "Platform Revenue", value: "₦15.4m", icon: Wallet },
    { title: "New Sign-ups (MoM)", value: "+12%", icon: TrendingUp },
];

export type School = {
    id: string;
    name: string;
    logoUrl: string | null;
    coverImageUrl?: string | null;
    status: "Active" | "Inactive";
    plan: "Starter" | "Growth" | "Enterprise";
    students: number;
    teachers: number;
    revenue: number;
    rating: number;
    state: string;
    lga: string;
    system: "Standard" | "SMSUP+";
    verified: boolean;
    verificationFee?: number;
}

export const schoolsData: School[] = [
  {
    id: 'unity-college',
    name: "Unity College",
    logoUrl: "https://i.postimg.cc/pLxmy2pN/logo-icon.png",
    coverImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2072&auto=format&fit=crop",
    status: "Active",
    plan: "Enterprise",
    students: 1250,
    teachers: 80,
    revenue: 250000,
    rating: 4.8,
    state: "Lagos",
    lga: "Ikeja",
    system: "SMSUP+",
    verified: true,
    verificationFee: 500,
  },
  {
    id: 'alpha-academy',
    name: "Alpha Academy",
    logoUrl: null,
    status: "Active",
    plan: "Enterprise",
    students: 800,
    teachers: 55,
    revenue: 250000,
    rating: 4.9,
    state: "FCT",
    lga: "Municipal Area Council",
    system: "SMSUP+",
    verified: true,
    verificationFee: 1000,
  },
  {
    id: 'cedar-high',
    name: "Cedar High",
    logoUrl: null,
    status: "Active",
    plan: "Growth",
    students: 980,
    teachers: 65,
    revenue: 75000,
    rating: 4.7,
    state: "Rivers",
    lga: "Port Harcourt",
    system: "Standard",
    verified: false,
  },
  {
    id: 'bright-futures-group',
    name: "Bright Futures Group",
    logoUrl: null,
    status: "Active",
    plan: "Enterprise",
    students: 2500,
    teachers: 150,
    revenue: 250000,
    rating: 4.9,
    state: "Lagos",
    lga: "Eti Osa",
    system: "SMSUP+",
    verified: true,
    verificationFee: 1500,
  },
  {
    id: 'legacy-school',
    name: "Legacy School",
    logoUrl: null,
    status: "Inactive",
    plan: "Starter",
    students: 600,
    teachers: 40,
    revenue: 0,
    rating: 4.5,
    state: "Oyo",
    lga: "Ibadan North",
    system: "Standard",
    verified: false,
  },
];

export const platformGrowthData = [
    { month: 'Jan', newSchools: 8 },
    { month: 'Feb', newSchools: 12 },
    { month: 'Mar', newSchools: 10 },
    { month: 'Apr', newSchools: 15 },
    { month: 'May', newSchools: 18 },
    { month: 'Jun', newSchools: 22 },
];

export const revenueByPlanData = [
    { name: 'Growth', value: 8.2 },
    { name: 'Enterprise', value: 5.1 },
    { name: 'Starter', value: 2.1 },
];

export const recentActivities = [
    { id: 1, school: { name: 'Oakwood International', logoUrl: 'https://placehold.co/40x40/f3e8ff/581c87?text=O' }, description: 'upgraded to the Enterprise plan.', timestamp: '2 minutes ago' },
    { id: 2, school: { name: 'Graceland Academy', logoUrl: 'https://placehold.co/40x40/dcfce7/14532d?text=G' }, description: 'just signed up for the Growth plan.', timestamp: '1 hour ago' },
    { id: 3, school: { name: 'Kings College', logoUrl: 'https://placehold.co/40x40/e0f2fe/0c4a6e?text=K' }, description: 'processed end-of-term reports for 800 students.', timestamp: '3 hours ago' },
    { id: 4, school: { name: 'Alpha Academy', logoUrl: 'https://placehold.co/40x40/FEE2E2/991B1B?text=A' }, description: 'activated SMSUP+ for their school.', timestamp: '5 hours ago' },
];
