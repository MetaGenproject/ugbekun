
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Users, Building, Wallet, CalendarOff, Edit, Trash2, FileDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { staff as initialStaff, type Staff } from "@/lib/hr-data";
import { AddStaffDialog } from "@/components/admin-dashboard/add-staff-dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function HRPage() {
  const [staff, setStaff] = useLocalStorage<Staff[]>('school-staff', initialStaff);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading
    setIsLoading(false);
  }, []);


  const handleAddStaff = (newStaff: Staff) => {
    setStaff(prev => [newStaff, ...prev]);
  };
  
  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };
  
  const confirmDeleteStaff = (staffMember: Staff) => {
    setStaffToDelete(staffMember);
  };

  const handleDeleteStaff = () => {
    if (!staffToDelete) return;
    setStaff(prev => prev.filter(s => s.id !== staffToDelete.id));
    toast({
        variant: "destructive",
        title: "Staff Member Removed",
        description: "The staff member has been removed from the list."
    })
    setStaffToDelete(null);
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = staff.reduce((acc, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { title: "Total Staff", value: staff.length, icon: Users },
    { title: "Departments", value: Object.keys(departments).length, icon: Building },
    { title: "On Payroll", value: staff.filter(s => s.status === 'Active').length, icon: Wallet },
    { title: "On Leave", value: staff.filter(s => s.status === 'On Leave').length, icon: CalendarOff },
  ]

  return (
    <>
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map(stat => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Staff Members</CardTitle>
              </div>
               <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast({description: "Import from CSV feature coming soon!"})}>
                    <FileDown className="mr-2 h-4 w-4" /> Import
                </Button>
                <Button onClick={() => setIsAddStaffOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search by name, role, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[calc(100vh-28rem)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((s) => (
                      <TableRow 
                        key={s.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/admin/hr/${s.id}`)}
                      >
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>
                                        {s.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{s.name}</p>
                                  <p className="text-xs text-muted-foreground">{s.email}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>{s.department}</TableCell>
                        <TableCell>
                          <Badge variant={s.status === "Active" ? "default" : "outline"} className={s.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" : ""}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingStaff(s); setIsAddStaffOpen(true); }}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); confirmDeleteStaff(s); }} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle>Staff by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {Object.entries(departments).map(([dept, count]) => (
                        <div key={dept} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">{dept}</span>
                            <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
      <AddStaffDialog 
        isOpen={isAddStaffOpen}
        onClose={() => { setIsAddStaffOpen(false); setEditingStaff(null); }}
        onAddStaff={handleAddStaff}
        onUpdateStaff={handleUpdateStaff}
        staffToEdit={editingStaff}
      />
       <ConfirmationDialog
        isOpen={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleDeleteStaff}
        title={`Delete ${staffToDelete?.name}?`}
        description="This action cannot be undone. This will permanently remove the staff member's record from the system."
        confirmText="Delete"
      />
    </>
  );
}

    