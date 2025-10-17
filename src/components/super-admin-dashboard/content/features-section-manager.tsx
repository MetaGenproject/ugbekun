
"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LandingPageFeature } from "@/lib/content-data";
import { initialLandingPageFeatures } from "@/lib/content-data";
import { Reorder } from "framer-motion";
import { EditFeatureDialog } from "./edit-feature-dialog";

export function FeaturesSectionManager() {
    const [features, setFeatures] = useLocalStorage<LandingPageFeature[]>("landing-page-features", initialLandingPageFeatures);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<LandingPageFeature | null>(null);
    const { toast } = useToast();

    const openDialog = (feature: LandingPageFeature | null) => {
        setEditingFeature(feature);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setFeatures(prev => prev.filter(item => item.id !== id));
        toast({ variant: "destructive", title: "Feature removed." });
    };

    const handleSave = (itemToSave: LandingPageFeature) => {
        if (editingFeature && editingFeature.id !== 'new') { // Update
            setFeatures(prev => prev.map(item => item.id === itemToSave.id ? itemToSave : item));
            toast({ variant: 'success', title: "Feature Saved" });
        } else { // Add
            setFeatures(prev => [...prev, { ...itemToSave, id: `feat-${Date.now()}` }]);
            toast({ variant: 'success', title: "Feature Added" });
        }
    };
    
    return (
        <>
        <Card>
            <CardHeader className="flex-row justify-between items-center">
                <div>
                    <CardTitle>Features Section</CardTitle>
                    <CardDescription>Manage the features displayed on the landing page.</CardDescription>
                </div>
                <Button onClick={() => openDialog({id: 'new', icon: 'Users', title: '', description: ''})}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
            </CardHeader>
            <CardContent>
                <Reorder.Group axis="y" values={features} onReorder={setFeatures}>
                    <div className="space-y-3">
                    {features.map(feature => (
                        <Reorder.Item key={feature.id} value={feature}>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                                 <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                <div className="flex-1">
                                    <p className="font-semibold">{feature.title}</p>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => openDialog(feature)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(feature.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                        </Reorder.Item>
                    ))}
                    </div>
                </Reorder.Group>
            </CardContent>
        </Card>
        <EditFeatureDialog 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            feature={editingFeature}
            onSave={handleSave}
        />
        </>
    )
}
