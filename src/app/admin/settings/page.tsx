
import { Suspense } from 'react';
import { SettingsPageClient } from './settings-client-page';
import { Skeleton } from '@/components/ui/skeleton';

// A simple skeleton loader for the settings page
function SettingsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsPageClient />
    </Suspense>
  );
}
