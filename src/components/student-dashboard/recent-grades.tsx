
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialGrades, type RecentGrade } from "@/lib/student-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function RecentGrades() {
    const [grades] = useLocalStorage<RecentGrade[]>('student-grades', initialGrades);

    return (
        <Card className="shadow-lg flex flex-col h-full">
            <CardHeader className="p-6">
                <CardTitle className="text-lg">Recent Grades</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full">
                    <div className="px-6 space-y-4">
                        {grades.map(grade => {
                            const image = PlaceHolderImages.find(p => p.id === grade.avatarId);
                            return (
                                <div key={grade.id} className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10">
                                        {image && <AvatarImage src={image.imageUrl} alt={grade.course} data-ai-hint={image.imageHint} />}
                                        <AvatarFallback>{grade.course.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium tracking-tight">{grade.course}</div>
                                            <div className="text-sm font-semibold">{grade.grade}</div>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{grade.feedback}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
