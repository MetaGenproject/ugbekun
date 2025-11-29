
"use client";

import { useState, useEffect, useMemo } from "react";
import * as DataStore from "@/lib/data-store";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AuditLog } from "@/lib/audit-log-data";
import { format } from "date-fns";
import { iconMap } from "@/lib/notifications-data";

function LogIcon({ name }: { name: keyof typeof iconMap }) {
    const LucideIcon = iconMap[name];
    if (!LucideIcon) return null;
    return <LucideIcon className="h-4 w-4" />;
};


export default function HistoryPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await DataStore.getAuditLogs();
            setLogs(data);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    const filteredLogs = useMemo(() => {
        return logs.filter(log =>
            log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logs, searchTerm]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>A complete history of all significant actions taken in your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input
                        placeholder="Search logs by user, action, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="h-[calc(100vh-24rem)]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Actor</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading logs...</TableCell></TableRow>
                            ) : filteredLogs.map(log => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={log.actorAvatar} />
                                                <AvatarFallback>{log.actorName.split(" ").map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{log.actorName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                           <LogIcon name={log.icon} />
                                           <span>{log.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && filteredLogs.length === 0 && (
                                <TableRow><TableCell colSpan={4} className="h-24 text-center">No log entries found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
