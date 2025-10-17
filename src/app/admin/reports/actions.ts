"use server";

import { z } from "zod";
import {
  generateStudentReport,
  GenerateStudentReportInput,
  GenerateStudentReportOutput,
} from "@/ai/flows/generate-student-reports";

export type FormState =
  | {
      status: "idle" | "loading";
    }
  | {
      status: "success";
      data: GenerateStudentReportOutput;
    }
  | {
      status: "error";
      error: string;
    };

const formSchema = z.object({
  studentName: z.string().min(2),
  className: z.string().min(1),
  teacherName: z.string().min(2),
  subjects: z.string().min(3),
  grades: z.string().min(1),
  attendanceRate: z.coerce.number().min(0).max(100),
  behavioralNotes: z.string().optional(),
  strengths: z.string().min(3),
  weaknesses: z.string().min(3),
});

type FormValues = z.infer<typeof formSchema>;

export async function generateStudentReportAction(
  values: FormValues
): Promise<FormState> {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      error: "Invalid form data provided.",
    };
  }
  
  const { subjects, grades, ...rest } = parsed.data;

  try {
    // Transform subjects string to array
    const subjectArray = subjects.split(',').map(s => s.trim()).filter(Boolean);

    // Transform grades string to record
    const gradesRecord = grades.split(',').reduce((acc, pair) => {
        const [key, value] = pair.split(':').map(p => p.trim());
        if (key && value && !isNaN(Number(value))) {
            acc[key] = Number(value);
        }
        return acc;
    }, {} as Record<string, number>);

    if (Object.keys(gradesRecord).length === 0) {
        return {
            status: "error",
            error: "Grades format is invalid. Use 'Subject:Score, Subject2:Score2'."
        }
    }

    const aiInput: GenerateStudentReportInput = {
      ...rest,
      subjects: subjectArray,
      grades: gradesRecord,
    };

    const reportOutput = await generateStudentReport(aiInput);

    return {
      status: "success",
      data: reportOutput,
    };
  } catch (error) {
    console.error("Error generating report:", error);
    return {
      status: "error",
      error: "An unexpected error occurred while generating the report. Please try again.",
    };
  }
}
