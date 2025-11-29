

import type { OnboardingValues } from "@/components/onboarding/onboarding-form";
import type { School } from "./super-admin-data";
import type { Class, Subject } from "./school-data";
import type { Staff } from "./hr-data";
import { generateStudentId } from "./did";
import type { Student } from "./admin-data";
import { recentStudents as demoStudents } from "./admin-data";

// Based on Nigerian curriculum structure
const subjectsByLevel = {
    "Nursery": ["Literacy", "Numeracy", "Creative Arts", "Knowledge of the World"],
    "Primary": ["English Language", "Mathematics", "Basic Science & Technology", "Social Studies", "Civic Education", "Cultural & Creative Arts", "Christian Religious Studies", "Islamic Religious Studies", "Yoruba/Hausa/Igbo", "Physical & Health Education"],
    "Junior Secondary": ["English Language", "Mathematics", "Basic Science", "Basic Technology", "Social Studies", "Civic Education", "Business Studies", "Home Economics", "Agricultural Science", "Fine Art", "Music"],
    "Senior Secondary": ["English Language", "Mathematics", "Civic Education", "Biology", "Chemistry", "Physics", "Literature in English", "Government", "History", "Economics", "Accounting", "Commerce", "Geography", "Further Mathematics"],
    "Sixth Form": ["A-Level Mathematics", "A-Level Physics", "A-Level Chemistry", "A-Level Biology", "A-Level Economics", "A-Level History", "A-Level Literature"]
};

const teachers = [
    { name: 'Mr. Adebayo', department: 'Academics', role: 'Mathematics Teacher' },
    { name: 'Mrs. Chioma', department: 'Academics', role: 'Science Coordinator' },
    { name: 'Mr. Okoro', department: 'Academics', role: 'English Teacher' },
    { name: 'Ms. Eze', department: 'Academics', role: 'Arts Teacher' },
    { name: 'Mr. Chukwu', department: 'Academics', role: 'Commercial Teacher' },
    { name: 'Bisi Adewale', department: 'Administration', role: 'Bursar' },
    { name: 'Ngozi Okeke', department: 'Health & Wellness', role: 'School Nurse' },
];

export function generateInitialSchoolData(formData: OnboardingValues) {
    // 1. Create the School object for the super-admin list
    const revenue = formData.plan === 'Growth' ? 75000 : formData.plan === 'Enterprise' ? 200000 : 0;
    const school: School = {
        id: formData.schoolName.toLowerCase().replace(/\s+/g, '-'),
        name: formData.schoolName,
        logoUrl: `https://placehold.co/32x32/dbeafe/1e3a8a?text=${formData.schoolName.charAt(0)}`,
        status: "Active",
        plan: formData.plan,
        students: 0, // Starts with 0 students
        teachers: 0, // Starts with 0 teachers, will be populated below
        revenue,
        system: formData.system,
        rating: 4.5, // Default rating
        state: formData.state,
        lga: formData.lga,
        verified: formData.system === 'SMSUP+',
        verificationFee: formData.system === 'SMSUP+' ? 500 : undefined,
    };

    // 2. Generate Classes based on selected levels
    const classes: Class[] = [];
    formData.schoolLevels.forEach(level => {
        if (level === "Junior Secondary" || level === "Senior Secondary") {
            ["A", "B"].forEach(arm => { // Create A/B arms for JSS/SSS
                [1, 2, 3].forEach(year => {
                    const levelPrefix = level === "Junior Secondary" ? "JSS" : "SSS";
                    classes.push({
                        id: `${levelPrefix.toLowerCase()}${year}${arm}`,
                        name: `${levelPrefix} ${year}${arm}`,
                        teacher: 'N/A', // Will be assigned later
                        studentCount: 0,
                        subjects: 0, // Will be calculated later
                    });
                });
            });
        } else if (level === "Primary") {
            [1,2,3,4,5,6].forEach(year => {
                 classes.push({
                    id: `primary${year}`,
                    name: `Primary ${year}`,
                    teacher: 'N/A',
                    studentCount: 0,
                    subjects: 0,
                });
            })
        }
    });

    // 3. Generate Subjects based on selected levels and curriculum
    const subjectSet = new Set<string>();
    formData.schoolLevels.forEach(level => {
        (subjectsByLevel[level as keyof typeof subjectsByLevel] || []).forEach(sub => subjectSet.add(sub));
    });

    // Assign teachers to subjects
    let teacherIndex = 0;
    const academicStaff = teachers.filter(t => t.department === 'Academics');
    const subjects: Subject[] = Array.from(subjectSet).map((subName, index) => {
        const assignedTeacher = academicStaff.length > 0 ? academicStaff[teacherIndex % academicStaff.length] : { name: 'N/A' };
        teacherIndex++;
        return {
            id: `sub-00${index + 1}`,
            name: subName,
            code: `${subName.slice(0,3).toUpperCase()}${101 + index}`,
            category: 'Core', // Default to core for now
            teacher: assignedTeacher.name,
            progress: Math.floor(Math.random() * 40) + 30, // Random progress
            description: `An introductory course on ${subName}.`,
            imageId: 'course-data-structures', // default image
            syllabus: [ // Generate mock syllabus
                { topic: `Introduction to ${subName}`, completed: true },
                { topic: `Core Concepts of ${subName}`, completed: true },
                { topic: `Advanced Topics in ${subName}`, completed: false },
                { topic: `Practical Applications`, completed: false },
            ],
        };
    });
    
    // Assign form teachers to classes
    classes.forEach((cls, i) => {
        if (academicStaff.length > 0) {
            cls.teacher = academicStaff[i % academicStaff.length].name;
        }
        cls.subjects = subjects.length; // Simplified: all classes have all subjects
    });

    // 4. Generate initial staff (including the admin who signed up)
    const staff: Staff[] = teachers.map((t, i) => ({
        ...t,
        id: `stf-00${i + 1}`,
        email: `${t.name.split(' ').join('.').toLowerCase()}@${school.id}.com`,
        phone: `+234 80${10000000 + i}`,
        address: formData.address,
        status: "Active",
        avatar: `https://i.pravatar.cc/40?u=stf-00${i+1}`,
        salary: t.department === 'Academics' ? 150000 : 200000,
        assignedClasses: [],
        performance: 80,
    }));
    
    // Add the onboarding admin to the staff list
    if (!staff.some(s => s.email === formData.adminEmail)) {
         staff.unshift({
            id: `stf-000`,
            name: formData.adminName,
            email: formData.adminEmail,
            phone: formData.adminPhone,
            address: formData.address,
            role: formData.adminRole,
            department: 'Administration',
            status: "Active",
            avatar: `https://i.pravatar.cc/40?u=${formData.adminEmail}`,
            salary: 350000,
            assignedClasses: [],
            performance: 90,
        });
    }
    
    // Assign classes to teachers
    staff.forEach(s => {
        if (s.department === 'Academics') {
            const assignedSubjects = subjects.filter(sub => sub.teacher === s.name);
            if (assignedSubjects.length > 0) {
                 s.assignedClasses = classes.slice(0, Math.floor(Math.random() * 2) + 1).map(c => ({ // Assign 1-2 random classes
                    class: c.name,
                    subject: assignedSubjects[Math.floor(Math.random() * assignedSubjects.length)].name,
                    students: Math.floor(Math.random() * 8) + 20
                }));
            }
        }
    });

    school.teachers = staff.filter(s => s.department === 'Academics').length;


    // 5. Always include the demo students for testing purposes
    const students: Student[] = [...demoStudents];
    school.students = students.length;


    return { schools: [school], classes, subjects, staff, students };
}
