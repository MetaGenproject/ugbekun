
"use client";

import * as DataStore from "@/lib/data-store";
import StudentCredentialClientPage from "./client-page";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/admin-data";
import type { School } from "@/lib/super-admin-data";
import type { VerifiableCredential } from "@/lib/credentials-data";

export default function StudentCredentialPage() {
    const params = useParams();
    const studentId = params.studentId as string;
    
    const [studentData, setStudentData] = useState<Student | undefined>(undefined);
    const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
    const [publicCreds, setPublicCreds] = useState<VerifiableCredential[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [allStudents, allSchools, allCredentials] = await Promise.all([
                DataStore.getStudents(),
                DataStore.getSchools(),
                DataStore.getVerifiableCredentials()
            ]);
            
            const student = allStudents.find((s) => s.id === studentId);
            setStudentData(student);
            setSchoolData(allSchools[0]);
            setPublicCreds(allCredentials.filter(vc => vc.studentId === studentId && vc.isPublic));

            setIsLoading(false);
        };
        fetchData();
    }, [studentId]);


    if (isLoading) {
        return <div>Loading credentials...</div>;
    }
    
    if (!studentData) {
        return notFound();
    }

    return <StudentCredentialClientPage student={studentData} school={schoolData} publicCredentials={publicCreds} />;
}
