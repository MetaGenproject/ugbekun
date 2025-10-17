
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, ShieldCheck, UserPlus, FileBarChart } from 'lucide-react';
import { useState } from 'react';
import { AddSchoolDialog } from './add-school-dialog';
import type { School } from '@/lib/super-admin-data';
import { schoolsData as initialSchoolsData } from '@/lib/super-admin-data';
import type { Notification } from '@/lib/notifications-data';
import { superAdminNotifications } from '@/lib/notifications-data';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

export function WelcomeHeader() {
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);
  const [, setSchools] = useLocalStorage<School[]>('schools', initialSchoolsData);
  const [, setSuperAdminNotifications] = useLocalStorage<Notification[]>('super-admin-notifications', superAdminNotifications);
  const router = useRouter();
  const { toast } = useToast();

   const handleAddSchool = (newSchoolData: Omit<School, 'id' | 'logoUrl' | 'verified' | 'coverImageUrl'>) => {
    const newSchool: School = {
      id: newSchoolData.name.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: `https://placehold.co/32x32/dbeafe/1e3a8a?text=${newSchoolData.name.charAt(0)}`,
      verified: false,
      ...newSchoolData,
    };
    setSchools(prev => [newSchool, ...prev]);

    const newNotification: Notification = {
        id: Date.now(),
        title: "New School Onboarded",
        description: `${newSchool.name} has joined the ${newSchool.plan} plan.`,
        icon: 'Building',
        read: false,
    };
    setSuperAdminNotifications(prev => [newNotification, ...prev]);
  };
  
  const handleActionClick = (action: string) => {
    switch (action) {
      case "Onboard School":
        setIsAddSchoolOpen(true);
        break;
      case "View Platform Reports":
        router.push('/super-admin/analytics');
        break;
      case "Manage Admins":
        router.push('/super-admin/admins');
        break;
      case "Deploy Update":
        toast({ title: 'Feature Not Implemented', description: 'This is a demo and cannot deploy updates.' });
        break;
      default:
        break;
    }
  }
  
  const quickActions = [
    { icon: UserPlus, text: "Onboard School" },
    { icon: FileBarChart, text: "View Platform Reports" },
    { icon: ShieldCheck, text: "Manage Admins" },
    { icon: Rocket, text: "Deploy Update" },
]

  return (
    <>
      <Card className="shadow-lg overflow-hidden bg-primary text-primary-foreground relative">
        <CardContent className="p-6 md:p-8">
          <div className="relative z-10">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight">Welcome, Ugbekun Team!</h2>
              <p className="opacity-80 mt-2 text-sm md:text-base max-w-lg">
                  Here’s the master overview of your entire platform. Let's make education better.
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                  {quickActions.map((action, index) => (
                      <button key={index} onClick={() => handleActionClick(action.text)} className="flex items-center justify-start gap-2.5 text-left p-3 h-auto rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                          <div className="h-8 w-8 rounded-lg bg-primary-foreground/20 grid place-items-center shrink-0">
                              <action.icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-medium">{action.text}</span>
                      </button>
                  ))}
              </div>
          </div>
        </CardContent>
        <div className="absolute right-0 bottom-0 h-48 w-48 xl:h-56 xl:w-56 pointer-events-none opacity-20">
            <Image
                src="https://i.postimg.cc/L6VhzPcS/08-Laptop.png"
                alt="Globe illustration"
                data-ai-hint="globe illustration"
                fill
                className="object-contain"
              />
          </div>
      </Card>
      <AddSchoolDialog
        isOpen={isAddSchoolOpen}
        onClose={() => setIsAddSchoolOpen(false)}
        onAddSchool={handleAddSchool}
      />
    </>
  );
}
