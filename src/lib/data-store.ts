
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 * 
 * This file acts as a simple data abstraction layer (DAL). In a real-world Next.js
 * application, these functions would likely be server-side API calls to a database,
 * using a library like Prisma, Drizzle, or the native database driver.
 * 
 * For this demo, we are simulating a database by reading from and writing to
 * the browser's localStorage. This allows for data persistence across page reloads
 * without needing a backend database setup.
 * 
 * IMPORTANT: Because localStorage is a client-side API, these functions are only
 * intended to be called from client components or within API routes/server actions
 * that are triggered by client-side events. They will not work in purely server-rendered
 * components that run on the server at build time or during initial SSR.
 */

// NOTE: This file is intentionally NOT a server component ('use server') because
// it directly interacts with localStorage, a browser-only API. These functions
// are designed to be imported and used within 'use client' components or within
// Server Actions which, despite the name, can be called from the client.

import type { Student } from './admin-data';
import { recentStudents as initialStudents } from './admin-data';
import type { Staff } from './hr-data';
import { staff as initialStaff } from './hr-data';
import type { Class, Subject } from './school-data';
import { initialClasses, initialSubjects, initialDepartments } from './school-data';
import type { Event } from './events-data';
import { initialEvents } from './events-data';
import type { Transaction, Invoice, Expense, ScratchCard } from './finance-data';
import { initialTransactions, initialInvoices, initialExpenses, scratchCards as initialScratchCards } from './finance-data';
import type { AuditLog } from './audit-log-data';
import { initialAuditLogs } from './audit-log-data';
import { generateStudentId } from './did';
import type { Resource } from './resources-data';
import { initialResources } from './resources-data';
import type { Submission } from './submission-data';
import { initialSubmissions } from './submission-data';
import type { School } from './super-admin-data';
import { schoolsData } from './super-admin-data';
import { initialReportCardData } from './report-card-data';
import type { ReportCardData, GradeScaleItem, AffectiveTrait, PsychomotorSkill } from './report-card-settings-data';
import { initialGradeScale, initialAffectiveTraits, initialPsychomotorSkills } from './report-card-settings-data';
import type { VerifiableCredential } from './credentials-data';
import { initialVerifiableCredentials } from './credentials-data';
import { type Exam, initialExams } from './exam-data';
import type { Club } from './community-data';
import { initialClubs } from './community-data';
import type { TeamMember } from './team-data';
import { initialTeamMembers } from './team-data';
import { initialAssignments } from './student-data';
import type { ClassResults } from './results-data';
import { initialStudentAssessments } from './student-data';

// A synchronous, reliable function to get data from localStorage.
const getFromStorage = <T>(key: string, initialValue: T): T => {
    if (typeof window === 'undefined') {
        return initialValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return initialValue;
    }
};

// Helper function to save data to localStorage
function saveToStorage<T>(key: string, value: T): void {
   if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key “${key}”:`, error);
  }
}

// --- ONBOARDING ---
export async function setInitialSchoolData(data: {
    schools: School[];
    classes: Class[];
    subjects: Subject[];
    staff: Staff[];
    students: Student[];
}): Promise<void> {
    // This function will clear old data and set up the new school with demo students.
    // Clear all existing data except for auth/session keys
    Object.keys(localStorage).forEach(key => {
        if(!key.startsWith('firebase') && !key.startsWith('genkit') && key !== 'userRole' && key !== 'isLoggedIn') {
            localStorage.removeItem(key);
        }
    });

    // Save the new school's data
    saveToStorage('schools', data.schools);
    saveToStorage('school-classes', data.classes);
    saveToStorage('school-subjects', data.subjects);
    saveToStorage('school-staff', data.staff);
    saveToStorage('students', data.students); // Save students, including demos
    
    // Initialize all other data stores to their defaults
    saveToStorage('student-assignments', initialAssignments);
    saveToStorage('exam-submissions', initialSubmissions);
    saveToStorage('examinations-list', initialExams);
    saveToStorage('transactions-list', initialTransactions);
    saveToStorage('invoices-list', initialInvoices);
    saveToStorage('expenses-list', initialExpenses);
    saveToStorage('audit-log', initialAuditLogs);
    saveToStorage('school-events', initialEvents);
    saveToStorage('school-departments', initialDepartments);
    saveToStorage('report-card-data', initialReportCardData);
    saveToStorage('grade-scale-settings', initialGradeScale);
    saveToStorage('affective-traits-settings', initialAffectiveTraits);
    saveToStorage('psychomotor-skills-settings', initialPsychomotorSkills);
    saveToStorage('verifiable-credentials', initialVerifiableCredentials);
    saveToStorage('student-clubs', initialClubs.slice(0, 2));
    saveToStorage('internal-team', initialTeamMembers);
    saveToStorage('student-results', {});
    saveToStorage('teacher-attendance', {});
    saveToStorage('student-assessments', initialStudentAssessments);

    // Set a flag that initialization is complete
    saveToStorage('ugbekun_data_initialized', true);
}


// --- Students ---
export async function getStudents(): Promise<Student[]> {
    return getFromStorage<Student[]>('students', initialStudents);
}
export async function saveStudents(students: Student[]): Promise<void> {
    saveToStorage('students', students);
}
export async function addStudent(studentData: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>): Promise<Student> {
    const students = await getStudents();
    const newStudent: Student = {
        ...studentData,
        id: generateStudentId("UC"),
        avatar: `https://i.pravatar.cc/40?u=${studentData.name}`,
        initials: studentData.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        status: 'Active',
    };
    const updatedStudents = [newStudent, ...students];
    saveToStorage('students', updatedStudents);
    return newStudent;
}
export async function updateStudent(updatedStudent: Student): Promise<void> {
    const students = await getStudents();
    const updatedStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    saveToStorage('students', updatedStudents);
}
export async function deleteStudent(studentId: string): Promise<void> {
    const students = await getStudents();
    const updatedStudents = students.filter(s => s.id !== studentId);
    saveToStorage('students', updatedStudents);
}

// --- Submissions ---
export async function getSubmissions(): Promise<Submission[]> {
    return getFromStorage<Submission[]>('exam-submissions', initialSubmissions);
}
export async function updateSubmission(updatedSubmission: Submission): Promise<void> {
    const submissions = await getSubmissions();
    const updated = submissions.map(s => s.id === updatedSubmission.id ? updatedSubmission : s);
    saveToStorage('exam-submissions', updated);
}
export async function saveSubmissions(submissions: Submission[]): Promise<void> {
    saveToStorage('exam-submissions', submissions);
}

// --- Staff ---
export async function getStaff(): Promise<Staff[]> {
    return getFromStorage<Staff[]>('school-staff', initialStaff);
}

// --- Team ---
export async function getInternalTeam(): Promise<TeamMember[]> {
    return getFromStorage<TeamMember[]>('internal-team', initialTeamMembers);
}
export async function saveInternalTeam(team: TeamMember[]): Promise<void> {
    saveToStorage('internal-team', team);
}


// --- Classes ---
export async function getClasses(): Promise<Class[]> {
    return getFromStorage<Class[]>('school-classes', initialClasses);
}

// --- Subjects ---
export async function getSubjects(): Promise<Subject[]> {
    return getFromStorage<Subject[]>('school-subjects', initialSubjects);
}

// --- Timetables ---
export async function getTimetables(): Promise<Record<string, string[][]>> {
    return getFromStorage<Record<string, string[][]>>('timetables', {});
}
export async function saveTimetables(timetables: Record<string, string[][]>): Promise<void> {
    saveToStorage('timetables', timetables);
}

// --- Events ---
export async function getEvents(): Promise<Event[]> {
    const events = getFromStorage<Event[]>('school-events', initialEvents);
    // Ensure date objects are correctly parsed
    return events.map(e => ({...e, date: new Date(e.date)}));
}
export async function addEvent(event: Omit<Event, 'id' | 'icon'>): Promise<void> {
    const events = await getEvents();
    const newEvent: Event = { ...event, id: `evt-${Date.now()}`, icon: 'Calendar' };
    saveToStorage('school-events', [...events, newEvent]);
}

// --- Finance ---
export async function getTransactions(): Promise<Transaction[]> {
    return getFromStorage<Transaction[]>('transactions-list', initialTransactions);
}
export async function saveTransactions(transactions: Transaction[]): Promise<void> {
    saveToStorage('transactions-list', transactions);
}
export async function getInvoices(): Promise<Invoice[]> {
    return getFromStorage<Invoice[]>('invoices-list', initialInvoices);
}
export async function saveInvoices(invoices: Invoice[]): Promise<void> {
    saveToStorage('invoices-list', invoices);
}

// --- Audit Log ---
export async function getAuditLogs(): Promise<AuditLog[]> {
    return getFromStorage<AuditLog[]>('audit-log', initialAuditLogs);
}
export async function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const logs = await getAuditLogs();
    const newLog: AuditLog = {
        ...log,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    saveToStorage('audit-log', [newLog, ...logs]);
}

// --- Scratch Cards ---
export async function getScratchCardByPin(pin: string): Promise<ScratchCard | undefined> {
    const cards = getFromStorage<ScratchCard[]>('scratch-cards', initialScratchCards);
    return cards.find(c => c.pin === pin);
}
export async function updateScratchCard(updatedCard: ScratchCard): Promise<void> {
    const cards = getFromStorage<ScratchCard[]>('scratch-cards', initialScratchCards);
    const updatedCards = cards.map(c => c.pin === updatedCard.pin ? updatedCard : c);
    saveToStorage('scratch-cards', updatedCards);
}


// --- Resources ---
export async function getResources(): Promise<Resource[]> {
    return getFromStorage<Resource[]>('school-resources', initialResources);
}
export async function addResource(resource: Resource): Promise<void> {
    const resources = await getResources();
    saveToStorage('school-resources', [resource, ...resources]);
}
export async function updateResource(updatedResource: Resource): Promise<void> {
    const resources = await getResources();
    const updated = resources.map(r => r.id === updatedResource.id ? updatedResource : r);
    saveToStorage('school-resources', updated);
}
export async function deleteResource(resourceId: string): Promise<void> {
    const resources = await getResources();
    const updated = resources.filter(r => r.id !== resourceId);
    saveToStorage('school-resources', updated);
}

// --- Schools ---
export async function getSchools(): Promise<School[]> {
    return getFromStorage<School[]>('schools', schoolsData);
}

// --- Credentials ---
export async function getVerifiableCredentials(): Promise<VerifiableCredential[]> {
    return getFromStorage<VerifiableCredential[]>('verifiable-credentials', initialVerifiableCredentials);
}

// --- Clubs ---
export async function getClubs(): Promise<Club[]> {
    return getFromStorage<Club[]>('student-clubs', initialClubs);
}

// --- Report Card Designer Data ---
export async function getReportCardData(): Promise<ReportCardData> {
    return getFromStorage('report-card-data', initialReportCardData);
}

export async function getGradeScaleSettings(): Promise<GradeScaleItem[]> {
    return getFromStorage("grade-scale-settings", initialGradeScale);
}

export async function getAffectiveTraitsSettings(): Promise<AffectiveTrait[]> {
    return getFromStorage("affective-traits-settings", initialAffectiveTraits);
}

export async function getPsychomotorSkillsSettings(): Promise<PsychomotorSkill[]> {
    return getFromStorage("psychomotor-skills-settings", initialPsychomotorSkills);
}

export async function getStudentAssessments(): Promise<any> {
    return getFromStorage("student-assessments", initialStudentAssessments);
}

export async function saveStudentAssessments(assessments: any): Promise<void> {
    saveToStorage("student-assessments", assessments);
}

// --- Exams ---
export async function getExams(): Promise<Exam[]> {
    return getFromStorage<Exam[]>('examinations-list', initialExams);
}
export async function saveExams(exams: Exam[]): Promise<void> {
    saveToStorage('examinations-list', exams);
}

// --- Results ---
export async function getResults(): Promise<ClassResults> {
    const results = getFromStorage<ClassResults>('student-results', {});
    // This is a good place to add any data migration logic if the structure changes.
    return results;
}
export async function saveResults(results: ClassResults): Promise<void> {
    saveToStorage('student-results', results);
}
