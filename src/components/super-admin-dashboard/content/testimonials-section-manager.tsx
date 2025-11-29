
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/lib/content-data";
import { initialTestimonials } from "@/lib/content-data";
import { Reorder } from "framer-motion";
import { EditTestimonialDialog } from "./edit-testimonial-dialog";

export function TestimonialsSectionManager() {
    const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>("landing-page-testimonials", initialTestimonials);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const { toast } = useToast();

    const openDialog = (item: Testimonial | null) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setTestimonials(prev => prev.filter(item => item.id !== id));
        toast({ variant: "destructive", title: "Testimonial removed." });
    };

    const handleSave = (itemToSave: Testimonial) => {
        if (editingItem && editingItem.id !== 'new') { // Update
            setTestimonials(prev => prev.map(item => item.id === itemToSave.id ? itemToSave : item));
            toast({ variant: 'success', title: "Testimonial Saved" });
        } else { // Add
            setTestimonials(prev => [...prev, { ...itemToSave, id: `testimonial-${Date.now()}` }]);
            toast({ variant: 'success', title: "Testimonial Added" });
        }
    };
    
    return (
        <>
        <Card>
            <CardHeader className="flex-row justify-between items-center">
                <div>
                    <CardTitle>Testimonials Section</CardTitle>
                    <CardDescription>Manage the customer testimonials on the landing page.</CardDescription>
                </div>
                <Button onClick={() => openDialog({id: 'new', quote: '', name: '', role: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
            </CardHeader>
            <CardContent>
                <Reorder.Group axis="y" values={testimonials} onReorder={setTestimonials}>
                    <div className="space-y-3">
                    {testimonials.map(item => (
                        <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                                 <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                <div className="flex-1">
                                    <p className="font-semibold italic">"{item.quote}"</p>
                                    <p className="text-sm text-muted-foreground mt-1">- {item.name}, {item.role}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => openDialog(item)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                        </Reorder.Item>
                    ))}
                    </div>
                </Reorder.Group>
            </CardContent>
        </Card>
        <EditTestimonialDialog 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            testimonial={editingItem}
            onSave={handleSave}
        />
        </>
    )
}
