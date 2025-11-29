
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AffectiveTrait, PsychomotorSkill } from "@/lib/report-card-settings-data";
import { initialAffectiveTraits, initialPsychomotorSkills } from "@/lib/report-card-settings-data";
import { Input } from "@/components/ui/input";

type TraitManagerProps = {
    domain: 'affective' | 'psychomotor';
    title: string;
    description: string;
};

export function TraitManager({ domain, title, description }: TraitManagerProps) {
    const isAffective = domain === 'affective';
    const [traits, setTraits] = useLocalStorage<AffectiveTrait[] | PsychomotorSkill[]>(
        isAffective ? "affective-traits-settings" : "psychomotor-skills-settings",
        isAffective ? initialAffectiveTraits : initialPsychomotorSkills
    );
    const [newTrait, setNewTrait] = useState("");
    const { toast } = useToast();
    
    const handleAdd = () => {
        if (!newTrait.trim()) return;
        const newItem = { id: `${domain.slice(0,2)}-${Date.now()}`, [isAffective ? 'trait' : 'skill']: newTrait };
        setTraits(prev => [...prev, newItem]);
        setNewTrait("");
        toast({ variant: 'success', title: 'Trait Added' });
    };

    const handleDelete = (id: string) => {
        setTraits(prev => prev.filter(item => item.id !== id));
        toast({ variant: "destructive", title: 'Trait Removed' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {traits.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                            <span>{isAffective ? (item as AffectiveTrait).trait : (item as PsychomotorSkill).skill}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item.id)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Input 
                        placeholder="Add new item..." 
                        value={newTrait}
                        onChange={(e) => setNewTrait(e.target.value)}
                    />
                    <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
