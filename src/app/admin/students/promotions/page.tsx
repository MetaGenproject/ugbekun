
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Class, initialClasses } from "@/lib/school-data";
import { type Student, recentStudents } from "@/lib/admin-data";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { promoteStudents } from "@/ai/flows/admin-actions";
import type { AuditLog } from "@/lib/audit-log-data";
import { initialAuditLogs } from "@/lib/audit-log-data";


type PromotionMap = Record<string, string>;

export default function PromotionsPage() {
    const [classes] = useLocalStorage<Class[]>("school-classes", initialClasses);
    const [students, setStudents] = useLocalStorage<Student[]>("students", recentStudents);
    const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>("audit-log", initialAuditLogs);
    const [isLoading, setIsLoading] = useState(false); // No longer fetching from DataStore, so can set to false

    const [promotionMap, setPromotionMap] = useState<PromotionMap>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const classOrder = useMemo(() => {
        const sorted = [...classes].sort((a,b) => a.name.localeCompare(b.name));
        return sorted.map(c => c.name);
    }, [classes]);

    const studentsByClass = useMemo(() => {
        return classes.reduce((acc, cls) => {
            acc[cls.name] = students.filter(s => s.class === cls.name);
            return acc;
        }, {} as Record<string, Student[]>);
    }, [classes, students]);

    const suggestedPromotions = useMemo(() => {
        const suggestions: PromotionMap = {};
        classes.forEach(cls => {
            const currentClassIndex = classOrder.indexOf(cls.name);
            const nextClass = classOrder[currentClassIndex + 1];
            suggestions[cls.name] = nextClass || 'graduate';
        });
        return suggestions;
    }, [classes, classOrder]);

    const handlePromote = async () => {
        setIsProcessing(true);
        try {
            const result = await promoteStudents({ students, promotionMap });
            if (result) {
                setStudents(result.updatedStudents);
                setAuditLogs(prev => [{ ...result.auditLog, id: `log-${Date.now()}`, timestamp: new Date().toISOString() }, ...prev]);

                toast({
                    variant: "success",
                    title: "Promotions Complete!",
                    description: `All selected students have been moved to their new classes. ${result.graduatedCount} students graduated.`,
                });
            } else {
                throw new Error("Promotion failed on the server.");
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Promotion Failed',
                description: 'An error occurred while processing promotions.'
            })
        } finally {
            setIsProcessing(false);
            setIsConfirmOpen(false);
            setPromotionMap({});
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>End of Session Promotions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Promotion Mapping</h3>
                        <p className="text-sm text-muted-foreground">For each class, select the class to promote students to. Use the 'Apply Suggestions' button to auto-fill based on performance.</p>
                        <div className="space-y-3">
                            {classes.map(cls => (
                                <div key={cls.id} className="flex items-center gap-2 p-2 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{cls.name}</p>
                                        <p className="text-xs text-muted-foreground">{studentsByClass[cls.name]?.length || 0} students</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                                    <Select onValueChange={(value) => setPromotionMap(prev => ({...prev, [cls.name]: value}))} value={promotionMap[cls.name] || ''}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select target..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Change</SelectItem>
                                            {classes.filter(c => c.id !== cls.id).map(targetCls => (
                                                <SelectItem key={targetCls.id} value={targetCls.name}>{targetCls.name}</SelectItem>
                                            ))}
                                            <SelectItem value="graduate" className="text-destructive">Graduate Student</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">Promotion Summary</h3>
                                <p className="text-sm text-muted-foreground">Review the changes before confirming.</p>
                            </div>
                             <Button variant="outline" size="sm" onClick={() => setPromotionMap(suggestedPromotions)}>Apply Suggestions</Button>
                        </div>
                        <ScrollArea className="h-96 mt-4 border rounded-lg p-3">
                            {Object.keys(promotionMap).length > 0 ? (
                                <div className="space-y-4">
                                {Object.entries(promotionMap).map(([from, to]) => {
                                    if (to === 'none' || !to) return null;
                                    return (
                                        <div key={from}>
                                            <h4 className="font-medium text-sm flex items-center gap-2">
                                                <span>{from}</span>
                                                <ArrowRight className="h-3 w-3" />
                                                <span className={to === 'graduate' ? 'text-destructive' : 'text-green-600'}>{to === 'graduate' ? 'Graduated' : to}</span>
                                            </h4>
                                            <div className="pl-4 mt-2 space-y-1">
                                                {studentsByClass[from]?.map(student => (
                                                    <div key={student.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                         <Avatar className="h-5 w-5"><AvatarImage src={student.avatar} /><AvatarFallback>{student.initials}</AvatarFallback></Avatar>
                                                         {student.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    No promotions mapped yet.
                                </div>
                            )}
                        </ScrollArea>
                        <Button 
                            className="w-full mt-4" 
                            disabled={Object.keys(promotionMap).length === 0 || isProcessing}
                            onClick={() => setIsConfirmOpen(true)}
                        >
                             {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4"/>}
                             {isProcessing ? "Processing..." : "Confirm & Promote All"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handlePromote}
                title="Confirm Bulk Promotion"
                description="Are you sure you want to promote all selected students? This action cannot be easily undone."
                confirmText="Yes, Promote"
            />
        </>
    );
}
