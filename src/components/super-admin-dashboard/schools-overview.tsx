
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Building, Gem, ShieldCheck, Shield, PlusCircle, Globe2, Edit, Trash2, ExternalLink } from "lucide-react";
import { schoolsData as initialSchoolsData, type School } from "@/lib/super-admin-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AddSchoolDialog } from "./add-school-dialog";
import type { Notification } from "@/lib/notifications-data";
import { superAdminNotifications } from "@/lib/notifications-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { ConfirmationDialog } from "../ui/confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import type { Staff } from "@/lib/hr-data";
import { staff as initialStaff } from "@/lib/hr-data";

const planIcons: Record<School['plan'], { icon: React.ElementType, color: string, label: string }> = {
  "Enterprise": { icon: Gem, color: "text-amber-500", label: "Enterprise Plan" },
  "Growth": { icon: ShieldCheck, color: "text-blue-500", label: "Growth Plan" },
  "Starter": { icon: Shield, color: "text-gray-400", label: "Starter Plan" },
};

export function SchoolsOverview() {
  const [schools, setSchools] = useLocalStorage<School[]>('schools', initialSchoolsData);
  const [staff, setStaff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const [, setSuperAdminNotifications] = useLocalStorage<Notification[]>('super-admin-notifications', superAdminNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleAddSchool = (
    newSchoolData: Omit<School, 'id' | 'logoUrl' | 'verified' | 'coverImageUrl'>,
    admin: { name: string, email: string }
  ) => {
    const schoolId = newSchoolData.name.toLowerCase().replace(/\s+/g, '-');
    const newSchool: School = {
      id: schoolId,
      logoUrl: `https://placehold.co/32x32/dbeafe/1e3a8a?text=${newSchoolData.name.charAt(0)}`,
      verified: newSchoolData.system === 'SMSUP+',
      ...newSchoolData,
    };
    setSchools(prev => [newSchool, ...prev]);

    // Also add the admin to the staff list
    const newAdmin: Staff = {
        id: `stf-${Date.now()}`,
        name: admin.name,
        email: admin.email,
        phone: 'N/A',
        address: newSchool.state,
        role: 'Administrator',
        department: 'Administration',
        status: 'Active',
        avatar: `https://i.pravatar.cc/40?u=${admin.email}`,
        salary: 200000,
        assignedClasses: [],
        performance: 90
    };
    setStaff(prev => [newAdmin, ...prev]);

    const newNotification: Notification = {
        id: Date.now(),
        title: "New School Onboarded",
        description: `${newSchool.name} has joined the ${newSchool.plan} plan.`,
        icon: 'Building',
        read: false,
    };
    setSuperAdminNotifications(prev => [newNotification, ...prev]);
  };
  
  const handleUpdateSchool = (updatedSchool: School) => {
      setSchools(prev => prev.map(s => s.id === updatedSchool.id ? updatedSchool : s));
  };
  
  const openAddDialog = () => {
      setEditingSchool(null);
      setIsDialogOpen(true);
  };
  
  const openEditDialog = (e: React.MouseEvent, school: School) => {
      e.stopPropagation();
      setEditingSchool(school);
      setIsDialogOpen(true);
  };
  
  const confirmDelete = (e: React.MouseEvent, school: School) => {
      e.stopPropagation();
      setSchoolToDelete(school);
  };

  const handleDelete = () => {
    if (!schoolToDelete) return;
    setSchools(prev => prev.filter(s => s.id !== schoolToDelete.id));
    toast({ variant: 'destructive', title: 'School Removed', description: `${schoolToDelete.name} has been deleted.` });
    setSchoolToDelete(null);
  };
  
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="shadow-lg h-full flex flex-col">
        <CardHeader className="p-6 flex flex-row items-center justify-between">
          <div>
              <CardTitle className="text-lg">Schools Overview</CardTitle>
              <CardDescription>All schools on the Ugbekun platform.</CardDescription>
          </div>
          <Button onClick={openAddDialog}><PlusCircle className="h-4 w-4 mr-2" />Add School</Button>
        </CardHeader>
        <CardContent className="p-6 pt-0 flex-1 flex flex-col min-h-0">
          <div className="mb-4">
            <Input 
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">School</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Revenue (Term)</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => {
                  const PlanIcon = planIcons[school.plan].icon;
                  const planColor = planIcons[school.plan].color;
                  const planLabel = planIcons[school.plan].label;

                  return (
                  <TableRow key={school.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/schools/${school.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={school.logoUrl || ''} />
                          <AvatarFallback>{school.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <PlanIcon className={cn("h-4 w-4 shrink-0", planColor)} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{planLabel}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="font-medium truncate">{school.name}</p>
                        {school.system === 'SMSUP+' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Globe2 className="h-4 w-4 text-primary shrink-0"/>
                              </TooltipTrigger>
                              <TooltipContent><p>SMSUP+ Enabled</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{school.lga}, {school.state}</TableCell>
                    <TableCell>
                        <Badge variant={school.status === 'Active' ? 'secondary' : 'destructive'} 
                          className={cn(
                            school.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' : ''
                          )}
                        >
                          {school.plan === 'Starter' && school.status === 'Active' ? 'Trial' : school.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{school.students}</TableCell>
                    <TableCell className="text-right font-medium">₦{school.revenue.toLocaleString()}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/schools/${school.id}`)}>
                                  <ExternalLink className="mr-2 h-4 w-4"/> View Public Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => openEditDialog(e, school)}>
                                  <Edit className="mr-2 h-4 w-4"/> Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => confirmDelete(e, school)} className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4"/> Delete School
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <AddSchoolDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSchool={handleAddSchool}
        onUpdateSchool={handleUpdateSchool}
        schoolToEdit={editingSchool}
      />
      <ConfirmationDialog
        isOpen={!!schoolToDelete}
        onClose={() => setSchoolToDelete(null)}
        onConfirm={handleDelete}
        title={`Delete ${schoolToDelete?.name}?`}
        description="This will permanently delete the school and all its data. This action cannot be undone."
      />
    </>
  );
}
