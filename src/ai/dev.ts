
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-student-reports.ts';
import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/teacher-actions';
import '@/ai/flows/admin-actions';
import '@/ai/flows/student-actions';
import '@/ai/flows/generate-comprehensive-report.ts';
import '@/ai/flows/hr-actions';
import '@/ai/flows/timetable-actions';
import '@/ai/flows/finance-actions';
import '@/ai/flows/system-admin-flow';
import '@/ai/flows/student-assistant-flow';
import '@/ai/flows/teacher-assistant-flow';
