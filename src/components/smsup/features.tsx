
import { Fingerprint, GraduationCap, Users } from "lucide-react";
import { AnimatedFeature } from "./animated-feature";
import { CertificateVerificationAnimation } from "./certificate-verification-animation";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: <Fingerprint />,
        title: "Auto ID Cards & Profiles",
        description: "Generate verifiable digital ID cards that serve as a public, parent-controlled profile for each student, showcasing achievements and credentials.",
        animationComponent: <AnimatedFeature />,
    },
    {
        icon: <GraduationCap />,
        title: "On-Chain Certificate Verification",
        description: "Empower organizations to instantly verify academic credentials with just a student's DID, eliminating fraud and administrative overhead.",
        animationComponent: <CertificateVerificationAnimation />,

    },
];

export function Features() {
    return (
         <div className="relative py-16 md:py-20 space-y-16">
            {features.map((feature, i) => (
                <div key={feature.title} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className={cn(i % 2 !== 0 && "lg:col-start-2")}>
                            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-3 py-1.5 rounded-full ring-1 ring-inset ring-primary/20">
                                {feature.icon}
                                <h3 className="font-semibold">{feature.title}</h3>
                            </div>
                            <p className="mt-4 text-lg text-muted-foreground">{feature.description}</p>
                        </div>
                        <div className={cn("mt-10 lg:mt-0 w-full max-w-lg mx-auto relative h-96", i % 2 !== 0 && "lg:col-start-1 lg:row-start-1")}>
                                {feature.animationComponent}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
