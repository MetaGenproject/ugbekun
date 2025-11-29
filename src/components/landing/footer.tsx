/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';
import Link from "next/link";
import { Twitter, Linkedin, Github, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

const footerLinks = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Solutions", href: "#solutions" },
            { label: "Pricing", href: "#pricing" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "Customers", href: "#testimonials" },
            { label: "FAQ", href: "#faq" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Security", href: "/security" },
        ]
    },
    {
        title: "Developers",
        links: [
            { label: "Documentation", href: "/documentation" },
            { label: "API Reference", href: "/documentation/api" },
            { label: "Status", href: "/status" },
        ]
    }
];

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex flex-row md:flex-col items-center justify-between md:items-start">
                <Link href="#" className="group inline-flex items-center gap-2">
                  <Logo className="h-8 text-foreground" />
                </Link>
                <div className="flex items-center gap-3 md:mt-4">
                    <Link href="#" aria-label="Twitter" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary ring-1 ring-border hover:bg-accent">
                    <Twitter className="h-4 w-4" />
                    </Link>
                    <Link href="#" aria-label="LinkedIn" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary ring-1 ring-border hover:bg-accent">
                    <Linkedin className="h-4 w-4" />
                    </Link>
                    <Link href="#" aria-label="Github" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary ring-1 ring-border hover:bg-accent">
                    <Github className="h-4 w-4" />
                    </Link>
                </div>
            </div>
          </div>
          <div className="md:col-span-3">
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {footerLinks.map((section) => (
                    <div key={section.title} className="hidden sm:block">
                        <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                             {section.links.map((link) => (
                                <li key={link.label}><Link className="hover:text-foreground" href={link.href}>{link.label}</Link></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
             <div className="sm:hidden border-t pt-4">
                 {footerLinks.map((section) => (
                    <div key={section.title} className="border-b last:border-b-0">
                         <details className="group">
                             <summary className="flex cursor-pointer list-none items-center justify-between py-3">
                                <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
                                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                             <ul className="pb-3 mt-2 space-y-2 text-sm text-muted-foreground">
                                {section.links.map((link) => (
                                    <li key={link.label}><Link className="hover:text-foreground" href={link.href}>{link.label}</Link></li>
                                ))}
                            </ul>
                        </details>
                    </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {year} Ugbekun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
