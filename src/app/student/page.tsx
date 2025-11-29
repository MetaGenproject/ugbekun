
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/student/dashboard');
    }, [router]);

    return null;
}
