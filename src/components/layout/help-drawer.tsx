
"use client";

import * as React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useHelp } from "@/hooks/use-help";
import { iconMap } from "@/lib/notifications-data";

type HelpDrawerProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function HelpDrawer({ isOpen, onOpenChange }: HelpDrawerProps) {
    const { pageInfo } = useHelp();
    const Icon = pageInfo.icon ? iconMap[pageInfo.icon] : null;

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[40vh]">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0 border-2 border-primary/10">
                                <Icon className="h-7 w-7" />
                            </div>
                        )}
                        <div className="flex-1">
                            <DrawerTitle className="text-2xl">{pageInfo.title}</DrawerTitle>
                            <DrawerDescription className="text-base mt-1">{pageInfo.description}</DrawerDescription>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

    