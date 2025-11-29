/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { Course } from "@/lib/student-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function CourseCard({ course }: { course: Course }) {
  const image = PlaceHolderImages.find(p => p.id === course.imageId);
  
  return (
    <Card className="hover:border-primary/40 transition-colors bg-background">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 relative">
             {image && (
                <Image 
                    src={image.imageUrl} 
                    alt={course.title} 
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium tracking-tight truncate">{course.title}</div>
            <div className="text-xs text-muted-foreground">{course.code} • {course.credits} credits</div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-lg">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="mt-2 h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
