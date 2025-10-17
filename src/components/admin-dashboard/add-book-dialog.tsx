
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
import { useForm, SubmitHandler } from "react-hook-form";
import type { Book } from "@/lib/library-data";

type AddBookDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddBook: (book: Omit<Book, 'id'>) => void;
    onUpdateBook: (book: Book) => void;
    bookToEdit: Book | null;
};

type FormValues = Omit<Book, 'id'>;

export function AddBookDialog({ isOpen, onClose, onAddBook, onUpdateBook, bookToEdit }: AddBookDialogProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
        if (bookToEdit) {
            setValue("title", bookToEdit.title);
            setValue("author", bookToEdit.author);
            setValue("isbn", bookToEdit.isbn);
            setValue("copies", bookToEdit.copies);
            setValue("available", bookToEdit.available);
        } else {
            reset({
                title: "",
                author: "",
                isbn: "",
                copies: 1,
                available: 1
            });
        }
    }
  }, [bookToEdit, setValue, reset, isOpen]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (bookToEdit) {
         onUpdateBook({ ...bookToEdit, ...data });
    } else {
        onAddBook(data);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{bookToEdit ? "Edit Book" : "Add New Book"}</DialogTitle>
                <DialogDescription>
                    Fill in the details for the library book.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title", { required: true })} placeholder="e.g., Things Fall Apart" />
                    {errors.title && <p className="text-xs text-destructive">Title is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" {...register("author", { required: true })} placeholder="e.g., Chinua Achebe" />
                    {errors.author && <p className="text-xs text-destructive">Author is required.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" {...register("isbn", { required: true })} placeholder="e.g., 978-0385474542" />
                    {errors.isbn && <p className="text-xs text-destructive">ISBN is required.</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="copies">Total Copies</Label>
                        <Input id="copies" type="number" {...register("copies", { required: true, valueAsNumber: true, min: 1 })} placeholder="e.g., 15" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="available">Available Copies</Label>
                        <Input id="available" type="number" {...register("available", { required: true, valueAsNumber: true, min: 0 })} placeholder="e.g., 12" />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">{bookToEdit ? "Save Changes" : "Add Book"}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
