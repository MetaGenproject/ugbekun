
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, UserCog, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AddTeamMemberDialog } from "@/components/super-admin-dashboard/add-team-member-dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { type TeamMember, initialTeamMembers } from "@/lib/team-data";

export default function TeamPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [team, setTeam] = useLocalStorage<TeamMember[]>('internal-team', initialTeamMembers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddMember = (newMember: Omit<TeamMember, 'id'>) => {
        setTeam(prev => [...prev, { ...newMember, id: `sa-${Date.now()}` }]);
    };

    const handleUpdateMember = (updatedMember: TeamMember) => {
        setTeam(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    };
    
    const confirmDeleteMember = (e: React.MouseEvent, member: TeamMember) => {
        e.stopPropagation();
        setMemberToDelete(member);
    };

    const handleDeleteMember = () => {
        if (!memberToDelete) return;
        setTeam(prev => prev.filter(m => m.id !== memberToDelete.id));
        toast({
            variant: "destructive",
            title: "Team Member Removed",
            description: `${memberToDelete.name} has been removed from the team.`
        });
        setMemberToDelete(null);
    };
    
    const openAddDialog = () => {
        setEditingMember(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (e: React.MouseEvent, member: TeamMember) => {
        e.stopPropagation();
        setEditingMember(member);
        setIsDialogOpen(true);
    };
    
    const departments = team.reduce((acc, s) => {
        acc[s.department] = (acc[s.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const filteredTeam = team.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Team Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg border bg-card flex items-center gap-3">
                        <Users className="h-6 w-6 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Members</p>
                            <p className="text-2xl font-bold">{team.length}</p>
                        </div>
                    </div>
                     {Object.entries(departments).map(([dept, count]) => (
                        <div key={dept} className="p-4 rounded-lg border bg-card">
                            <p className="text-sm text-muted-foreground">{dept}</p>
                            <p className="text-2xl font-bold">{count}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Internal Team</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => toast({ title: "Feature not implemented" })}>
                            <UserCog className="mr-2 h-4 w-4" /> Manage Roles
                        </Button>
                        <Button onClick={openAddDialog}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input 
                            placeholder="Search by name, email, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team Member</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTeam.map(member => (
                                <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/super-admin/team/${member.id}`)}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{member.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.department}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.status === "Active" ? "secondary" : "outline"} className={member.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : ''}>
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => openEditDialog(e, member)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => confirmDeleteMember(e, member)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <AddTeamMemberDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            memberToEdit={editingMember}
        />
        <ConfirmationDialog
            isOpen={!!memberToDelete}
            onClose={() => setMemberToDelete(null)}
            onConfirm={handleDeleteMember}
            title={`Delete ${memberToDelete?.name}?`}
            description="This action cannot be undone and will permanently remove this team member's access."
        />
        </>
    );
}

    