
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */

// This layout is a simple pass-through to avoid nested layouts for public pages.
export default function PublicPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-muted dark:bg-card">{children}</div>;
}
