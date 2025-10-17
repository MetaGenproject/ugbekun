/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { MessageSquare, CalendarCheck2, Wallet, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const quickActions = [
  { icon: MessageSquare, text: "Message teacher" },
  { icon: CalendarCheck2, text: "Report absence" },
  { icon: Wallet, text: "Pay fees" },
  { icon: FileText, text: "View report" },
];

export const wellnessNote: { icon: LucideIcon; title: string; details: string } = {
  icon: FileText,
  title: "Allergy Note",
  details: "Maya has a mild peanut allergy. Please ensure no peanut products are consumed.",
};
