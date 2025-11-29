

import { addDays, formatISO } from "date-fns";

// This file is now primarily for mock data that is specific to a single student's interactions,
// like their personal assignment completion status, grades, and messages.
// The core subject/course data is now centralized in `school-data.ts`.

export type Assignment = {
    id: string;
    title: string;
    course: string;
    points: number;
    completed: boolean;
    date: string;
};

export const initialAssignments: Assignment[] = [
    { id: '1', title: 'Algebra II - Chapter 4 Quiz', course: 'Mathematics', points: 15, completed: false, date: addDays(new Date(), 2).toISOString() },
    { id: '2', title: 'Essay: "The Lion and the Jewel"', course: 'Literature in English', points: 20, completed: false, date: addDays(new Date(), 5).toISOString() },
    { id: '3', title: 'Comprehension Passage Review', course: 'English Language', points: 10, completed: true, date: addDays(new Date(), -1).toISOString() },
    { id: '4', title: 'Lab Report: Projectile Motion', course: 'Physics', points: 25, completed: false, date: addDays(new Date(), 3).toISOString() },
];

export type RecentGrade = {
    id: string;
    course: string;
    grade: string;
    feedback: string;
    avatarId: string;
};

export const initialGrades: RecentGrade[] = [
    { id: '1', course: 'Mathematics • Quiz 3', grade: '92%', feedback: 'Excellent work on quadratics.', avatarId: 'grade-mth' },
    { id: '2', course: 'English Language • Essay 2', grade: '85%', feedback: 'Good analysis, watch your tenses.', avatarId: 'grade-eco' },
    { id: '3', course: 'Physics • Lab 1', grade: '88%', feedback: 'Very precise measurements.', avatarId: 'grade-ds' },
    { id: '4', course: 'Literature in English • Paper 1', grade: '91%', feedback: 'Excellent analysis of themes.', avatarId: 'grade-lit' },
];

export type Message = {
    id: string;
    sender: string;
    time: string;
    preview: string;
    avatarId: string;
};

export const messages: Message[] = [
    { id: '1', sender: 'Mr. Adebayo', time: '12:45 PM', preview: 'Reminder: Math club meeting today.', avatarId: 'msg-prof-carter' },
    { id: '2', sender: 'Debate Club', time: '11:02 AM', preview: 'Practice session is moved to Hall B.', avatarId: 'msg-study-group' },
    { id: '3', sender: 'Mrs. Chioma', time: 'Yesterday', preview: 'I left comments on your lab draft.', avatarId: 'msg-ta-mia' },
];


export type AttendanceStatus = "Present" | "Late" | "Absent" | "Holiday";

export const attendanceData: Record<string, AttendanceStatus> = {
  "2024-10-01": "Holiday",
  "2024-10-02": "Present",
  "2024-10-03": "Present",
  "2024-10-04": "Present",
  "2024-10-07": "Present",
  "2024-10-08": "Present",
  "2024-10-09": "Late",
  "2024-10-10": "Present",
  "2024-10-11": "Absent",
  "2024-10-14": "Present",
  "2024-10-15": "Present",
  "2024-10-16": "Present",
  "2024-10-17": "Late",
  "2024-10-18": "Present",
  "2024-10-21": "Present",
  "2024-10-22": "Present",
  "2024-10-23": "Present",
  "2024-10-24": "Present",
  "2024-10-25": "Present",
  "2024-10-28": "Absent",
  "2024-10-29": "Present",
  "2024-10-30": "Present",
  "2024-10-31": "Present",
};

// New data structure for teacher assessments
export type StudentAssessment = {
    studentId: string;
    affective: Record<string, number>; // { traitId: rating }
    psychomotor: Record<string, number>; // { skillId: rating }
};

export const initialStudentAssessments: Record<string, StudentAssessment> = {}; // { [classId]: StudentAssessment[] }
