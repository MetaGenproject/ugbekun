
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserPlus, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const children = [
    { id: "UC-AB-2024", name: "Maya Johnson (Aisha)", class: "JSS 1A", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop" },
    { id: "UC-DO-2024", name: "Ethan Johnson (David)", class: "SSS 1A", avatar: "https://i.pravatar.cc/80?u=ethan" },
];

export default function ChildrenPage() {
    const [selectedChild, setSelectedChild] = useState("Maya Johnson (Aisha)");
    const { toast } = useToast();
    const router = useRouter();

    const handleAddChild = () => {
        toast({
            title: "Feature Coming Soon",
            description: "The ability to link another child's account is in development."
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>My Children</CardTitle>
                    <CardDescription>Switch between your children's profiles or view their details.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleAddChild}>
                    <UserPlus className="mr-2 h-4 w-4" /> Link Another Child
                </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {children.map(child => (
                    <Card 
                        key={child.name} 
                        className={`p-4 transition-all relative ${selectedChild === child.name ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={child.avatar} alt={child.name} />
                                <AvatarFallback>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{child.name}</p>
                                <p className="text-sm text-muted-foreground">{child.class}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="sm" variant={selectedChild === child.name ? 'default' : 'outline'} onClick={() => setSelectedChild(child.name)}>
                                     {selectedChild === child.name && <CheckCircle className="mr-2 h-4 w-4" />}
                                     Active
                                </Button>
                                 <Button size="sm" variant="ghost" asChild>
                                    <Link href={`/parent/children/${child.id}`}>
                                        View Profile <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
