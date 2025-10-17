
export type Answer = {
  questionId: string;
  value: string;
};

export type Submission = {
  id: string;
  examId: string;
  studentId: string; // In a real app, this would be a user ID
  studentName: string;
  status: 'in-progress' | 'submitted' | 'graded';
  answers: Answer[];
  score?: number;
  grade?: string;
  feedback?: string;
  startedAt: string;
};

// This would be your database table for submissions
export const initialSubmissions: Submission[] = [
    {
        id: 'sub-005',
        examId: 'ex-005',
        studentId: 'UC-AB-2024',
        studentName: 'Aisha Bello',
        status: 'graded',
        answers: [
            { questionId: 'q1', value: 'The measurement was 15.2cm and the period was approximately 2.47s over 5 trials.' },
            { questionId: 'q2', value: 'The data shows that the period of a pendulum is proportional to the square root of its length. A longer pendulum has a longer period.' },
        ],
        score: 88,
        grade: 'A',
        feedback: "Excellent practical work. Your observations were precise and your conclusion was well-supported by the data. Keep up the great work in science!",
        startedAt: new Date(2024, 9, 9, 14, 0, 0).toISOString(),
    },
    {
        id: 'sub-006',
        examId: 'ex-006',
        studentId: 'UC-TA-2024',
        studentName: 'Tunde Adeboye',
        status: 'submitted',
        answers: [{ questionId: 'q1', value: 'Nnamdi Azikiwe' }],
        startedAt: new Date(2024, 9, 8, 10, 0, 0).toISOString(),
    },
     {
        id: 'sub-001-ab',
        examId: 'ex-001',
        studentId: 'UC-AB-2024',
        studentName: 'Aisha Bello',
        status: 'submitted',
        answers: [
            { questionId: 'q1', value: '34cm' },
            { questionId: 'q2', value: '7' },
            { questionId: 'q3', value: 'A prime number only has two factors, 1 and itself, like 11. A composite number has more than two factors, like 12 (1, 2, 3, 4, 6, 12).' },
        ],
        startedAt: new Date(2024, 9, 15, 9, 0, 5).toISOString(),
    },
     {
        id: 'sub-001-ta',
        examId: 'ex-001',
        studentId: 'UC-TA-2024',
        studentName: 'Tunde Adeboye',
        status: 'submitted',
        answers: [
            { questionId: 'q1', value: '17cm' },
            { questionId: 'q2', value: '7' },
            { questionId: 'q3', value: 'Prime numbers are numbers like 2, 3, 5, 7. Composite numbers are numbers that are not prime.' },
        ],
        startedAt: new Date(2024, 9, 15, 9, 1, 10).toISOString(),
    }
];
