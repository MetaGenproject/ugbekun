
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Testimonial } from "@/lib/content-data";

type EditTestimonialDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    testimonial: Testimonial | null;
    onSave: (testimonial: Testimonial) => void;
};

type FormValues = Omit<Testimonial, 'id'>;

export function EditTestimonialDialog({ isOpen, onClose, testimonial, onSave }: EditTestimonialDialogProps) {
    const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

    useEffect(() => {
        if (testimonial) {
            setValue("quote", testimonial.quote);
            setValue("name", testimonial.name);
            setValue("role", testimonial.role);
        } else {
            reset({ quote: "", name: "", role: "" });
        }
    }, [testimonial, setValue, reset]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        onSave({ ...data, id: testimonial?.id || '' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{testimonial?.id === 'new' ? "Add Testimonial" : "Edit Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="quote">Quote</Label>
                            <Textarea id="quote" {...register("quote", { required: true })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role / Title</Label>
                            <Input id="role" {...register("role", { required: true })} />
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
