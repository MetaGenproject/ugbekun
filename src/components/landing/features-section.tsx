
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type LandingPageFeature, initialLandingPageFeatures } from "@/lib/content-data";
import { iconMap } from "@/lib/notifications-data";
import React from 'react';

export function FeaturesSection() {
  const [features] = useLocalStorage<LandingPageFeature[]>("landing-page-features", initialLandingPageFeatures);

  return (
    <section id="features" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground animate-in-fade" style={{animationDelay: '0.2s', animationFillMode: 'both'}}>
            Everything a modern school needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground animate-in-fade" style={{animationDelay: '0.3s', animationFillMode: 'both'}}>
            From enrollment to graduation—manage your entire academic lifecycle with clarity.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/50 hover:ring-border transition animate-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s`, animationFillMode: 'both' }}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <h3 className="display mt-4 text-xl tracking-tight font-semibold text-card-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
