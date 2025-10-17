
"use client";

import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WandSparkles, Loader2, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { generateLessonPlan, type GenerateLessonPlanInput, type GenerateLessonPlanOutput } from "@/ai/flows/generate-lesson-plan";
import { TagInput } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Subject } from "@/lib/school-data";
import { initialSubjects } from "@/lib/school-data";
import type { Staff } from "@/lib/hr-data";
import { staff } from "@/lib/hr-data";

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  topic: z.string().min(3, "Topic is required."),
  gradeLevel: z.string().min(1, "Grade level is required."),
  duration: z.coerce.number().min(5, "Duration must be at least 5 minutes."),
  objectives: z.array(z.string()).min(1, "At least one objective is required."),
  materials: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LessonPlannerPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
    const { toast } = useToast();
    const [allSubjects] = useLocalStorage<Subject[]>("school-subjects", initialSubjects);
    const [allStaff] = useLocalStorage<Staff[]>('school-staff', staff);

    // Mock: Get subjects for logged-in teacher
    const loggedInTeacherName = "Mr. Adebayo";
    const mySubjectNames = useMemo(() => {
        const teacher = allStaff.find(s => s.name === loggedInTeacherName);
        if (!teacher) return [];
        return Array.from(new Set(teacher.assignedClasses.map(c => c.subject)));
    }, [allStaff, loggedInTeacherName]);
    
    const mySubjects = useMemo(() => allSubjects.filter(s => mySubjectNames.includes(s.name)), [allSubjects, mySubjectNames]);


    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: "",
            topic: "",
            gradeLevel: "JSS 1",
            duration: 40,
            objectives: [],
            materials: "Whiteboard, Markers, Textbooks",
        }
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);
        setGeneratedPlan(null);
        try {
            const result: GenerateLessonPlanOutput = await generateLessonPlan(data);
            setGeneratedPlan(result.lessonPlan);
            toast({
                variant: 'success',
                title: "Lesson Plan Generated!",
                description: "Your AI-powered lesson plan is ready below."
            });
        } catch (error) {
            console.error("Lesson plan generation failed", error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "There was an error generating the lesson plan. Please try again."
            })
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        if (generatedPlan) {
            navigator.clipboard.writeText(generatedPlan);
            toast({
                variant: "success",
                title: "Copied to Clipboard",
            });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>AI Lesson Planner</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mySubjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl><Input placeholder="e.g., Photosynthesis" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="gradeLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grade Level</FormLabel>
                                            <FormControl><Input placeholder="e.g., JSS 1" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (minutes)</FormLabel>
                                            <FormControl><Input type="number" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="objectives"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Learning Objectives</FormLabel>
                                        <FormControl>
                                            <TagInput
                                                {...field}
                                                placeholder="Enter an objective and press Enter"
                                                tags={field.value || []}
                                                setTags={(newTags) => {
                                                    form.setValue("objectives", newTags as string[]);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="materials"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Available Materials (Optional)</FormLabel>
                                        <FormControl><Textarea placeholder="e.g., Whiteboard, Markers, Projector" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <WandSparkles className="mr-2 h-4 w-4"/>}
                                Generate Plan
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Card className="min-h-[600px]">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Generated Plan</CardTitle>
                    {generatedPlan && (
                        <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                     {isLoading && (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {generatedPlan ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                        </div>
                    ) : (
                        !isLoading && (
                            <div className="text-center py-12 text-muted-foreground">
                                <CheckCircle className="mx-auto h-12 w-12 opacity-50" />
                                <p className="mt-4">The generated lesson plan will appear here.</p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

    