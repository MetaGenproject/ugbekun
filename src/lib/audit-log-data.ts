
import type { LucideIcon } from 'lucide-react';
import type { iconMap } from './notifications-data';

export type AuditLog = {
    id: string;
    actorId: string;
    actorName: string;
    actorAvatar: string;
    action: string;
    details: string;
    timestamp: string;
    icon: keyof typeof iconMap;
}

// In a real app, this would be an empty array and populated by actions.
export const initialAuditLogs: AuditLog[] = [
     {
        id: 'log-1',
        actorId: 'admin-nabila',
        actorName: 'Nabila A.',
        actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
        action: 'Payroll Run',
        details: 'Processed payroll for 54 staff members, totaling ₦12,150,000.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        icon: 'HandCoins',
    },
    {
        id: 'log-2',
        actorId: 'teacher-adebayo',
        actorName: 'Mr. Adebayo',
        actorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
        action: 'Grade Submitted',
        details: 'Submitted grade of 88% for Aisha Bello in Mid-Term Examination',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        icon: 'FileCheck',
    },
    {
        id: 'log-3',
        actorId: 'superadmin',
        actorName: 'Ugbekun Team',
        actorAvatar: 'https://placehold.co/40x40/95a8ff/122B5E?text=A',
        action: 'School Onboarded',
        details: 'Onboarded new school: Graceland Academy on the Growth plan.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        icon: 'Building',
    }
];
