
"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type GradeScaleItem } from "@/lib/report-card-settings-data";
import { useToast } from "@/hooks/use-toast";

type EditGradeScaleDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    item: GradeScaleItem | null;
    onSave: (item: GradeScaleItem) => void;
};

const formSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  rangeStart: z.coerce.number().min(0).max(100),
  rangeEnd: z.coerce.number().min(0).max(100),
  remark: z.string().min(1, "Remark is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function EditGradeScaleDialog({ isOpen, onClose, item, onSave }: EditGradeScaleDialogProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();

    useEffect(() => {
        if (item) {
            reset(item);
        } else {
            reset({ grade: "", rangeStart: 0, rangeEnd: 0, remark: "" });
        }
    }, [item, reset]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        onSave({ ...data, id: item?.id || '' });
        toast({ variant: 'success', title: "Grade Scale Saved" });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{item ? "Edit Grade" : "Add New Grade"}</DialogTitle>
                        <DialogDescription>Define the parameters for this grade entry.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="grade">Grade</Label>
                                <Input id="grade" {...register("grade")} placeholder="e.g., A+" />
                                {errors.grade && <p className="text-xs text-destructive">{errors.grade.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="remark">Remark</Label>
                                <Input id="remark" {...register("remark")} placeholder="e.g., Excellent" />
                                {errors.remark && <p className="text-xs text-destructive">{errors.remark.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="rangeStart">Range Start (%)</Label>
                                <Input id="rangeStart" type="number" {...register("rangeStart")} placeholder="e.g., 90" />
                                {errors.rangeStart && <p className="text-xs text-destructive">{errors.rangeStart.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="rangeEnd">Range End (%)</Label>
                                <Input id="rangeEnd" type="number" {...register("rangeEnd")} placeholder="e.g., 100" />
                                {errors.rangeEnd && <p className="text-xs text-destructive">{errors.rangeEnd.message}</p>}
                            </div>
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
