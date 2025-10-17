
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import type { Resource, ResourceType } from "@/lib/resources-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Subject, initialSubjects } from "@/lib/school-data";
import { ScrollArea } from "../ui/scroll-area";

type AddResourceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource: (resource: Resource) => void;
  resourceToEdit: Resource | null;
};

type FormValues = Omit<Resource, 'id' | 'dateAdded' | 'uploader'>;

const resourceTypes: ResourceType[] = ["PDF", "Video", "Link", "Document"];

export function AddResourceDialog({ isOpen, onClose, onAddResource, onUpdateResource, resourceToEdit }: AddResourceDialogProps) {
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormValues>();
  const [subjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);

  useEffect(() => {
    if (isOpen) {
      if (resourceToEdit) {
        setValue("title", resourceToEdit.title);
        setValue("description", resourceToEdit.description);
        setValue("type", resourceToEdit.type);
        setValue("subject", resourceToEdit.subject);
        setValue("url", resourceToEdit.url);
        setValue("fileSize", resourceToEdit.fileSize);
      } else {
        reset({
          title: "",
          description: "",
          type: "PDF",
          subject: subjects[0]?.name || "",
          url: "",
          fileSize: "",
        });
      }
    }
  }, [resourceToEdit, isOpen, setValue, reset, subjects]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (resourceToEdit) {
        onUpdateResource({ 
            ...resourceToEdit, 
            ...data,
            dateAdded: new Date().toISOString() // Update date on edit
        });
    } else {
        onAddResource({ 
            ...data, 
            dateAdded: new Date().toISOString(),
            uploader: "Mr. Adebayo" // Mock uploader
        });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{resourceToEdit ? "Edit Resource" : "Add New Resource"}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the learning material.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="grid gap-4 py-6 px-1">
                  <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" {...register("title", { required: "Title is required" })} />
                      {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" {...register("description", { required: "Description is required" })} />
                      {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Controller
                              name="subject"
                              control={control}
                              render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                                      <SelectContent>
                                          {subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              )}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="type">Resource Type</Label>
                          <Controller
                              name="type"
                              control={control}
                              render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                      <SelectContent>
                                          {resourceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                              )}
                          />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="url">URL / Link</Label>
                      <Input id="url" placeholder="https://..." {...register("url", { required: "URL is required" })} />
                      {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="fileSize">File Size (Optional)</Label>
                      <Input id="fileSize" placeholder="e.g., 2.5 MB" {...register("fileSize")} />
                  </div>
              </div>
            </ScrollArea>
            <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{resourceToEdit ? "Save Changes" : "Add Resource"}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
