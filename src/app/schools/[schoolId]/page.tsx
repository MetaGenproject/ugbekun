
"use client";

import * as DataStore from "@/lib/data-store";
import SchoolProfileClient from "./school-profile-client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { School } from "@/lib/super-admin-data";
import type { Student } from "@/lib/admin-data";
import type { Event } from "@/lib/events-data";

export default function SchoolProfilePage() {
    const params = useParams();
    const schoolId = params.schoolId as string;

    const [school, setSchool] = useState<School | undefined>(undefined);
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [schools, students, events] = await Promise.all([
                DataStore.getSchools(),
                DataStore.getStudents(),
                DataStore.getEvents(),
            ]);

            const currentSchool = schools.find(s => s.id === schoolId);
            setSchool(currentSchool);
            setAllStudents(students);
            setAllEvents(events);
            setIsLoading(false);
        };
        fetchData();
    }, [schoolId]);

    if (isLoading) {
        return <div>Loading school profile...</div>
    }

    if (!school) {
        return notFound();
    }
    
    return <SchoolProfileClient school={school} allStudents={allStudents} allEvents={allEvents} />;
}
