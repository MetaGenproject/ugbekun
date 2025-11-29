/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import Image from 'next/image';
import { Sparkles, PlayCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function WelcomeHeader() {
    const image = PlaceHolderImages.find(p => p.id === 'student-welcome');

    return (
        <Card className="shadow-lg overflow-hidden bg-primary text-primary-foreground relative">
            <CardContent className="p-6 md:p-8">
                <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary-foreground/10 grid place-items-center text-primary-foreground shrink-0">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl md:text-3xl font-semibold tracking-tight">Good morning, Alex!</h2>
                    </div>
                    <p className="opacity-80 mt-2 text-sm md:text-base max-w-lg">
                        You’re on a 7-day learning streak. Keep it glowing—small steps, big wins.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs">
                        <Button variant="secondary" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground">
                            <PlayCircle className="h-5 w-5" />
                            <span>Start Focus</span>
                        </Button>
                        <Button variant="ghost" className="hover:bg-primary-foreground/20 text-primary-foreground">
                            <Video className="h-5 w-5" />
                            <span>Join Live</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
             {image && (
                <div className="absolute right-0 bottom-0 h-48 w-48 xl:h-56 xl:w-56 pointer-events-none opacity-80 xl:opacity-100">
                    <Image
                    src={image.imageUrl}
                    alt={image.description}
                    data-ai-hint={image.imageHint}
                    fill
                    className="object-contain"
                    />
                </div>
            )}
        </Card>
    )
}
