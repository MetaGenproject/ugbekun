
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ParentRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/parent/dashboard');
    }, [router]);

    return null;
}
