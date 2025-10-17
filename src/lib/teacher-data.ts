

import { BookOpen, CalendarCheck, Edit, Users } from "lucide-react";

export type AssignmentToGrade = {
  id: string;
  title: string;
  class: string;
  submissions: number;
  totalStudents: number;
  dueDate: string;
};

export const assignmentsToGrade: AssignmentToGrade[] = [
    { id: "ex-006", title: "History Test 1", class: "SSS 1B", submissions: 15, totalStudents: 22, dueDate: "2024-10-08" },
    { id: "asg-002", title: "Poetry Analysis", class: "JSS 3A", submissions: 28, totalStudents: 35, dueDate: "2024-10-12" },
    { id: "ex-001", title: "Mid-Term Examination", class: "JSS 2B", submissions: 28, totalStudents: 28, dueDate: "2024-10-15" },
];

export const teacherStats = [
    { title: "Classes", value: "4", icon: BookOpen },
    { title: "Students", value: "115", icon: Users },
    { title: "Avg. Attendance", value: "96%", icon: CalendarCheck },
    { title: "Grading Queue", value: "8", icon: Edit },
];
