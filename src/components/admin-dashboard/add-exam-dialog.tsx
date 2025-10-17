
"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller, useFieldArray } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Exam, Question } from "@/lib/exam-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Class, initialClasses, type Subject, initialSubjects } from "@/lib/school-data";
import { ScrollArea } from "../ui/scroll-area";
import { ResponsiveCalendar } from "../ui/responsive-calendar";
import { AnimatePresence, motion } from "framer-motion";

type AddExamDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddExam: (exam: Omit<Exam, 'id'>) => void;
    onUpdateExam: (exam: Exam) => void;
    examToEdit: Exam | null;
};

type FormValues = Omit<Exam, 'id'>;

export function AddExamDialog({ isOpen, onClose, onAddExam, onUpdateExam, examToEdit }: AddExamDialogProps) {
  const [step, setStep] = useState(0);
  
  const { register, handleSubmit, control, reset, setValue, watch, trigger, getValues } = useForm<FormValues>({
    defaultValues: { questions: [] }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const { toast } = useToast();
  const [classes] = useLocalStorage<Class[]>("school-classes", initialClasses);
  const [subjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);
  
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const initialData = examToEdit 
        ? { ...examToEdit, date: examToEdit.date ? new Date(examToEdit.date).toISOString() : new Date().toISOString() } 
        : {
            title: "",
            class: "",
            subject: "",
            date: new Date().toISOString(),
            status: "Scheduled" as const,
            duration: 60,
            instructions: "Answer all questions. Show all your work.",
            questions: [],
          };
      reset(initialData);
    }
  }, [examToEdit, isOpen, reset]);

  const handleNext = async () => {
    const isValid = await trigger(["title", "class", "subject", "date", "duration"]);
    if (isValid) {
      setStep(1);
    }
  };
  
  const handleBack = () => {
    setStep(0);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (examToEdit) {
        onUpdateExam({ ...examToEdit, ...data });
        toast({ title: "Exam Updated", description: "The examination details have been saved." });
    } else {
        onAddExam(data);
        toast({ title: "Exam Scheduled", description: `${data.title} has been added to the schedule.` });
    }
    onClose();
  };

  const isEditing = !!examToEdit;
  const watchQuestions = watch("questions");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl flex flex-col h-[90vh] max-h-[700px]">
          <DialogHeader>
            <DialogTitle>{examToEdit ? 'Edit Examination' : 'Add New Examination'}</DialogTitle>
            <DialogDescription>
              {step === 0 ? 'Fill in the details to schedule an exam.' : 'Add questions to the exam.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {step === 0 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <div className="grid gap-4 py-6">
                            <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title", { required: true })} placeholder="e.g., Mid-Term Examination" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Controller name="class" control={control} rules={{ required: true }} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select class"/></SelectTrigger><SelectContent>{classes.map(c=><SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select>
                                )} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Controller name="subject" control={control} rules={{ required: true }} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue placeholder="Select subject"/></SelectTrigger><SelectContent>{subjects.map(s=><SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select>
                                )} />
                            </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Controller control={control} name="date" render={({field}) => (
                                    <ResponsiveCalendar selected={field.value ? new Date(field.value) : undefined} onSelect={(d) => field.onChange(d?.toISOString())} variant="outline" className="w-full justify-start">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                    </ResponsiveCalendar>
                                )} />
                            </div>
                            <div className="space-y-2">
                                    <Label>Duration (minutes)</Label>
                                    <Input type="number" {...register("duration", { required: true, valueAsNumber: true })} placeholder="e.g., 60" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Instructions</Label>
                                <Textarea {...register("instructions")} placeholder="e.g., Answer all questions..." />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full flex flex-col">
                        <div className="flex-1 min-h-0">
                          <ScrollArea className="h-full pr-4">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Questions</h3>
                                {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg space-y-3 bg-muted/50 relative">
                                    <Label>Question {index + 1}</Label>
                                    <Textarea placeholder="Question text" {...register(`questions.${index}.text` as const, { required: true })} />
                                    <Controller
                                        control={control}
                                        name={`questions.${index}.type` as const}
                                        defaultValue="multiple-choice"
                                        render={({ field: typeField }) => (
                                            <Select onValueChange={typeField.onChange} value={typeField.value}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                                    <SelectItem value="theory">Theory / Essay</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                        {watchQuestions[index]?.type === 'multiple-choice' && (
                                            <div className="space-y-2">
                                            <Label>Options (comma-separated)</Label>
                                            <Input placeholder="Option A, Option B, Option C" {...register(`questions.${index}.options` as any, { required: true, setValueAs: (value: string) => value.split(',').map(s => s.trim()) })} />
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                        <Label>Correct Answer</Label>
                                        <Input placeholder="Enter the exact correct answer" {...register(`questions.${index}.correctAnswer` as const)} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ id: `q-${Date.now()}`, text: '', type: 'multiple-choice', options: [], correctAnswer: '' })}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add Question
                                </Button>
                            </div>
                          </ScrollArea>
                        </div>
                     </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0 mt-auto">
                {step === 0 && (
                  <>
                      <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                      <div className="flex-grow"></div>
                      <Button type="button" onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </>
                )}
                {step === 1 && (
                    <>
                      <Button type="button" variant="outline" onClick={handleBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                      <div className="flex-grow"></div>
                      <Button type="submit">{examToEdit ? 'Save Changes' : 'Add Examination'}</Button>
                    </>
                )}
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
