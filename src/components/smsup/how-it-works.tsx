
import { Database, FileCheck, Anchor, School, Check } from "lucide-react";
import { Card } from "../ui/card";

const steps = [
    {
        icon: <School />,
        title: "School Migration",
        description: "The school administrator opts into SMSUP+ and undergoes a one-time migration process to establish the school's on-chain identity."
    },
    {
        icon: <FileCheck />,
        title: "Credential Generation",
        description: "As students achieve milestones (term reports, certificates), the system generates a verifiable digital version of the credential."
    },
    {
        icon: <Anchor />,
        title: "On-Chain Anchoring",
        description: "Parents can choose to pay a small fee to anchor a credential's unique hash on the blockchain, making it permanent and tamper-proof."
    },
    {
        icon: <Check />,
        title: "Instant Verification",
        description: "Any third party can then verify the credential's authenticity against the blockchain record, providing absolute trust."
    }
]

export function HowItWorks() {
    return (
        <section className="relative py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">
                        Simple Steps to Absolute Trust
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">
                       Our process is designed for security and simplicity, putting schools and parents in control.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 relative">
                    {/* Dashed Lines for connecting paths */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-0.5 h-1/2 border-l-2 border-dashed border-border hidden md:block"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1/2 h-0.5 border-t-2 border-dashed border-border hidden md:block"></div>

                    {steps.map((step, index) => (
                        <Card key={step.title} className="p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                             <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground grid place-items-center shrink-0 mx-auto">
                                {step.icon}
                            </div>
                            <h3 className="mt-4 font-semibold">{index + 1}. {step.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
