
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeacherRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/teacher/dashboard');
    }, [router]);

    return null;
}
