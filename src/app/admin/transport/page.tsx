
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
import { PlusCircle, MoreHorizontal, Map, Edit, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AddRouteDialog } from "@/components/admin-dashboard/add-route-dialog";
import type { Route } from "@/lib/transport-data";
import { initialRoutes, statusStyles } from "@/lib/transport-data";

export default function TransportPage() {
  const [routes, setRoutes] = useLocalStorage<Route[]>(
    "transport-routes",
    initialRoutes
  );
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const { toast } = useToast();

  const handleAddRoute = (newRoute: Omit<Route, 'id'>) => {
    setRoutes(prev => [...prev, { ...newRoute, id: `rt-${Date.now()}` }]);
    toast({ variant: "success", title: "Route Added", description: `${newRoute.routeName} has been added.` });
  };
  
  const handleUpdateRoute = (updatedRoute: Route) => {
    setRoutes(prev => prev.map(r => r.id === updatedRoute.id ? updatedRoute : r));
    toast({ variant: "success", title: "Route Updated", description: `${updatedRoute.routeName} has been updated.` });
  };

  const handleDeleteRoute = (routeId: string) => {
    setRoutes(prev => prev.filter(r => r.id !== routeId));
    toast({ variant: 'destructive', title: "Route Deleted" });
  };

  const openEditDialog = (route: Route) => {
    setEditingRoute(route);
    setIsAddRouteOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingRoute(null);
    setIsAddRouteOpen(true);
  };


  return (
    <>
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transport Management</CardTitle>
          </div>
           <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast({description: "Live map view is not available in this demo."})}><Map className="mr-2 h-4 w-4"/> View Live Map</Button>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{route.routeName}</TableCell>
                    <TableCell>{route.driverName}</TableCell>
                    <TableCell>{route.busNumber}</TableCell>
                    <TableCell>{route.students}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusStyles[route.status]}>
                        {route.status}
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
                            <DropdownMenuItem onClick={() => openEditDialog(route)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteRoute(route.id)} className="text-destructive focus:text-destructive">
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
     <AddRouteDialog
        isOpen={isAddRouteOpen}
        onClose={() => setIsAddRouteOpen(false)}
        onAddRoute={handleAddRoute}
        onUpdateRoute={handleUpdateRoute}
        routeToEdit={editingRoute}
      />
    </>
  );
}

    