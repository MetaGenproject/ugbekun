
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import Image from "next/image";
import { messages } from "@/lib/student-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export function MessageList() {
    return (
         <Card className="shadow-lg flex flex-col h-full">
            <CardHeader className="p-6 flex items-center justify-between">
                <CardTitle className="text-lg">Messages</CardTitle>
                <Button variant="outline" size="sm">New</Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ScrollArea className="h-full">
                    <div className="px-6 space-y-4">
                        {messages.map(message => {
                            const image = PlaceHolderImages.find(p => p.id === message.avatarId);
                            return (
                                <div key={message.id} className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        {image && <AvatarImage src={image.imageUrl} alt={message.sender} data-ai-hint={image.imageHint} />}
                                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium tracking-tight">{message.sender}</div>
                                            <div className="text-xs text-muted-foreground">{message.time}</div>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{message.preview}</p>
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
