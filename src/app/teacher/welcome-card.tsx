
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, ListChecks, Calendar, MessageSquare } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';

const quickActions = [
    { icon: PlusCircle, text: "New Assignment", href: "/teacher/planner" },
    { icon: ListChecks, text: "Gradebook", href: "/teacher/grading" },
    { icon: Calendar, text: "My Schedule", href: "/teacher/schedule" },
    { icon: MessageSquare, text: "Parent Messages", href: "/teacher/messages" },
]

export function WelcomeCard() {
  const image = PlaceHolderImages.find(p => p.id === 'teacher-welcome');
  const router = useRouter();

  return (
    <Card className="shadow-lg overflow-hidden bg-ugbekun-blue-dark text-ugbekun-white relative">
      <CardContent className="p-6 md:p-8">
        <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-semibold tracking-tight">Welcome back, Mr. Adebayo!</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                {quickActions.map((action, index) => (
                    <button key={index} onClick={() => router.push(action.href)} className="flex items-center justify-start gap-2.5 text-left p-3 h-auto rounded-lg bg-ugbekun-white/10 hover:bg-ugbekun-white/20 text-ugbekun-white transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-ugbekun-white/20 text-white grid place-items-center shrink-0">
                            <action.icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">{action.text}</span>
                    </button>
                ))}
            </div>
        </div>
      </CardContent>
       {image && (
         <div className="absolute right-0 bottom-0 h-48 w-48 xl:h-56 xl:w-56 pointer-events-none opacity-80 xl:opacity-100">
            <Image
              src={image.imageUrl}
              alt={image.description}
              data-ai-hint={image.imageHint}
              fill
              className="object-contain"
            />
        </div>
        )}
    </Card>
  );
}
