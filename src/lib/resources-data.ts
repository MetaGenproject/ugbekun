
import { FileText, Video, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ResourceType = "PDF" | "Video" | "Link" | "Document";

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  subject: string;
  dateAdded: string;
  uploader: string;
  url: string;
  fileSize?: string;
};

export const initialResources: Resource[] = [
  { 
    id: "res-001",
    title: "Algebra Chapter 5 Slides", 
    description: "In-depth slides covering quadratic equations and functions from our last class.",
    type: "PDF", 
    subject: "Mathematics", 
    dateAdded: "2024-10-10T10:00:00Z",
    uploader: "Mr. Adebayo",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    fileSize: "2.3 MB"
  },
  { 
    id: "res-002",
    title: "Video: Intro to Recursion", 
    description: "A recommended video from Khan Academy explaining the fundamentals of recursion.",
    type: "Video", 
    subject: "Data Processing", 
    dateAdded: "2024-10-08T14:30:00Z",
    uploader: "Mrs. Bisi",
    url: "https://www.youtube.com/embed/Mv9NEXX1VHc",
  },
  { 
    id: "res-003",
    title: "Thermodynamics Simulation", 
    description: "An interactive simulation to explore the laws of thermodynamics.",
    type: "Link", 
    subject: "Physics", 
    dateAdded: "2024-10-07T09:00:00Z",
    uploader: "Mrs. Chioma",
    url: "https://phet.colorado.edu/en/simulations/energy-forms-and-changes",
  },
  { 
    id: "res-004",
    title: "Essay Writing Guide", 
    description: "A comprehensive guide on structuring arguments and improving your prose.",
    type: "Document", 
    subject: "English Language", 
    dateAdded: "2024-10-05T11:00:00Z",
    uploader: "Mr. Okoro",
    url: "https://docs.google.com/document/d/1-w94Jq2xQ_s_1Tz8g_s_1Tz8g_s_1Tz8g_s_1Tz8g/preview",
  },
];
