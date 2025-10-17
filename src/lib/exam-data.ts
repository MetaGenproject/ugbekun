
import { Clock, CheckCircle, FileText, Hourglass, PenSquare, FileQuestion, BookCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ExamStatus = "Scheduled" | "Ongoing" | "Completed" | "Graded";

export type Question = {
  id: string;
  type: 'multiple-choice' | 'theory';
  text: string;
  options?: string[];
  correctAnswer?: string;
};

export type Exam = {
  id: string;
  title: string;
  class: string;
  subject: string;
  date: string;
  status: ExamStatus;
  duration: number; // Duration in minutes
  instructions: string;
  questions: Question[];
};

export const initialExams: Exam[] = [
  { 
    id: "ex-001", 
    title: "Mid-Term Examination", 
    class: "JSS 2B", 
    subject: "Mathematics", 
    date: new Date(2024, 9, 15, 9, 0, 0).toISOString(), 
    status: "Scheduled",
    duration: 45,
    instructions: "Answer all questions. Multiple choice questions are worth 2 points each. The theory question is worth 6 points.",
    questions: [
        { id: 'q1', type: 'multiple-choice', text: 'If a rectangle has a length of 12cm and a width of 5cm, what is its perimeter?', options: ['17cm', '30cm', '34cm', '60cm'], correctAnswer: '34cm' },
        { id: 'q2', type: 'multiple-choice', text: 'Solve for x: 3x - 7 = 14', options: ['5', '7', '8', '21'], correctAnswer: '7' },
        { id: 'q3', type: 'theory', text: 'Explain the difference between a prime number and a composite number. Provide an example of each.', correctAnswer: 'A prime number has exactly two distinct positive divisors: 1 and itself (e.g., 7). A composite number has more than two positive divisors (e.g., 9).' },
    ]
  },
  { 
    id: "ex-002", 
    title: "English Essay Competition", 
    class: "JSS 2B", 
    subject: "English Language", 
    date: new Date(2024, 9, 18, 11, 0, 0).toISOString(), 
    status: "Ongoing",
    duration: 60,
    instructions: "Write a 500-word essay on the topic provided. Focus on grammar, spelling, and narrative structure.",
    questions: [
        { id: 'q1', type: 'theory', text: 'Write an essay on the topic "A Day I Will Never Forget".', correctAnswer: 'Varies' },
    ]
  },
  { 
    id: "ex-005", 
    title: "Physics Practical", 
    class: "JSS 2B", 
    subject: "Basic Science", 
    date: new Date(2024, 9, 9, 14, 0, 0).toISOString(), 
    status: "Graded",
    duration: 90,
    instructions: "Follow the lab manual to conduct the experiment on pendulum motion. Record your observations and answer the questions.",
    questions: [
       { id: 'q1', type: 'theory', text: 'Measure the length of the provided pendulum and record its period of oscillation for 5 trials.', correctAnswer: 'Varies' },
       { id: 'q2', type: 'theory', text: 'Based on your data, what is the relationship between the length of a pendulum and its period?', correctAnswer: 'The period of a pendulum is proportional to the square root of its length.' },
    ]
  },
  { 
    id: "ex-006", 
    title: "History Test 1", 
    class: "SSS 1B", 
    subject: "History", 
    date: new Date(2024, 9, 8, 10, 0, 0).toISOString(), 
    status: "Completed",
    duration: 30,
    instructions: "Answer all questions to the best of your ability.",
    questions: [
        { id: 'q1', type: 'multiple-choice', text: 'Who was the first president of Nigeria?', options: ['Nnamdi Azikiwe', 'Abubakar Tafawa Balewa', 'Olusegun Obasanjo'], correctAnswer: 'Nnamdi Azikiwe' },
        { id: 'q2', type: 'multiple-choice', text: 'In what year did Nigeria gain independence?', options: ['1958', '1960', '1963', '1966'], correctAnswer: '1960' },
    ]
  },
   { 
    id: "ex-004", 
    title: "End of Term Examination", 
    class: "JSS 1 - SSS 3", 
    subject: "All Subjects", 
    date: new Date(2024, 11, 10, 9, 0, 0).toISOString(), 
    status: "Scheduled",
    duration: 120,
    instructions: "Comprehensive exam covering all subjects taught during the term.",
    questions: [],
   },
];

export const statusStyles: Record<ExamStatus, string> = {
  Scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
  Ongoing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300 animate-pulse",
  Completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  Graded: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
};

export const statusIcons: Record<ExamStatus, LucideIcon> = {
    Scheduled: Clock,
    Ongoing: Hourglass,
    Completed: FileQuestion,
    Graded: BookCheck,
};
