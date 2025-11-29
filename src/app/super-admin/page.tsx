
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuperAdminRootPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/super-admin/dashboard');
    }, [router]);

    return null;
}
