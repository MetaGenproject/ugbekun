
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { ReactElement } from 'react';

type Feature = {
    icon: ReactElement,
    title: string,
    description: string,
    image: string,
}

export function FeatureSpotlight({ feature, reverse }: { feature: Feature, reverse?: boolean }) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", reverse && "lg:grid-flow-col-dense")}>
                <div className={cn(reverse && "lg:col-start-2")}>
                    <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-3 py-1.5 rounded-full ring-1 ring-inset ring-primary/20">
                        {feature.icon}
                        <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                    <p className="mt-4 text-lg text-muted-foreground">{feature.description}</p>
                </div>
                <div className={cn("mt-10 lg:mt-0", reverse && "lg:col-start-1")}>
                     <Image 
                        src={feature.image} 
                        alt={feature.title}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-2xl shadow-xl ring-1 ring-border"
                    />
                </div>
            </div>
        </div>
    )
}
