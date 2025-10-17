/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function FocusCard() {
    return (
        <Card className="p-6 shadow-lg">
            <CardHeader className="p-0 flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-lg">Focus Session</CardTitle>
                    <CardDescription className="mt-1">Pomodoro • 25:00</CardDescription>
                </div>
                <Button size="icon" className="h-9 w-9">
                    <Play className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 mt-5">
                <Progress value={30} className="h-2" />
                <div className="mt-2 flex items-center justify-between text-xs opacity-85">
                    <span>7:30 elapsed</span>
                    <span>17:30 remaining</span>
                </div>
            </CardContent>
        </Card>
    );
}
