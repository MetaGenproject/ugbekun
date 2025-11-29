/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
import { Award, Book, Feather, Shield, Sparkles, Building, Mountain, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const schools = [
    {
      name: "Alpha Academy",
      logo: <Award className="h-5 w-5" />,
      tagline: "Excellence & Integrity",
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Cedar High",
      logo: <Mountain className="h-5 w-5" />,
      tagline: "Reaching New Heights",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Unity College",
      logo: <Users className="h-5 w-5" />,
      tagline: "Strength in Community",
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Maple Grove",
      logo: <Feather className="h-5 w-5" />,
      tagline: "Nurturing Talent",
      color: "bg-orange-100 text-orange-800",
    },
    {
      name: "Bright Futures",
      logo: <Sparkles className="h-5 w-5" />,
      tagline: "Innovating Education",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Oakwood School",
      logo: <Book className="h-5 w-5" />,
      tagline: "Knowledge & Virtue",
      color: "bg-stone-100 text-stone-800",
    },
    {
      name: "Silverline",
      logo: <Shield className="h-5 w-5" />,
      tagline: "A Legacy of Leaders",
      color: "bg-gray-100 text-gray-800",
    },
];


export function Brands() {
  return (
    <section aria-label="Schools using Ugbekun" className="relative py-12 border-y border-border bg-background/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trusted by Nigeria's leading schools</h3>
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee-l_60s_linear_infinite]">
            {[...schools, ...schools].map((school, index) => (
              <div key={index} className="flex items-center gap-4 rounded-xl bg-card p-4 pr-6 border border-border shadow-sm min-w-max">
                <div className={cn("h-10 w-10 rounded-full grid place-items-center shrink-0", school.color)}>
                    {school.logo}
                </div>
                <div>
                    <div className="font-semibold text-card-foreground tracking-tight">{school.name}</div>
                    <div className="text-xs text-muted-foreground">{school.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
