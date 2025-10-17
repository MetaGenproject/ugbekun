
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FAQItem } from "@/lib/content-data";
import { initialFaqs } from "@/lib/content-data";
import { Reorder } from "framer-motion";
import { EditFaqDialog } from "./edit-faq-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqSectionManager() {
    const [faqs, setFaqs] = useLocalStorage<FAQItem[]>("landing-page-faqs", initialFaqs);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
    const { toast } = useToast();

    const openDialog = (item: FAQItem | null) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setFaqs(prev => prev.filter(item => item.id !== id));
        toast({ variant: "destructive", title: "FAQ removed." });
    };

    const handleSave = (itemToSave: FAQItem) => {
        if (editingItem && editingItem.id !== 'new') { // Update
            setFaqs(prev => prev.map(item => item.id === itemToSave.id ? itemToSave : item));
            toast({ variant: 'success', title: "FAQ Saved" });
        } else { // Add
            setFaqs(prev => [...prev, { ...itemToSave, id: `faq-${Date.now()}` }]);
            toast({ variant: 'success', title: "FAQ Added" });
        }
    };
    
    return (
        <>
        <Card>
            <CardHeader className="flex-row justify-between items-center">
                <div>
                    <CardTitle>FAQ Section</CardTitle>
                    <CardDescription>Manage the Frequently Asked Questions on the landing page.</CardDescription>
                </div>
                <Button onClick={() => openDialog({id: 'new', question: '', answer: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
            </CardHeader>
            <CardContent>
                <Reorder.Group axis="y" values={faqs} onReorder={setFaqs}>
                    <div className="space-y-3">
                    {faqs.map(faq => (
                        <Reorder.Item key={faq.id} value={faq}>
                           <div className="flex items-center gap-2 p-1 rounded-lg bg-muted/50 border">
                                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab ml-2" />
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1" className="border-b-0">
                                        <AccordionTrigger className="hover:no-underline py-2 px-2">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="px-2 pb-2 text-muted-foreground">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Button variant="ghost" size="icon" onClick={() => openDialog(faq)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                           </div>
                        </Reorder.Item>
                    ))}
                    </div>
                </Reorder.Group>
            </CardContent>
        </Card>
        <EditFaqDialog 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            faq={editingItem}
            onSave={handleSave}
        />
        </>
    )
}
