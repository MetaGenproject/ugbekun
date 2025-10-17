
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialDepartments } from "@/lib/school-data";

export function DepartmentManager() {
    const [departments, setDepartments] = useLocalStorage<string[]>("school-departments", initialDepartments);
    const [isLoading, setIsLoading] = useState(true);
    const [newDepartment, setNewDepartment] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(false);
    }, []);
    
    const handleAdd = () => {
        if (!newDepartment.trim()) return;
        setDepartments(prev => [...prev, newDepartment.trim()]);
        setNewDepartment("");
        toast({ variant: 'success', title: 'Department Added' });
    };

    const handleDelete = (departmentToDelete: string) => {
        setDepartments(prev => prev.filter(d => d !== departmentToDelete));
        toast({ variant: "destructive", title: 'Department Removed' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Departments</CardTitle>
                <CardDescription>Add or remove staff departments for your school.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {isLoading ? <p>Loading...</p> : departments.map(dept => (
                        <div key={dept} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                            <span>{dept}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(dept)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex gap-2">
                    <Input 
                        placeholder="Add new department..." 
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                    />
                    <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                </div>
            </CardContent>
        </Card>
    );
}
