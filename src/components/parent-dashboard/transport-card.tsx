
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type Route, initialRoutes } from '@/lib/transport-data';

export function TransportCard() {
  const { toast } = useToast();
  const [routes] = useLocalStorage<Route[]>('transport-routes', initialRoutes);
  const transportInfo = routes[0]; // Use the first route as mock data

  if (!transportInfo) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="p-6">
          <CardTitle className="text-lg">Transport</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 text-center text-muted-foreground">
          No transport details available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Today’s Transport</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">Live</Badge>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary grid place-items-center text-secondary-foreground">
            <Bus className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium tracking-tight">{transportInfo.routeName}</div>
            <div className="text-xs text-muted-foreground">ETA: 15 mins</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({description: "Live map coming soon."})}>View Map</Button>
        </div>
      </CardContent>
    </Card>
  );
}
