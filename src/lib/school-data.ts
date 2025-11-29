

export type Class = {
  id: string;
  name: string;
  teacher: string;
  studentCount: number;
  subjects: number;
};

export const initialClasses: Class[] = [
  {
    id: "jss1a",
    name: "JSS 1A",
    teacher: "Mr. Adebayo",
    studentCount: 1, // Correct count for Aisha Bello
    subjects: 9,
  },
  {
    id: "jss1b",
    name: "JSS 1B",
    teacher: "Ms. Eze",
    studentCount: 1, // Correct count for Chiamaka Nwosu
    subjects: 9,
  },
  {
    id: "jss2a",
    name: "JSS 2A",
    teacher: "Mr. Okoro",
    studentCount: 1, // Correct count for Tunde Adeboye
    subjects: 9,
  },
  {
    id: "sss1a",
    name: "SSS 1A (Science)",
    teacher: "Mrs. Chioma",
    studentCount: 1, // Correct count for David Okon
    subjects: 10,
  },
  {
    id: "sss1b",
    name: "SSS 1B (Arts)",
    teacher: "Mr. Chukwu",
    studentCount: 1, // Correct count for Fatima Aliyu
    subjects: 9,
  },
];


export type Subject = {
  id: string;
  name: string;
  code: string;
  category: "Science" | "Arts" | "Commercial" | "Core" | "Vocational";
  teacher: string;
  progress: number;
  description: string;
  imageId: string;
  syllabus: { topic: string, completed: boolean }[];
};

export const initialSubjects: Subject[] = [
    { id: 'sub-001', name: 'Mathematics', code: 'MTH101', category: 'Core', teacher: 'Mr. Adebayo', progress: 50, description: 'This subject covers fundamental concepts of algebra, geometry, and trigonometry, preparing students for advanced mathematics.', imageId: 'course-linear-algebra', syllabus: [{topic: 'Algebraic Expressions', completed: true}, {topic: 'Linear Equations', completed: true}, {topic: 'Quadratic Equations', completed: false}, {topic: 'Trigonometry', completed: false}] },
    { id: 'sub-002', name: 'English Language', code: 'ENG101', category: 'Core', teacher: 'Mr. Okoro', progress: 66, description: 'Focuses on grammar, composition, and comprehension skills to improve communication.', imageId: 'course-literature', syllabus: [{topic: 'Parts of Speech', completed: true}, {topic: 'Essay Writing', completed: true}, {topic: 'Comprehension', completed: false}] },
    { id: 'sub-003', name: 'Physics', code: 'PHY201', category: 'Science', teacher: 'Mrs. Chioma', progress: 66, description: 'An introduction to the principles of mechanics, heat, and sound.', imageId: 'course-physics', syllabus: [{topic: 'Motion', completed: true}, {topic: 'Forces', completed: true}, {topic: 'Energy', completed: false}] },
    { id: 'sub-004', name: 'Literature in English', code: 'LIT201', category: 'Arts', teacher: 'Ms. Eze', progress: 100, description: 'A survey of Nigerian literature, focusing on major authors and themes.', imageId: 'course-literature', syllabus: [{topic: 'Pre-Colonial Texts', completed: true}, {topic: 'Post-Colonial Novels', completed: true}, {topic: 'Modern Poetry', completed: true}] },
    { id: 'sub-005', name: 'Data Processing', code: 'ACC201', category: 'Commercial', teacher: 'Mr. Chukwu', progress: 66, description: 'Fundamentals of computer systems and data processing techniques.', imageId: 'course-data-structures', syllabus: [{topic: 'Intro to Computers', completed: true}, {topic: 'Binary System', completed: true}, {topic: 'Microsoft Office', completed: false}] },
    { id: 'sub-006', name: 'Yoruba', code: 'YOR101', category: 'Vocational', teacher: 'Mrs. Adekunle', progress: 100, description: 'An introduction to the Yoruba language, culture, and traditions.', imageId: 'course-data-structures', syllabus: [{topic: 'Alphabets & Tones', completed: true}, {topic: 'Basic Conversation', completed: true}, {topic: 'Cultural Significance', completed: true}] },
    { id: 'sub-007', name: 'Basic Science', code: 'SCI101', category: 'Science', teacher: 'Mrs. Chioma', progress: 75, description: 'An introduction to the principles of biology, chemistry, and physics.', imageId: 'course-physics', syllabus: [{topic: 'Living Things', completed: true}, {topic: 'Matter', completed: true}, {topic: 'Energy', completed: true}, {topic: 'The Earth in Space', completed: false}] },
    { id: 'sub-008', name: 'History', code: 'HIS201', category: 'Arts', teacher: 'Mr. Okoro', progress: 50, description: 'A study of major historical events in Nigeria and West Africa.', imageId: 'course-literature', syllabus: [{topic: 'The Nok Culture', completed: true}, {topic: 'The Benin Empire', completed: true}, {topic: 'Independence Movement', completed: false}] }
];

export const initialDepartments: string[] = [
  "Academics",
  "Administration",
  "Health & Wellness",
  "Operations",
  "Finance",
  "Security"
];

    