
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useRouter } from "next/navigation";
import { type School, schoolsData } from "@/lib/super-admin-data";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MySchoolPage() {
    const [schools] = useLocalStorage<School[]>("schools", schoolsData);
    const router = useRouter();

    useEffect(() => {
        // In a real multi-tenant app, you'd get the admin's school ID from their session.
        // For this demo, we'll assume the admin belongs to the first school in the list.
        if (schools && schools.length > 0) {
            const mySchool = schools[0];
            router.replace(`/schools/${mySchool.id}`);
        } else {
            // If for some reason there are no schools, go to onboarding.
            router.replace('/onboarding');
        }
    }, [schools, router]);
    
    // Render a loading state while redirecting
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="pt-8">
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    )
}
