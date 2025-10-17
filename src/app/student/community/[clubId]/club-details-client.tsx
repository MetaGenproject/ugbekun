
"use client";

import { useRouter } from 'next/navigation';
import { type Club } from '@/lib/community-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rss, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ClubDetailsClientProps {
    club: Club;
}

export default function ClubDetailsClient({ club }: ClubDetailsClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    
    const handlePost = () => {
        toast({ title: "Post successful!", description: "Your message has been shared with the club."});
        // In a real app, you'd clear the textarea.
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4"/>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{club.name}</h1>
                    <p className="text-muted-foreground">{club.category}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                 <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Textarea placeholder="Share an update with the club..." rows={4}/>
                             <div className="flex justify-end mt-4">
                                <Button onClick={handlePost}>
                                    <Send className="mr-2 h-4 w-4"/> Share Post
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                         <CardContent className="text-center py-16 text-muted-foreground">
                            <Rss className="h-12 w-12 mx-auto opacity-50"/>
                            <p className="mt-4">No recent activity in this club yet.</p>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                             <div className="aspect-[16/9] relative mb-4">
                                 <Image src={club.coverImage} alt={club.name} fill className="object-cover rounded-lg"/>
                            </div>
                            <CardTitle>{club.name}</CardTitle>
                            <CardDescription>Est. 2021</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{club.description}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Members ({club.members})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    {club.leader && <AvatarImage src={club.leader.avatar} />}
                                    <AvatarFallback>{club.leader?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{club.leader?.name}</p>
                                    <p className="text-xs text-muted-foreground">Club President</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}
