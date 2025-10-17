/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Card, CardContent } from '@/components/ui/card';
import { platformStats } from '@/lib/super-admin-data';

export function PlatformStats() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {platformStats.map((stat, index) => (
                <Card key={index} className="p-4 shadow-lg hover:-translate-y-1 transition-transform">
                    <CardContent className="p-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-secondary-foreground shadow-sm shrink-0">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">{stat.title}</div>
                                <div className="text-xl font-semibold tracking-tight">{stat.value}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
