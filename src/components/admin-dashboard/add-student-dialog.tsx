

"use client";

import * as React from "react";
import { useState, useEffect, type ReactNode } from "react";
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
import { type Student } from "@/lib/admin-data";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Class, initialClasses } from "@/lib/school-data";
import { ArrowLeft, ArrowRight, CheckCircle, Copy, UserPlus, Mail } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ResponsiveCalendar } from '../ui/responsive-calendar';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { generateStudentId } from "@/lib/did";


type AddStudentDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddStudent: (student: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => void;
    onUpdateStudent: (student: Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>) => void;
    studentToEdit: Student | null;
    title?: string;
    description?: string;
};

type FormValues = Omit<Student, 'id' | 'avatar' | 'initials' | 'status'>;

const STEPS = [
    { id: 'personal', title: 'Student Info' },
    { id: 'guardian', title: 'Guardian Info' },
    { id: 'academic', title: 'Academic Info' },
];

type GeneratedCredentials = {
  studentId: string;
  studentEmail: string;
  parentEmail: string;
};

export function AddStudentDialog({ 
    isOpen, 
    onClose, 
    onAddStudent, 
    onUpdateStudent, 
    studentToEdit,
    title,
    description,
}: AddStudentDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [classes] = useLocalStorage<Class[]>("school-classes", initialClasses);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);

  const { register, handleSubmit, control, reset, setValue, trigger } = useForm<FormValues>({
      defaultValues: {
          gender: "Male",
          parentEmail: "",
      }
  });

  const resetDialog = () => {
    reset();
    setCurrentStep(0);
    setIsProcessing(false);
    setGeneratedCredentials(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !generatedCredentials) {
      setCurrentStep(0);
      setIsProcessing(false);
      if (studentToEdit) {
          reset({
              ...studentToEdit,
              dateOfBirth: studentToEdit.dateOfBirth ? new Date(studentToEdit.dateOfBirth) : new Date(),
          });
      } else {
          reset({
              name: '',
              class: '',
              dateOfBirth: new Date(),
              gender: 'Male',
              parentName: '',
              parentPhone: '',
              parentEmail: '',
              address: '',
              previousSchool: '',
          });
      }
    }
  }, [studentToEdit, reset, isOpen, generatedCredentials]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'dateOfBirth', 'gender'];
    if (currentStep === 1) fieldsToValidate = ['parentName', 'parentPhone', 'parentEmail', 'address'];
    if (currentStep === 2) fieldsToValidate = ['class', 'previousSchool'];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.dateOfBirth) {
        toast({ variant: 'destructive', title: 'Error', description: 'Date of Birth is a required field.'});
        return;
    }

    setIsProcessing(true);
    const finalData = { ...data, dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd') };
    
    try {
        if (studentToEdit) {
            onUpdateStudent(finalData);
            toast({ variant: 'success', title: 'Student Updated' });
            resetDialog();
        } else {
            onAddStudent(finalData);
            const studentId = generateStudentId("UC");
            setGeneratedCredentials({
              studentId: studentId,
              studentEmail: `${finalData.name.toLowerCase().replace(/\s/g, '.')}@ugbekun.com`,
              parentEmail: finalData.parentEmail || ''
            });

            toast({ variant: 'success', title: 'Enrollment Successful!', description: `${finalData.name} has been added.` });
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to process request.' });
    } finally {
        if (studentToEdit) {
            setIsProcessing(false);
        }
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  }

  const stepContent = [
    (
        <motion.div key="personal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., Adaobi Okoro" {...register("name", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Controller control={control} name="dateOfBirth" render={({field}) => (
                        <ResponsiveCalendar selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                        </ResponsiveCalendar>
                    )} />
                </div>
                <div className="space-y-2">
                    <Label>Gender</Label>
                    <Controller control={control} name="gender" render={({field}) => (
                        <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select>
                    )} />
                </div>
            </div>
        </motion.div>
    ),
    (
        <motion.div key="guardian" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <div className="space-y-2"><Label>Parent/Guardian Name</Label><Input placeholder="e.g., Mr. & Mrs. Okoro" {...register("parentName", { required: true })}/></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone Number</Label><Input type="tel" placeholder="+234..." {...register("parentPhone", { required: true })}/></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="parent@example.com" {...register("parentEmail")}/></div>
            </div>
            <div className="space-y-2"><Label>Home Address</Label><Input placeholder="e.g., 123 Education Lane, Ikeja" {...register("address", { required: true })}/></div>
        </motion.div>
    ),
    (
        <motion.div key="academic" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <div className="space-y-2"><Label>Admitting to Class</Label>
                <Controller name="class" control={control} rules={{ required: true }} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{classes.map(c=><SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select>
                )} />
            </div>
            <div className="space-y-2"><Label>Previous School (Optional)</Label><Input placeholder="e.g., Greenfield Primary School" {...register("previousSchool")}/></div>
        </motion.div>
    ),
  ];
  
  const successContent = (
      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 grid place-items-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold">Enrollment Complete!</h3>
          <p className="text-sm text-muted-foreground mt-1">Share the following login details with the family.</p>
          <div className="mt-4 space-y-3 text-left">
              <div className="p-3 rounded-lg bg-muted/50 border">
                  <Label className="text-xs">Student Login</Label>
                  <div className="font-mono text-sm mt-1 space-y-1">
                      <p>ID: {generatedCredentials?.studentId} <Copy className="h-3 w-3 inline cursor-pointer" onClick={() => copyToClipboard(generatedCredentials?.studentId || '')}/></p>
                      <p>Pass: `password123`</p>
                  </div>
              </div>
               <div className="p-3 rounded-lg bg-muted/50 border">
                  <Label className="text-xs">Parent/Guardian Login</Label>
                  <div className="font-mono text-sm mt-1 space-y-1">
                      <p>Email: {generatedCredentials?.parentEmail} <Copy className="h-3 w-3 inline cursor-pointer" onClick={() => copyToClipboard(generatedCredentials?.parentEmail || '')}/></p>
                      <p>Pass: `password123`</p>
                  </div>
              </div>
          </div>
           <div className="mt-4 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs text-center flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            <span>Login details have also been sent via email to the parent.</span>
          </div>
      </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={resetDialog}>
      <DialogContent className="sm:max-w-lg">
        {generatedCredentials ? (
            <>
                {successContent}
                <DialogFooter>
                    <Button onClick={resetDialog}>Done</Button>
                </DialogFooter>
            </>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>{title || (studentToEdit ? 'Edit Student Details' : 'Enroll New Student')}</DialogTitle>
                    <DialogDescription>
                        {description || 'Follow the steps to add a new student to your school.'}
                    </DialogDescription>
                    <div className="flex items-center justify-center pt-4">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all", currentStep >= index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>{index + 1}</div>
                                    <div className={cn("text-xs mt-1 transition-colors hidden sm:block", currentStep >= index ? 'text-primary font-semibold' : 'text-muted-foreground')}>{step.title}</div>
                                </div>
                                {index < STEPS.length - 1 && <div className={cn("flex-1 h-px mx-2 transition-colors", currentStep > index ? 'bg-primary' : 'bg-border')}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </DialogHeader>

                <div className="py-6 min-h-[250px] overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        {stepContent[currentStep]}
                    </AnimatePresence>
                </div>
                
                <DialogFooter>
                    <div className="w-full flex justify-between">
                        {currentStep > 0 ? (
                            <Button type="button" variant="outline" onClick={handlePrev}><ArrowLeft className="mr-2 h-4"/> Back</Button>
                        ) : <div></div>}
                        {currentStep < STEPS.length - 1 ? (
                            <Button type="button" onClick={handleNext}>Next <ArrowRight className="ml-2 h-4"/></Button>
                        ) : (
                            <Button type="submit" disabled={isProcessing}>
                                {isProcessing ? 'Enrolling...' : studentToEdit ? "Save Changes" : "Enroll Student"}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
