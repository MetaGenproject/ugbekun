
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";
import { ChevronDown } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { FAQItem } from "@/lib/content-data";
import { initialFaqs } from "@/lib/content-data";

export function FaqSection() {
  const [faqs] = useLocalStorage<FAQItem[]>("landing-page-faqs", initialFaqs);

  return (
    <section id="faq" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">Frequently asked questions</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know about the product and billing.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl bg-card p-5 ring-1 ring-border open:ring-primary/20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-sm font-medium text-card-foreground">{faq.question}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary ring-1 ring-border transition group-open:rotate-180">
                  <ChevronDown className="h-4 w-4 text-secondary-foreground" />
                </span>
              </summary>
              <p className="mt-4 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
