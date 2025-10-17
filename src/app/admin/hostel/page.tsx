
"use client";

import { useState } from "react";
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
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AddResidentDialog } from "@/components/admin-dashboard/add-resident-dialog";
import type { Resident } from "@/lib/hostel-data";
import { initialResidents } from "@/lib/hostel-data";

export default function HostelPage() {
  const [residents, setResidents] = useLocalStorage<Resident[]>(
    "hostel-residents",
    initialResidents
  );
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const { toast } = useToast();

  const handleAddResident = (newResident: Omit<Resident, 'id'>) => {
    setResidents(prev => [...prev, { ...newResident, id: `res-${Date.now()}` }]);
    toast({ variant: "success", title: "Resident Added", description: `${newResident.name} has been added to the hostel.` });
  };

  const handleUpdateResident = (updatedResident: Resident) => {
    setResidents(prev => prev.map(r => r.id === updatedResident.id ? updatedResident : r));
    toast({ variant: "success", title: "Resident Updated", description: `${updatedResident.name}'s details have been updated.` });
  };

  const handleDeleteResident = (residentId: string) => {
    setResidents(prev => prev.filter(r => r.id !== residentId));
    toast({ variant: 'destructive', title: "Resident Removed" });
  };

  const openEditDialog = (resident: Resident) => {
    setEditingResident(resident);
    setIsAddResidentOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingResident(null);
    setIsAddResidentOpen(true);
  };


  return (
    <>
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hostel Management</CardTitle>
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Resident
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident Name</TableHead>
                  <TableHead>Hostel</TableHead>
                  <TableHead>Room No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                             <Avatar className="h-7 w-7">
                                <AvatarFallback>
                                    {resident.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                             </Avatar>
                             {resident.name}
                        </div>
                    </TableCell>
                    <TableCell>{resident.hostel}</TableCell>
                    <TableCell>{resident.room}</TableCell>
                    <TableCell>
                      <Badge variant={resident.status === "Checked-in" ? "default" : "outline"}
                       className={resident.status === "Checked-in" ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" : ""}
                      >
                        {resident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(resident)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteResident(resident.id)} className="text-destructive focus:text-destructive">
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
    </div>
    <AddResidentDialog
        isOpen={isAddResidentOpen}
        onClose={() => setIsAddResidentOpen(false)}
        onAddResident={handleAddResident}
        onUpdateResident={handleUpdateResident}
        residentToEdit={editingResident}
      />
    </>
  );
}

    