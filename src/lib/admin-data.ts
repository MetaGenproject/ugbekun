

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

export type Student = {
    id: string;
    name: string;
    class: string;
    avatar: string;
    initials: string;
    status?: 'Active' | 'Alumni';
    
    // New detailed fields
    dateOfBirth: string; // ISO string format
    gender: 'Male' | 'Female';
    parentName: string;
    parentPhone: string;
    parentEmail?: string;
    address: string;
    previousSchool?: string;
}

export const recentStudents: Student[] = [
    { 
        id: 'UC-AB-2024', 
        name: 'Aisha Bello', 
        class: 'JSS 1A', 
        avatar: 'https://i.pravatar.cc/40?img=1', 
        initials: 'AB', 
        status: 'Active',
        dateOfBirth: '2013-05-10',
        gender: 'Female',
        parentName: 'Mr. & Mrs. Bello',
        parentPhone: '08011112222',
        parentEmail: 'bello@example.com',
        address: '12, Freedom Way, Lagos',
        previousSchool: 'Greenfield Primary School',
    },
    { 
        id: 'UC-DO-2024', 
        name: 'David Okon', 
        class: 'SSS 1A', 
        avatar: 'https://i.pravatar.cc/40?img=2', 
        initials: 'DO', 
        status: 'Active',
        dateOfBirth: '2008-11-22',
        gender: 'Male',
        parentName: 'Mr. Okon',
        parentPhone: '08033334444',
        parentEmail: 'okon@example.com',
        address: '45, Unity Drive, Abuja',
        previousSchool: 'Capital Science Academy',
    },
    { 
        id: 'UC-CN-2024', 
        name: 'Chiamaka Nwosu', 
        class: 'JSS 1B', 
        avatar: 'https://i.pravatar.cc/40?img=3', 
        initials: 'CN', 
        status: 'Active',
        dateOfBirth: '2013-08-15',
        gender: 'Female',
        parentName: 'Ms. Nwosu',
        parentPhone: '08055556666',
        parentEmail: 'nwosu@example.com',
        address: '21, Market Road, Onitsha',
    },
    { 
        id: 'UC-TA-2024', 
        name: 'Tunde Adeboye', 
        class: 'JSS 2A', 
        avatar: 'https://i.pravatar.cc/40?img=4', 
        initials: 'TA', 
        status: 'Active',
        dateOfBirth: '2012-03-20',
        gender: 'Male',
        parentName: 'Mr. Adeboye',
        parentPhone: '08077778888',
        parentEmail: 'adeboye@example.com',
        address: '10, Banana Island, Lagos',
    },
    { 
        id: 'UC-FA-2024', 
        name: 'Fatima Aliyu', 
        class: 'SSS 1B', 
        avatar: 'https://i.pravatar.cc/40?img=5', 
        initials: 'FA', 
        status: 'Active',
        dateOfBirth: '2008-09-05',
        gender: 'Female',
        parentName: 'Alhaji Aliyu',
        parentPhone: '08099990000',
        parentEmail: 'aliyu@example.com',
        address: '15, Queen Amina Street, Kano',
    },
];

export type Teacher = {
    name: string;
}

export const teachers: Teacher[] = [
    { name: 'Mr. Adebayo' },
    { name: 'Mrs. Chioma' },
    { name: 'Mr. Okoro' },
    { name: 'Ms. Eze' },
];

