/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useHelp } from "@/hooks/use-help";

export function PageHeader() {
  const { pageInfo } = useHelp();

  if (!pageInfo.title) return null;

  return (
    <div className="px-4 lg:px-6 xl:px-8 pt-6 pb-4 bg-background">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {pageInfo.title}
      </h1>
    </div>
  );
}
