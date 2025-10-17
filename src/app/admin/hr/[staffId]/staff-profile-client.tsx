
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Staff, staff as initialStaffData } from "@/lib/hr-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Edit, ArrowLeft, Briefcase, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddStaffDialog } from "@/components/admin-dashboard/add-staff-dialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { Input } from "@/components/ui/input";
import { ResponsiveCalendar } from "@/components/ui/responsive-calendar";
import { cn } from '@/lib/utils';
import type { Transaction } from "@/lib/finance-data";
import QRCode from 'qrcode';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

interface StaffProfileClientProps {
    staff: Staff;
    transactions: Transaction[];
}

export default function StaffProfileClient({ staff: initialStaff, transactions }: StaffProfileClientProps) {
  const [staffList, setStaffList] = useLocalStorage<Staff[]>('school-staff', initialStaffData);
  const router = useRouter();
  const { toast } = useToast();

  const [staff, setStaff] = useState<Staff>(initialStaff);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [status, setStatus] = useState<Staff['status'] | undefined>(initialStaff.status);
  const [leaveStart, setLeaveStart] = useState<Date | undefined>();
  const [leaveEnd, setLeaveEnd] = useState<Date | undefined>();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false);


  useEffect(() => {
    // Update local state if the initial prop changes (e.g., after an update)
    setStaff(initialStaff);
    setStatus(initialStaff.status);
  }, [initialStaff]);
  
   useEffect(() => {
    const generateQrCode = async () => {
      try {
        const qrData = `ugbekun-staff-${staff.id}`;
        const dataUrl = await QRCode.toDataURL(qrData, {
             errorCorrectionLevel: 'H',
             type: 'image/png',
             quality: 0.9,
             margin: 1,
             color: {
                 dark:"#122B5E",
                 light:"#FFFFFF"
            }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      }
    };

    if (staff) {
      generateQrCode();
    }
  }, [staff]);


  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    setStaff(updatedStaff);
  };
  
  const handleEditClick = () => {
    setIsAddStaffOpen(true);
  }

  const handleUpdateStatus = () => {
    if (!staff || !status) return;
    const updatedStaff = { ...staff, status };
    handleUpdateStaff(updatedStaff);
    toast({
      variant: 'success',
      title: "Status Updated",
      description: `${staff.name}'s status has been changed to '${status}'.`
    });
  }
  
  const payrollHistory = transactions.filter(t => t.studentName === staff?.name && t.type === 'Salary');

  return (
    <>
    <div className="space-y-6">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4"/>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Staff Profile</h1>
        </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={staff.avatar} />
                <AvatarFallback className="text-3xl">{staff.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{staff.name}</CardTitle>
                    <Badge variant={staff.status === 'Active' ? 'default' : 'outline'} className={staff.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" : ""}>
                        {staff.status}
                    </Badge>
                </div>
                <CardDescription className="text-base flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4" /> {staff.role} • {staff.department}
                </CardDescription>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {staff.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {staff.phone}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {staff.address}</div>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsQrCodeDialogOpen(true)}>
                    <QrCode className="mr-2 h-4 w-4" /> View ID
                </Button>
                <Button onClick={handleEditClick}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
            </div>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="overview">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="attendance">Attendance &amp; Leave</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Class Performance</CardTitle>
                        <CardDescription>Average performance of students in {staff.name}'s classes.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                         <PerformanceChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Classes</CardTitle>
                        <CardDescription>All classes and subjects assigned to this teacher.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Students</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {staff.assignedClasses.map(c => (
                                    <TableRow key={c.class}>
                                        <TableCell>{c.class}</TableCell>
                                        <TableCell>{c.subject}</TableCell>
                                        <TableCell>{c.students}</TableCell>
                                    </TableRow>
                                ))}
                                {staff.assignedClasses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                                            No classes assigned yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
         <TabsContent value="payroll" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Payroll History</CardTitle>
                    <CardDescription>Current salary is ₦{staff.salary.toLocaleString()} per month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                         <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payrollHistory.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{format(new Date(p.date), 'MMMM yyyy')}</TableCell>
                                    <TableCell>₦{p.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">{p.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="attendance" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Leave &amp; Attendance Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Log Leave</CardTitle>
                                <CardDescription>Update staff member's leave status.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Status</Label>
                                     <Select value={status} onValueChange={(value: Staff['status']) => setStatus(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <ResponsiveCalendar
                                        selected={leaveStart}
                                        onSelect={setLeaveStart}
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal", !leaveStart && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {leaveStart ? format(leaveStart, 'PPP') : <span>Pick a date</span>}
                                    </ResponsiveCalendar>
                                </div>
                                 <div className="space-y-2">
                                    <Label>End Date</Label>
                                     <ResponsiveCalendar
                                        selected={leaveEnd}
                                        onSelect={setLeaveEnd}
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal", !leaveEnd && "text-muted-foreground")}
                                     >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>{leaveEnd ? format(leaveEnd, 'PPP') : <span>Pick a date</span>}
                                    </ResponsiveCalendar>
                                 </div>
                                 <div className="space-y-2">
                                     <Label>Notes</Label>
                                     <Input placeholder="e.g., Annual Leave"/>
                                 </div>
                                <Button onClick={handleUpdateStatus} className="w-full">Update Status</Button>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle className="text-base">Attendance Log</CardTitle>
                                <CardDescription>Daily attendance records.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground py-12">
                                <p>Staff attendance tracking coming soon.</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
    <AddStaffDialog 
        isOpen={isAddStaffOpen}
        onClose={() => { setIsAddStaffOpen(false); }}
        onAddStaff={() => {}}
        onUpdateStaff={handleUpdateStaff}
        staffToEdit={staff}
      />
      <AlertDialog open={isQrCodeDialogOpen} onOpenChange={setIsQrCodeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Staff ID Card</AlertDialogTitle>
            <AlertDialogDescription>
              This QR code is for clock-in and identification purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-muted rounded-md flex flex-col items-center">
            {qrCodeDataUrl && (
              <Image src={qrCodeDataUrl} alt="Staff QR Code" width={200} height={200} />
            )}
            <p className="font-semibold mt-4">{staff.name}</p>
            <p className="text-sm text-muted-foreground">{staff.role}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">{staff.id}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsQrCodeDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}