

export type StudentResult = {
    studentId: string;
    subjectId: string;
    firstCA?: number; // out of 20
    secondCA?: number; // out of 20
    exam?: number; // out of 60
    total?: number; // Calculated
}

export type ClassResults = {
    [classId: string]: {
        [subjectId: string]: StudentResult[];
    };
}

// In a real app, this would start as an empty object
export const initialResults: ClassResults = {
    "JSS 1A": { // Class Name
        "sub-001": [ // Subject ID for Mathematics
            { studentId: "UC-AB-2024", subjectId: "sub-001", firstCA: 18, secondCA: 17, exam: 50, total: 85 },
        ],
        "sub-002": [ // Subject ID for English
             { studentId: "UC-AB-2024", subjectId: "sub-002", firstCA: 19, secondCA: 18, exam: 55, total: 92 },
        ],
        "sub-007": [ // Subject ID for Basic Science
            { studentId: "UC-AB-2024", subjectId: "sub-007", firstCA: 17, secondCA: 16, exam: 48, total: 81 },
        ]
    },
    "JSS 2A": {
        "sub-001": [ // Subject ID for Mathematics
            { studentId: "UC-TA-2024", subjectId: "sub-001", firstCA: 15, secondCA: 14, exam: 40, total: 69 },
        ]
    }
};

