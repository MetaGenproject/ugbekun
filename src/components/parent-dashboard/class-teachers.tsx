

/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { staff as initialStaff, Staff } from '@/lib/hr-data';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ClassTeachers() {
  const [staff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const teachers = staff.filter(s => s.department === 'Academics');
  const router = useRouter();

  const handleMessageClick = (teacherId: string) => {
    router.push(`/parent/messages?contactId=${teacherId}`);
  };

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader className="p-6">
        <CardTitle className="text-lg">Maya's Teachers</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
         <ScrollArea className="h-full">
            <div className="p-6 pt-0 space-y-4">
                {teachers.slice(0, 3).map((teacher) => (
                    <div key={teacher.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={teacher.avatar} alt={teacher.name} />
                            <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium tracking-tight">{teacher.name}</div>
                            <p className="text-xs text-muted-foreground truncate">{teacher.role}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleMessageClick(teacher.id)}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
