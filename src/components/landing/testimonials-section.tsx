
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Testimonial } from "@/lib/content-data";
import { initialTestimonials } from "@/lib/content-data";

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const image = PlaceHolderImages.find(p => p.id === testimonial.avatarId);

    return (
        <figure className="rounded-2xl bg-card p-6 ring-1 ring-border shadow-sm w-[90vw] sm:w-[380px] shrink-0">
          <div className="flex items-center gap-1 text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="mt-3 text-card-foreground">
            "{testimonial.quote}"
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
             {image && <Image
                src={image.imageUrl}
                alt={testimonial.name}
                width={36}
                height={36}
                data-ai-hint={image.imageHint}
                className="rounded-full ring-2 ring-accent"
              />}
            <div>
              <p className="text-sm font-medium text-card-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </figcaption>
        </figure>
    )
}


export function TestimonialsSection() {
  const [testimonials] = useLocalStorage<Testimonial[]>("landing-page-testimonials", initialTestimonials);
  
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="relative py-16 md:py-24 border-t border-border overflow-hidden">
        <div
            className="absolute top-0 left-0 h-full w-4 sm:w-24 bg-gradient-to-r from-background to-transparent z-10"
            aria-hidden="true"
        />
        <div
            className="absolute top-0 right-0 h-full w-4 sm:w-24 bg-gradient-to-l from-background to-transparent z-10"
            aria-hidden="true"
        />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">Loved by schools</h2>
          <p className="mt-3 text-muted-foreground">What principals and teachers say about Ugbekun.</p>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col gap-6">
        <div className="flex gap-6 animate-[marquee-l_60s_linear_infinite] -translate-x-1/4 sm:translate-x-0">
            {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
        </div>
        <div className="flex gap-6 animate-[marquee-r_60s_linear_infinite] -translate-x-1/3 sm:translate-x-0">
            {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`${testimonial.id}-${index}-2`} testimonial={testimonial} />
            ))}
        </div>
      </div>

    </section>
  );
}
