
/**
 * This file contains the core logic for calculating results, grades, and positions.
 * It is the "real logic" and "powerful system" for result management, separate from any AI.
 */

import type { ReportCardData, CognitiveData } from './report-card-settings-data';
import type { StudentResult } from './results-data';

/**
 * Calculates the total score for the current term.
 * @param firstCA - First Continuous Assessment score.
 * @param secondCA - Second Continuous Assessment score.
 * @param exam - Examination score.
 * @returns The total score for the term.
 */
function calculateTermTotal(firstCA?: number, secondCA?: number, exam?: number): number {
  return (firstCA || 0) + (secondCA || 0) + (exam || 0);
}

/**
 * Calculates the session average from all term scores.
 * @param firstTerm - Score from the first term.
 * @param secondTerm - Score from the second term.
 * @param thirdTerm - Score from the third term.
 * @returns The average score for the session.
 */
function calculateSessionAverage(firstTerm: number, secondTerm: number, thirdTerm: number): number {
    return (firstTerm + secondTerm + thirdTerm) / 3;
}

/**
 * Assigns a grade and remark based on a score and the school's grade scale.
 * @param score - The total score (0-100).
 * @param gradeScale - The school's grading scale configuration.
 * @returns An object containing the grade and remark.
 */
export function assignGradeAndRemarks(score: number, gradeScale: { grade: string, rangeStart: number, rangeEnd: number, remark: string }[]): { grade: string; remarks: string } {
  const roundedScore = Math.round(score);
  // Sort grade scale descending by rangeStart to ensure the highest match is found first
  const sortedGradeScale = [...gradeScale].sort((a, b) => b.rangeStart - a.rangeStart);

  for (const scale of sortedGradeScale) {
    if (roundedScore >= scale.rangeStart && roundedScore <= scale.rangeEnd) {
      return { grade: scale.grade, remarks: scale.remark };
    }
  }
  return { grade: 'F', remarks: 'FAIL' }; // Fallback
}


/**
 * Ranks a student based on their score relative to the rest of the class.
 * This is a simplified ranking logic. Real-world scenarios might involve more complex tie-breakers.
 * @param allStudentScores - An array of scores for all students in the class for one subject.
 * @param currentStudentScore - The score of the student to be ranked.
 * @returns The rank as a string (e.g., "1st", "2nd", "3rd").
 */
export function rankStudent(allStudentScores: number[], currentStudentScore: number): string {
    const sortedScores = [...allStudentScores].sort((a, b) => b - a);
    const rank = sortedScores.indexOf(currentStudentScore) + 1;

    if (rank === 0) return `${allStudentScores.length}th`; // Should not happen

    const j = rank % 10, k = rank % 100;
    if (j == 1 && k != 11) return rank + "st";
    if (j == 2 && k != 12) return rank + "nd";
    if (j == 3 && k != 13) return rank + "rd";
    return rank + "th";
}

/**
 * Determines the student's promotion status based on their performance.
 * This is a customizable business logic. The default here is passing >50% of subjects.
 * @param cognitiveData - The calculated cognitive data for the student.
 * @returns The promotion status.
 */
function determinePromotionStatus(cognitiveData: ReportCardData['cognitiveData']): ReportCardData['status'] {
    const passingMark = 50; // School can customize this
    const coreSubjects = ["MATHEMATICS", "ENGLISH LANGUAGE"]; // Use uppercase to match data
    
    const passedCoreSubjects = coreSubjects.every(coreSub => {
        const subject = cognitiveData.find(s => s.subject.toUpperCase() === coreSub);
        return subject ? subject.thirdTerm >= passingMark : false;
    });

    if (!passedCoreSubjects) {
        return 'NOT PROMOTED';
    }

    const totalSubjects = cognitiveData.length;
    const passedSubjects = cognitiveData.filter(s => s.thirdTerm >= passingMark).length;

    if ((passedSubjects / totalSubjects) >= 0.5) {
        return 'PROMOTED';
    }

    return 'NOT PROMOTED';
}

/**
 * Master function to process a student's raw scores and generate the complete, calculated report card data.
 * @param studentName - The name of the student.
 * @param baseReportData - The initial report card data object with raw scores.
 * @returns A fully calculated ReportCardData object.
 */
export function generateReportCardData(studentName: string, baseReportData: ReportCardData, studentResults?: StudentResult[]): ReportCardData {
    const reportData = JSON.parse(JSON.stringify(baseReportData)); // Deep copy to avoid mutation
    
    reportData.personalData.name = studentName;

    // --- 1. Calculate Cognitive Domain ---
    const calculatedCognitiveData: CognitiveData[] = baseReportData.cognitiveData.map((subject: any) => {
        const result = studentResults?.find(r => r.subjectId === subject.id);
        
        const firstCA = result?.firstCA ?? subject.firstCA ?? 0;
        const secondCA = result?.secondCA ?? subject.secondCA ?? 0;
        const exam = result?.exam ?? subject.exam ?? 0;
        
        const thirdTerm = calculateTermTotal(firstCA, secondCA, exam);
        const firstTerm = subject.firstTerm || Math.max(0, thirdTerm - (Math.random() * 10)); // mock previous terms
        const secondTerm = subject.secondTerm || Math.max(0, thirdTerm - (Math.random() * 5)); // mock previous terms
        const sessionAverage = calculateSessionAverage(firstTerm, secondTerm, thirdTerm);
        const { grade, remarks } = assignGradeAndRemarks(sessionAverage, reportData.gradeScale);
        
        // MOCK: In a real app, this would be fetched from a database for the whole class.
        const mockAllStudentScores = Array.from({ length: reportData.performanceSummary.classSize }, () => Math.floor(Math.random() * 60) + 40);
        mockAllStudentScores[0] = thirdTerm;
        const subjPosition = rankStudent(mockAllStudentScores, thirdTerm);

        return { ...subject, firstCA, secondCA, exam, thirdTerm, firstTerm, secondTerm, sessionAverage: parseFloat(sessionAverage.toFixed(1)), grade, remarks, subjPosition };
    });
    reportData.cognitiveData = calculatedCognitiveData;
    
    // --- 2. Calculate Performance Summary ---
    const totalScoreObtained = calculatedCognitiveData.reduce((acc: number, sub: any) => acc + sub.sessionAverage, 0);
    const totalSubjects = calculatedCognitiveData.length;
    const totalScoreObtainable = totalSubjects > 0 ? totalSubjects * 100 : 0;
    const percentage = totalSubjects > 0 ? (totalScoreObtained / totalSubjects) : 0;
    const { grade: overallGrade } = assignGradeAndRemarks(percentage, reportData.gradeScale);
    
    // MOCK: In a real app, you'd fetch all student totals for ranking.
    const mockAllStudentTotalScores = Array.from({ length: reportData.performanceSummary.classSize }, () => Math.floor(Math.random() * (totalScoreObtainable * 0.7)) + (totalScoreObtainable * 0.2));
    mockAllStudentTotalScores[0] = totalScoreObtained;
    const position = rankStudent(mockAllStudentTotalScores, totalScoreObtained);

    reportData.performanceSummary = {
        ...reportData.performanceSummary,
        totalScoreObtainable,
        totalScoreObtained: parseFloat(totalScoreObtained.toFixed(2)),
        percentage: parseFloat(percentage.toFixed(1)),
        grade: overallGrade,
        position,
    };

    // --- 3. Determine Promotion Status ---
    reportData.status = determinePromotionStatus(reportData.cognitiveData);
    
    // --- 4. Final Touches ---
    reportData.nextSessionBegins = "Mon, 09-Sep-2024";
    reportData.reportDate = new Date().toLocaleDateString('en-GB');

    return reportData;
}
