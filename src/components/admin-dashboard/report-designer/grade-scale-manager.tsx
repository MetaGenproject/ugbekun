
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { GradeScaleItem } from "@/lib/report-card-settings-data";
import { initialGradeScale } from "@/lib/report-card-settings-data";
import { EditGradeScaleDialog } from "./edit-grade-scale-dialog";

export function GradeScaleManager() {
    const [gradeScale, setGradeScale] = useLocalStorage<GradeScaleItem[]>("grade-scale-settings", initialGradeScale);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GradeScaleItem | null>(null);
    const { toast } = useToast();

    const openDialog = (item: GradeScaleItem | null) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setGradeScale(prev => prev.filter(item => item.id !== id));
        toast({ variant: "destructive", title: "Grade scale item removed." });
    };
    
    const handleSave = (itemToSave: GradeScaleItem) => {
        if (editingItem) { // Update
            setGradeScale(prev => prev.map(item => item.id === itemToSave.id ? itemToSave : item));
        } else { // Add
            setGradeScale(prev => [...prev, { ...itemToSave, id: `gs-${Date.now()}` }]);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Grading Scale</CardTitle>
                        <CardDescription>Define the score ranges, grades, and remarks for your school.</CardDescription>
                    </div>
                    <Button onClick={() => openDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Grade
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Grade</TableHead>
                                <TableHead>Score Range</TableHead>
                                <TableHead>Remark</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {gradeScale.sort((a,b) => b.rangeStart - a.rangeStart).map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold">{item.grade}</TableCell>
                                    <TableCell>{item.rangeStart}% - {item.rangeEnd}%</TableCell>
                                    <TableCell>{item.remark}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openDialog(item)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4"/> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EditGradeScaleDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                item={editingItem}
                onSave={handleSave}
            />
        </>
    )
}
