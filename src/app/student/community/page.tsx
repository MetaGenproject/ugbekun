
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Club } from "@/lib/community-data";
import { initialClubs } from "@/lib/community-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from 'next/link';
import { JoinClubDialog } from "@/components/student-dashboard/join-club-dialog";
import { useToast } from "@/components/ui/use-toast";

export default function CommunityPage() {
    const [clubs, setClubs] = useLocalStorage<Club[]>("student-clubs", initialClubs.slice(0, 2)); // Initially join first 2
    const allClubs = initialClubs;
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const { toast } = useToast();

    const myClubIds = clubs.map(c => c.id);

    const handleJoinClub = (clubId: string) => {
        const clubToJoin = allClubs.find(c => c.id === clubId);
        if (clubToJoin && !myClubIds.includes(clubId)) {
            setClubs(prev => [...prev, clubToJoin]);
            toast({
                variant: 'success',
                title: 'Club Joined!',
                description: `You are now a member of the ${clubToJoin.name}.`
            });
        }
    };

    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Clubs & Societies</CardTitle>
                        </div>
                        <Button onClick={() => setIsJoinDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Join a Club
                        </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map(club => (
                            <Link href={`/student/community/${club.id}`} key={club.id}>
                                <Card className="hover:border-primary/40 transition-colors h-full flex flex-col">
                                    <div className="aspect-[16/9] relative">
                                         <Image src={club.coverImage} alt={club.name} fill className="object-cover rounded-t-lg"/>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col">
                                        <CardTitle className="text-lg">{club.name}</CardTitle>
                                        <CardDescription className="text-xs">{club.category}</CardDescription>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-4">
                                            <Users className="h-4 w-4"/> {club.members} members
                                            <div className="ml-auto flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    {club.leader && <AvatarImage src={club.leader.avatar} />}
                                                    <AvatarFallback>{club.leader?.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs">{club.leader?.name}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                         {clubs.length === 0 && (
                            <div className="md:col-span-2 lg:col-span-3 text-center py-16 text-muted-foreground">
                                You haven't joined any clubs yet.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <JoinClubDialog 
                isOpen={isJoinDialogOpen}
                onClose={() => setIsJoinDialogOpen(false)}
                allClubs={allClubs}
                joinedClubIds={myClubIds}
                onJoinClub={handleJoinClub}
            />
        </>
    );
}

    