import { recentStudents as initialStudents } from './admin-data';
import { staff as initialStaff } from './hr-data';
import { initialClasses, initialSubjects, initialDepartments } from './school-data';
import { initialEvents } from './events-data';
import { initialTransactions, initialInvoices, initialExpenses, scratchCards as initialScratchCards } from './finance-data';
import { initialAuditLogs } from './audit-log-data';
import { initialResources } from './resources-data';
import { initialSubmissions } from './submission-data';
import { schoolsData } from './super-admin-data';
import { initialReportCardData } from './report-card-data';
import { initialGradeScale, initialAffectiveTraits, initialPsychomotorSkills } from './report-card-settings-data';
import { initialVerifiableCredentials } from './credentials-data';
import { initialExams } from './exam-data';
import { initialClubs } from './community-data';
import { initialTeamMembers } from './team-data';
import { initialAssignments } from './student-data';
import type { School } from './super-admin-data';
import type { Class, Subject } from './school-data';
import type { Staff } from './hr-data';
import type { Student } from './admin-data';

const dataManifest = {
    'students': initialStudents,
    'school-staff': initialStaff,
    'school-classes': initialClasses,
    'school-subjects': initialSubjects,
    'school-departments': initialDepartments,
    'school-events': initialEvents,
    'transactions-list': initialTransactions,
    'invoices-list': initialInvoices,
    'expenses-list': initialExpenses,
    'scratch-cards': initialScratchCards,
    'audit-log': initialAuditLogs,
    'school-resources': initialResources,
    'exam-submissions': initialSubmissions,
    'schools': schoolsData,
    'report-card-data': initialReportCardData,
    'grade-scale-settings': initialGradeScale,
    'affective-traits-settings': initialAffectiveTraits,
    'psychomotor-skills-settings': initialPsychomotorSkills,
    'verifiable-credentials': initialVerifiableCredentials,
    'examinations-list': initialExams,
    'student-clubs': initialClubs.slice(0, 2),
    'internal-team': initialTeamMembers,
    'student-assignments': initialAssignments,
    'student-results': {}, // Start with empty results
    'teacher-attendance': {}, // Start with empty attendance
};

export function initializeDemoData() {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        if (localStorage.getItem('ugbekun_data_initialized')) {
            return;
        }

        console.log("Initializing Ugbekun demo data for the first time...");

        Object.keys(dataManifest).forEach(key => {
            localStorage.removeItem(key);
        });

        Object.entries(dataManifest).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });

        localStorage.setItem('ugbekun_data_initialized', 'true');
        console.log("Demo data initialization complete.");

    } catch (error) {
        console.error("Failed to initialize demo data:", error);
    }
}

// Client-side specific data setup function
export function setInitialSchoolDataClient(data: {
    schools: School[];
    classes: Class[];
    subjects: Subject[];
    staff: Staff[];
    students: Student[];
}) {
    if (typeof window === 'undefined') {
        console.error("Attempted to set school data on the server.");
        return;
    }
    
    // Clear all existing data except for auth/session/settings keys
    Object.keys(localStorage).forEach(key => {
        if(!key.startsWith('firebase') && !key.startsWith('genkit') && key !== 'userRole' && key !== 'isLoggedIn' && !key.startsWith('theme') && !key.startsWith('ugbekun-preloader')) {
            localStorage.removeItem(key);
        }
    });

    // Save the new school's data
    localStorage.setItem('schools', JSON.stringify(data.schools));
    localStorage.setItem('school-classes', JSON.stringify(data.classes));
    localStorage.setItem('school-subjects', JSON.stringify(data.subjects));
    localStorage.setItem('school-staff', JSON.stringify(data.staff));
    localStorage.setItem('students', JSON.stringify(data.students));
    
    // Initialize all other data stores to their defaults
    localStorage.setItem('student-assignments', JSON.stringify(initialAssignments));
    localStorage.setItem('exam-submissions', JSON.stringify(initialSubmissions));
    localStorage.setItem('examinations-list', JSON.stringify(initialExams));
    localStorage.setItem('transactions-list', JSON.stringify(initialTransactions));
    localStorage.setItem('invoices-list', JSON.stringify(initialInvoices));
    localStorage.setItem('expenses-list', JSON.stringify(initialExpenses));
    localStorage.setItem('audit-log', JSON.stringify(initialAuditLogs));
    localStorage.setItem('school-events', JSON.stringify(initialEvents));
    localStorage.setItem('school-departments', JSON.stringify(initialDepartments));
    localStorage.setItem('report-card-data', JSON.stringify(initialReportCardData));
    localStorage.setItem('grade-scale-settings', JSON.stringify(initialGradeScale));
    localStorage.setItem('affective-traits-settings', JSON.stringify(initialAffectiveTraits));
    localStorage.setItem('psychomotor-skills-settings', JSON.stringify(initialPsychomotorSkills));
    localStorage.setItem('verifiable-credentials', JSON.stringify(initialVerifiableCredentials));
    localStorage.setItem('student-clubs', JSON.stringify(initialClubs.slice(0, 2)));
    localStorage.setItem('internal-team', JSON.stringify(initialTeamMembers));
    localStorage.setItem('student-results', JSON.stringify({}));
    localStorage.setItem('teacher-attendance', JSON.stringify({}));

    // Set the flag that initialization is complete
    localStorage.setItem('ugbekun_data_initialized', 'true');
    console.log("Client-side school data initialization complete.");
}
