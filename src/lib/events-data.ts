

import { BookOpen, Trophy, Flag, Handshake, Users, Drama, BrainCircuit, ClipboardCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type EventCategory = 'Academic' | 'Sports' | 'Holiday' | 'Cultural' | 'Meeting' | 'Assignment';

export type Event = {
  id: string;
  date: Date;
  title: string;
  category: EventCategory;
  icon: keyof typeof import('lucide-react');
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
};

export const initialEvents: Event[] = [
  { id: 'evt-1', date: new Date(2024, 9, 15), title: "Mid-Term Exams Begin", category: 'Academic', icon: 'BookOpen', description: "Mid-term examinations for all classes will commence.", location: "Examination Hall A", startTime: "09:00", endTime: "11:00" },
  { id: 'evt-2', date: new Date(2024, 9, 25), title: "Inter-House Sports Day", category: 'Sports', icon: 'Trophy', description: "Annual school-wide sports competition.", location: "School Field" },
  { id: 'evt-3', date: new Date(2024, 9, 1), title: "Independence Day", category: 'Holiday', icon: 'Flag', description: "Public holiday. School will be closed." },
  { id: 'evt-4', date: new Date(2024, 10, 5), title: "Cultural Day", category: 'Cultural', icon: 'Drama', description: "A celebration of the diverse cultures within our school community.", location: "School Hall" },
  { id: 'evt-5', date: new Date(2024, 9, 18), title: "PTA Meeting", category: 'Meeting', icon: 'Users', description: "General meeting for all parents, teachers, and staff.", location: "School Hall", startTime: "12:00", endTime: "14:00" },
  { id: 'evt-6', date: new Date(2024, 10, 12), title: "Science Fair", category: 'Academic', icon: 'BrainCircuit', description: "Exhibition of student science projects.", location: "Science Laboratory" },
];

export const categoryConfig: Record<EventCategory, { color: string, icon: LucideIcon }> = {
    Academic: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300', icon: BookOpen },
    Sports: { color: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300', icon: Trophy },
    Holiday: { color: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300', icon: Flag },
    Cultural: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300', icon: Drama },
    Meeting: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300', icon: Users },
    Assignment: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300', icon: ClipboardCheck }
}
