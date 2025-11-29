/**
 * Data model for a comprehensive Nigerian-style report card.
 */

import type { GradeScaleItem, AffectiveTrait, PsychomotorSkill } from './report-card-settings-data';
import type { StudentResult } from './results-data';

export interface PersonalData {
  name: string;
  adminNo: string;
  gender: 'Male' | 'Female';
  class: string;
  dob: string;
  club: string;
}

export interface Attendance {
  schoolOpened: number;
  present: number;
  absent: number;
  termBeginning: string;
  termEnding: string;
}

export interface PerformanceSummary {
  totalScoreObtainable: number;
  totalScoreObtained: number;
  percentage: number;
  grade: string;
  position: string;
  classSize: number;
  classAverage: number;
}

export interface CognitiveData {
  subject: string;
  firstCA: number;
  secondCA: number;
  exam: number;
  thirdTerm: number; // Total for 3rd term
  secondTerm: number; // Score from 2nd term
  firstTerm: number; // Score from 1st term
  sessionAverage: number; // Average of all terms
  grade: string;
  subjPosition: string;
  remarks: string;
  classAvg: number;
}

export type ReportCardData = {
  schoolName: string;
  schoolMotto: string;
  schoolAddress: string;
  schoolContact: string;
  schoolLogoUrl: string;
  reportTitle: string;
  personalData: PersonalData;
  attendance: Attendance;
  performanceSummary: PerformanceSummary;
  cognitiveData: CognitiveData[];
  affectiveDomain: { trait: string, value: 1 | 2 | 3 | 4 | 5 }[];
  psychomotorSkills: { skill: string, value: 1 | 2 | 3 | 4 | 5 }[];
  gradeScale: { grade: string, rangeStart: number, rangeEnd: number, remark: string }[];
  classTeacherRemark: string;
  headTeacherRemark: string;
  headTeacherSignatureUrl: string;
  status: 'PROMOTED' | 'NOT PROMOTED' | 'ADVISED TO WITHDRAW';
  nextSessionBegins: string;
  reportDate: string;
}

// Mock data for a single student report. This is the base data.
// The designer page will use localStorage to override parts of this (e.g., school name, traits, skills).
export const initialReportCardData: ReportCardData = {
  schoolName: "Unity College",
  schoolMotto: "Excellence and Integrity",
  schoolAddress: "123 Education Way, Ikeja, Lagos",
  schoolContact: "Tel: 0801-234-5678",
  schoolLogoUrl: "https://i.postimg.cc/pLxmy2pN/logo-icon.png",
  reportTitle: "End of Term Student Performance Report",
  headTeacherSignatureUrl: "https://i.postimg.cc/y8BhtC4D/signature-mock.png",
  personalData: {
    name: "Enorense, Kiriku Victory",
    adminNo: "03/1643",
    gender: "Male",
    class: "JSS 2A",
    dob: "Mon, 02-Feb-2004",
    club: "Scrabble, JETS, DEBATE"
  },
  attendance: {
    schoolOpened: 134,
    present: 130,
    absent: 4,
    termBeginning: "04/04/2024",
    termEnding: "04/09/2024"
  },
  performanceSummary: {
    totalScoreObtainable: 1600.00,
    totalScoreObtained: 0, // Calculated
    percentage: 0, // Calculated
    grade: '', // Calculated
    position: '1st', // Should be calculated, mocked for now
    classSize: 21,
    classAverage: 75.2 // This is usually an average of percentages, mocked for now
  },
  // This will be dynamically populated by the results engine
  cognitiveData: [], 
  // These will be overridden by settings from `report-card-settings-data.ts`
  affectiveDomain: [],
  psychomotorSkills: [],
  gradeScale: [],
  classTeacherRemark: "Kiriku is a diligent, studious student and always Funny. Always inquisitive and ready to learn.", // Mock, will be AI generated
  headTeacherRemark: "A Very Good Result!!.. Keep It Up!", // Mock, will be AI generated
  status: "PROMOTED", // Will be calculated
  nextSessionBegins: "Mon, 09-Sep-2024",
  reportDate: "12/07/2024"
};