
"use client";

import * as DataStore from "@/lib/data-store";
import ChildProfileClient from "./child-profile-client";
import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { type Student } from "@/lib/admin-data";

// Mock data for children - this remains as it represents the parent's specific children, not all students
const childrenData: Record<string, { id: string, name: string, class: string, avatar: string, initials: string, gpa: string, attendance: string }> = {
    "UC-AB-2024": { id: "UC-AB-2024", name: "Maya Johnson (Aisha)", class: "JSS 1A", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop", initials: "MJ", gpa: "3.9", attendance: "99%" },
    "UC-DO-2024": { id: "UC-DO-2024", name: "Ethan Johnson (David)", class: "SSS 1A", avatar: "https://i.pravatar.cc/80?u=ethan", initials: "EJ", gpa: "3.7", attendance: "96%" },
};


export default function ParentChildProfilePage() {
    const params = useParams();
    const childId = params.childId as string;
    
    const [studentData, setStudentData] = useState<Student | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const child = childrenData[childId];
    
    useEffect(() => {
        const fetchStudent = async () => {
            if (child) {
                const allStudents = await DataStore.getStudents();
                const student = allStudents.find((s) => s.id === childId);
                setStudentData(student);
            }
            setIsLoading(false);
        };
        fetchStudent();
    }, [childId, child]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!child || !studentData) {
        return notFound();
    }
    
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ChildProfileClient student={studentData} child={child} />
        </React.Suspense>
    );
}
