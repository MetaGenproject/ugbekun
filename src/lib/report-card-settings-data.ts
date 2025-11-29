

export type GradeScaleItem = {
    id: string;
    grade: string;
    rangeStart: number;
    rangeEnd: number;
    remark: string;
}

export type AffectiveTrait = {
    id: string;
    trait: string;
}

export type PsychomotorSkill = {
    id: string;
    skill: string;
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
  affectiveDomain: { trait: string; value: 1 | 2 | 3 | 4 | 5; }[];
  psychomotorSkills: { skill: string; value: 1 | 2 | 3 | 4 | 5; }[];
  gradeScale: { grade: string; rangeStart: number; rangeEnd: number; remark: string; }[];
  classTeacherRemark: string;
  headTeacherRemark: string;
  headTeacherSignatureUrl: string;
  status: 'PROMOTED' | 'NOT PROMOTED' | 'ADVISED TO WITHDRAW';
  nextSessionBegins: string;
  reportDate: string;
};

export type PersonalData = {
  name: string;
  adminNo: string;
  gender: 'Male' | 'Female';
  class: string;
  dob: string;
  club: string;
};

export type Attendance = {
  schoolOpened: number;
  present: number;
  absent: number;
  termBeginning: string;
  termEnding: string;
};

export type PerformanceSummary = {
  totalScoreObtainable: number;
  totalScoreObtained: number;
  percentage: number;
  grade: string;
  position: string;
  classSize: number;
  classAverage: number;
};

export type CognitiveData = {
  subject: string;
  firstCA: number;
  secondCA: number;
  exam: number;
  thirdTerm: number;
  secondTerm: number;
  firstTerm: number;
  sessionAverage: number;
  grade: string;
  subjPosition: string;
  remarks: string;
  classAvg: number;
};

export const initialGradeScale: GradeScaleItem[] = [
    { id: 'gs1', grade: 'A+', rangeStart: 95, rangeEnd: 100, remark: "EXCEPTIONAL" },
    { id: 'gs2', grade: 'A', rangeStart: 90, rangeEnd: 94.9, remark: "DISTINCTION" },
    { id: 'gs3', grade: 'A-', rangeStart: 85, rangeEnd: 89.9, remark: "EXCELLENT" },
    { id: 'gs4', grade: 'B+', rangeStart: 80, rangeEnd: 84.9, remark: "VERY GOOD" },
    { id: 'gs5', grade: 'B', rangeStart: 75, rangeEnd: 79.9, remark: "UPPER CREDIT" },
    { id: 'gs6', grade: 'C+', rangeStart: 60, rangeEnd: 69.9, remark: "GOOD" },
    { id: 'gs7', grade: 'D', rangeStart: 40, rangeEnd: 59.9, remark: "AVERAGE" },
    { id: 'gs8', grade: 'F', rangeStart: 0, rangeEnd: 39.9, remark: "PASS" },
];

export const initialAffectiveTraits: AffectiveTrait[] = [
    { id: 'af1', trait: "Attentiveness" },
    { id: 'af2', trait: "Honesty" },
    { id: 'af3', trait: "Neatness" },
    { id: 'af4', trait: "Politeness" },
    { id: 'af5', trait: "Punctuality" },
    { id: 'af6', trait: "Self Control" },
    { id: 'af7', trait: "Obedience" },
    { id: 'af8', trait: "Reliability" },
];

export const initialPsychomotorSkills: PsychomotorSkill[] = [
    { id: 'ps1', skill: "Handling Of Tools" },
    { id: 'ps2', skill: "Drawing/Painting" },
    { id: 'ps3', skill: "Handwriting" },
    { id: 'ps4', skill: "Public Speaking" },
    { id: 'ps5', skill: "Sports & Games" },
];