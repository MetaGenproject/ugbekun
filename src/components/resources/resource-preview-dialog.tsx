
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/lib/resources-data";
import { ExternalLink, Paperclip, Video, FileText } from "lucide-react";

type ResourcePreviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
};

const iconMap = {
  PDF: FileText,
  Video: Video,
  Link: ExternalLink,
  Document: FileText,
};

export function ResourcePreviewDialog({ isOpen, onClose, resource }: ResourcePreviewDialogProps) {
  if (!resource) return null;

  const Icon = iconMap[resource.type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary grid place-items-center shrink-0">
                <Icon className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="flex-1">
                <DialogTitle>{resource.title}</DialogTitle>
                <DialogDescription>
                    {resource.subject} • Uploaded by {resource.uploader}
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
            {resource.type === 'PDF' && (
                <iframe src={resource.url} className="w-full h-[60vh] rounded-md border" title={resource.title}></iframe>
            )}
            {resource.type === 'Video' && (
                 <iframe 
                    className="w-full aspect-video rounded-md border" 
                    src={resource.url} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen>
                </iframe>
            )}
            {(resource.type === 'Link' || resource.type === 'Document') && (
                 <div className="p-6 bg-muted rounded-md text-center">
                    <p className="text-muted-foreground">This is an external resource. Click below to open it in a new tab.</p>
                     <Button asChild className="mt-4">
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Visit Link
                        </a>
                    </Button>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
          <Button asChild>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" download={resource.type === 'PDF' || resource.type === 'Document'}>
                {resource.type === 'PDF' || resource.type === 'Document' ? 'Download' : 'Open in New Tab'}
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
