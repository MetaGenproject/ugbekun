/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wellnessNote } from '@/lib/parent-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function WellnessCard() {
  const { toast } = useToast();
  const router = useRouter();

  const handleNotify = () => {
    toast({
      variant: 'success',
      title: "Nurse Notified",
      description: "A message has been sent to the school nurse regarding Maya's wellness."
    });
    router.push('/parent/chat');
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Wellness Notes</CardTitle>
        <Button variant="outline" size="sm" onClick={handleNotify}>Notify nurse</Button>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center text-secondary-foreground shrink-0">
            <wellnessNote.icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium tracking-tight">{wellnessNote.title}</div>
            <div className="text-xs text-muted-foreground">{wellnessNote.details}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
