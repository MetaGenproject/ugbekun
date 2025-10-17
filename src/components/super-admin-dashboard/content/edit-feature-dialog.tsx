
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LandingPageFeature } from "@/lib/content-data";

type EditFeatureDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    feature: LandingPageFeature | null;
    onSave: (feature: LandingPageFeature) => void;
};

type FormValues = Omit<LandingPageFeature, 'id' | 'icon'>;

export function EditFeatureDialog({ isOpen, onClose, feature, onSave }: EditFeatureDialogProps) {
    const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

    useEffect(() => {
        if (feature) {
            setValue("title", feature.title);
            setValue("description", feature.description);
        } else {
            reset({ title: "", description: "" });
        }
    }, [feature, setValue, reset]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        onSave({ ...data, id: feature?.id || '', icon: feature?.icon || 'Users' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{feature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register("description", { required: true })} />
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
