"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated and redirects to the new /teacher/clock-in page.
export default function DeprecatedClockInPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/teacher/clock-in');
    }, [router]);
    
    return <div>Redirecting to Clock-in...</div>;
}
