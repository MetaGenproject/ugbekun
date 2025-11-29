
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Video,
  ExternalLink,
  MoreHorizontal,
  Search,
  BookOpen,
  Eye,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resource } from "@/lib/resources-data";
import { ResourcePreviewDialog } from "@/components/resources/resource-preview-dialog";
import { AddResourceDialog } from "@/components/resources/add-resource-dialog";
import { format } from "date-fns";
import * as DataStore from "@/lib/data-store";
import { useToast } from "@/hooks/use-toast";

const iconMap = {
  PDF: FileText,
  Video: Video,
  Link: ExternalLink,
  Document: FileText,
};

function ResourceCard({ resource, onSelect, onEdit, onDelete }: { 
    resource: Resource, 
    onSelect: (resource: Resource) => void 
    onEdit: (resource: Resource) => void
    onDelete: (resourceId: string) => void
}) {
  const Icon = iconMap[resource.type];
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center shrink-0">
                <Icon className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{resource.title}</p>
                <p className="text-xs text-muted-foreground">{resource.subject}</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onSelect(resource)}><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(resource)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(resource.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex-1">{resource.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>By {resource.uploader}</span>
            <span>{format(new Date(resource.dateAdded), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeacherResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  useEffect(() => {
      const fetchResources = async () => {
          const data = await DataStore.getResources();
          setResources(data);
          setIsLoading(false);
      }
      fetchResources();
  }, []);

  const subjects = useMemo(() => ["all", ...Array.from(new Set(resources.map(r => r.subject)))], [resources]);
  const types = useMemo(() => ["all", ...Array.from(new Set(resources.map(r => r.type)))], [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => 
      (res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubject === "all" || res.subject === selectedSubject) &&
      (selectedType === "all" || res.type === selectedType)
    )
  }, [resources, searchTerm, selectedSubject, selectedType]);

  const handleAddResource = async (newResourceData: Omit<Resource, 'id'>) => {
    const newResource: Resource = { ...newResourceData, id: `res-${Date.now()}`};
    await DataStore.addResource(newResource);
    setResources(prev => [newResource, ...prev]);
    toast({ variant: 'success', title: 'Resource Added' });
  };
  
  const handleUpdateResource = async (updatedResource: Resource) => {
      await DataStore.updateResource(updatedResource);
      setResources(prev => prev.map(r => r.id === updatedResource.id ? updatedResource : r));
      toast({ variant: 'success', title: 'Resource Updated' });
  };
  
  const handleDeleteResource = async (resourceId: string) => {
      await DataStore.deleteResource(resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
      toast({ variant: 'destructive', title: 'Resource Deleted' });
  };
  
  const openEditDialog = (resource: Resource) => {
      setEditingResource(resource);
      setIsAddDialogOpen(true);
  }

  const openAddDialog = () => {
      setEditingResource(null);
      setIsAddDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Resources</CardTitle>
            </div>
             <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Resource
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
               <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger><SelectValue placeholder="Filter by subject" /></SelectTrigger>
                <SelectContent>
                    {subjects.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub === 'all' ? 'All Subjects' : sub}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
               <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger><SelectValue placeholder="Filter by type" /></SelectTrigger>
                <SelectContent>
                    {types.map(type => (
                        <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((res) => (
                        <ResourceCard key={res.id} resource={res} onSelect={setSelectedResource} onEdit={openEditDialog} onDelete={handleDeleteResource} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>{isLoading ? "Loading resources..." : "No resources found matching your criteria."}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ResourcePreviewDialog 
        resource={selectedResource}
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      />
       <AddResourceDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddResource={handleAddResource}
        onUpdateResource={handleUpdateResource}
        resourceToEdit={editingResource}
      />
    </>
  );
}

    