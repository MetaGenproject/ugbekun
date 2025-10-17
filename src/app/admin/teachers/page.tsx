
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated and redirects to the new /admin/hr page.
export default function DeprecatedTeachersPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/hr');
    }, [router]);
    
    return <div>Redirecting to Staff (HR)...</div>;
}
