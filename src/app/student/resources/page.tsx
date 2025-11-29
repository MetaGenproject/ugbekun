"use client";

import { useState, useMemo } from "react";
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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Resource, initialResources } from "@/lib/resources-data";
import { ResourcePreviewDialog } from "@/components/resources/resource-preview-dialog";
import { format } from "date-fns";

const iconMap = {
  PDF: FileText,
  Video: Video,
  Link: ExternalLink,
  Document: FileText,
};

function ResourceCard({ resource, onSelect }: { resource: Resource, onSelect: (resource: Resource) => void }) {
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
                    <DropdownMenuItem onClick={() => onSelect(resource)}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BookOpen className="mr-2 h-4 w-4" /> Go to Subject
                    </DropdownMenuItem>
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

export default function ResourcesPage() {
  const [resources] = useLocalStorage<Resource[]>("school-resources", initialResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const subjects = useMemo(() => ["all", ...Array.from(new Set(resources.map(r => r.subject)))], [resources]);
  const types = useMemo(() => ["all", ...Array.from(new Set(resources.map(r => r.type)))], [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(res => 
      (res.title.toLowerCase().includes(searchTerm.toLowerCase()) || res.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSubject === "all" || res.subject === selectedSubject) &&
      (selectedType === "all" || res.type === selectedType)
    )
  }, [resources, searchTerm, selectedSubject, selectedType]);

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>
              Find lecture notes, videos, and other materials from your teachers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
               <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map(sub => (
                        <SelectItem key={sub} value={sub}>{sub === 'all' ? 'All Subjects' : sub}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
               <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-auto">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
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
                        <ResourceCard key={res.id} resource={res} onSelect={setSelectedResource} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p>No resources found matching your criteria.</p>
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
    </>
  );
}
