

export type Student = {
    id: string;
    name: string;
    class: string;
    avatar: string;
    initials: string;
    status?: 'Active' | 'Alumni';
    
    dateOfBirth: string; 
    gender: 'Male' | 'Female';
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    address: string;
    previousSchool?: string;
}

export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  department: "Academics" | "Administration" | "Health & Wellness" | "Operations";
  status: "Active" | "On Leave" | "Inactive";
  avatar: string;
  salary: number;
  teacherType?: 'Form Teacher' | 'Subject Teacher' | 'Both';
  formClass?: string;
  assignedClasses: {
    class: string;
    subject: string;
    students: number;
  }[];
  performance: number; 
};


export type AffectiveTrait = {
    id: string;
    trait: string;
}

export type PsychomotorSkill = {
    id: string;
    skill: string;
}

