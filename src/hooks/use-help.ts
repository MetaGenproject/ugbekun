
"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { helpData, type HelpContent } from "@/lib/help-data";
import { LayoutDashboard } from "lucide-react";

const fallbackData: HelpContent = {
    title: "Dashboard",
    description: "Your main hub for all activities.",
    icon: "LayoutDashboard",
};

export function useHelp() {
    const pathname = usePathname();

    const pageInfo = useMemo(() => {
        // Find the most specific match first by sorting keys by length descending
        const matchingKey = Object.keys(helpData).sort((a, b) => b.length - a.length).find(key => pathname.startsWith(key));
        
        return matchingKey ? helpData[matchingKey] : fallbackData;
    }, [pathname]);

    return { pageInfo };
}

    