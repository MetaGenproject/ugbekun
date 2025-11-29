"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateStudentReportAction, type FormState } from "./actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Student } from "@/lib/admin-data";
import { recentStudents as initialStudents } from "@/lib/admin-data";
import { type Staff, staff as initialStaff } from "@/lib/hr-data";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle, UserPlus, FileBarChart, WandSparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  studentName: z.string().min(2, "Student name is required."),
  className: z.string().min(1, "Class name is required."),
  teacherName: z.string().min(2, "Teacher name is required."),
  subjects: z.string().min(3, "Enter at least one subject (comma-separated)."),
  grades: z.string().min(1, "Enter grades like 'Math:85, English:92'."),
  attendanceRate: z.coerce.number().min(0).max(100),
  behavioralNotes: z.string().optional(),
  strengths: z.string().min(3, "Strengths are required."),
  weaknesses: z.string().min(3, "Weaknesses are required."),
});

type FormValues = z.infer<typeof formSchema>;

export function ReportGeneratorForm() {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const [students] = useLocalStorage<Student[]>("students", initialStudents);
  const [staff] = useLocalStorage<Staff[]>("school-staff", initialStaff);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const teachers = staff.filter(s => s.department === "Academics");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      className: "",
      teacherName: "",
      subjects: "",
      grades: "",
      attendanceRate: 98,
      behavioralNotes: "Shows great potential and is always willing to help others.",
      strengths: "",
      weaknesses: "",
    },
  });

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      form.setValue("studentName", student.name);
      form.setValue("className", student.class);
      // MOCK DATA: In a real app, this would be fetched from a database
      form.setValue("teacherName", "Mr. Adebayo");
      form.setValue("subjects", "Mathematics, English, Basic Science, Social Studies, Civic Education");
      form.setValue("grades", "Mathematics:88, English:92, Basic Science:85, Social Studies:89, Civic Education:95");
      form.setValue("strengths", `Exceptional performance in English and Social Studies.`);
      form.setValue("weaknesses", `Needs to show more workings in Mathematics problem-solving.`);
    }
  }

  const handleViewFullReport = () => {
    if (selectedStudent) {
        router.push(`/admin/reports/${selectedStudent.id}`);
    } else {
        toast({
            variant: "destructive",
            title: "No Student Selected",
            description: "Please select a student to view their full report card.",
        });
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.studentName || !data.className) {
        toast({
            variant: "destructive",
            title: "Student Not Selected",
            description: "Please select a student before generating a report."
        });
        return;
    }
    setFormState({ status: "loading" });
    const result = await generateStudentReportAction(data);
    setFormState(result);

    if (result.status === "error") {
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description: result.error,
      });
    } else if (result.status === 'success') {
      toast({
        variant: 'success',
        title: 'Report Generated Successfully',
        description: 'The AI-powered report is ready.',
      });
    }
  };

  const copyToClipboard = () => {
    if (formState.status === "success" && formState.data) {
      navigator.clipboard.writeText(formState.data.report);
      toast({
        variant: "success",
        title: "Copied to Clipboard",
        description: "The report has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label>Select Student</Label>
                <Select onValueChange={handleStudentSelect} value={selectedStudent?.id || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a student to begin..." />
                    </SelectTrigger>
                    <SelectContent>
                        {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                                <div className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    <span>{student.name} - ({student.class})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Select a student above" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <FormControl>
                    <Input placeholder="Select a student above" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="teacherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher Name</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <FormControl>
                    <Input placeholder="Math, English, ..." {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="grades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grades</FormLabel>
                  <FormControl>
                    <Input placeholder="Math:85, English:92" {...field} />
                  </FormControl>
                  <FormDescription>Subject:Score, separated by commas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="attendanceRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 95" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strengths</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What the student excels at..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="weaknesses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas for Improvement</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Where the student can improve..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="behavioralNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Behavioral Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observations on student behavior..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={formState.status === 'loading' || !selectedStudent}>
                {formState.status === 'loading' ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
                ) : (
                <>
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                </>
                )}
            </Button>
            <Button type="button" variant="secondary" onClick={handleViewFullReport} disabled={!selectedStudent}>
                <FileBarChart className="mr-2 h-4 w-4" />
                View Full Report Card
            </Button>
          </div>
        </form>
      </Form>
      <div className="lg:mt-8">
        <Card className="min-h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Report</CardTitle>
            {formState.status === "success" && (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            )}
          </CardHeader>
          <CardContent>
            {formState.status === 'loading' && (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
             {formState.status === 'idle' && (
                <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="mx-auto h-12 w-12 opacity-50" />
                    <p className="mt-4">The generated report summary will appear here.</p>
                </div>
            )}
            {formState.status === 'success' && formState.data && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{formState.data.report}</ReactMarkdown>
              </div>
            )}
            {formState.status === 'error' && (
                 <p className="text-destructive text-center py-12">{formState.error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
