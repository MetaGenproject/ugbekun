
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { initialRoutes, type Route } from "@/lib/transport-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Map } from "lucide-react";

export default function ParentTransportPage() {
    const [routes] = useLocalStorage<Route[]>("transport-routes", initialRoutes);
    // In a real app, we'd find the specific route for the child.
    const myRoute = routes[0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transport Details</CardTitle>
                <CardDescription>Live tracking and information for your child's school bus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="h-96 w-full rounded-lg bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <Map className="h-12 w-12 mx-auto" />
                        <p className="mt-2">Live map view would be here.</p>
                    </div>
                </div>
                 <Card>
                    <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Route Name</p>
                            <p className="font-semibold">{myRoute.routeName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Driver</p>
                            <p className="font-semibold">{myRoute.driverName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Bus Number</p>
                            <p className="font-semibold">{myRoute.busNumber}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold">{myRoute.status}</p>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}
