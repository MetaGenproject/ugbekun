
"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is now deprecated in favor of the more detailed /super-admin/cms/content page.
export default function CmsDashboardPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/super-admin/cms/content');
    }, [router]);
    
    return <div>Redirecting to Content Management...</div>;
}
