/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import Link from "next/link";
import { FolderOpen, Mic, Brain, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const links = [
    { href: "/student/resources", icon: <FolderOpen className="h-5 w-5"/>, label: "Files" },
    { href: "#", icon: <Mic className="h-5 w-5"/>, label: "Replays" },
    { href: "#", icon: <Brain className="h-5 w-5"/>, label: "Practice" },
    { href: "#", icon: <FileText className="h-5 w-5"/>, label: "Syllabus" },
];

export function QuickLinks() {
    return (
        <Card className="shadow-lg">
            <CardHeader className="p-6">
                <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-2 gap-3">
                    {links.map(link => (
                        <Link key={link.label} href={link.href} className="rounded-xl p-4 bg-background border border-border hover:bg-muted transition-colors flex items-center gap-3">
                           {link.icon}
                            <span className="text-sm font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
