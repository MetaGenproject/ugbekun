
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FAQItem } from "@/lib/content-data";

type EditFaqDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    faq: FAQItem | null;
    onSave: (faq: FAQItem) => void;
};

type FormValues = Omit<FAQItem, 'id'>;

export function EditFaqDialog({ isOpen, onClose, faq, onSave }: EditFaqDialogProps) {
    const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

    useEffect(() => {
        if (faq) {
            setValue("question", faq.question);
            setValue("answer", faq.answer);
        } else {
            reset({ question: "", answer: "" });
        }
    }, [faq, setValue, reset]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        onSave({ ...data, id: faq?.id || '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{faq?.id === 'new' ? "Add FAQ" : "Edit FAQ"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input id="question" {...register("question", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="answer">Answer</Label>
                            <Textarea id="answer" {...register("answer", { required: true })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
