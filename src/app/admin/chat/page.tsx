"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page is deprecated and redirects to the new /messages route.
export default function DeprecatedChatPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/messages');
    }, [router]);
    
    return <div>Redirecting...</div>;
}
