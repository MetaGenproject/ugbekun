
import { Card } from "../ui/card";
import { School, User, ShieldCheck } from "lucide-react";

const roles = [
    {
        icon: <School />,
        title: "For School Administrators",
        points: [
            "Offer a premium, cutting-edge feature to parents.",
            "Set custom fees for on-chain services to create new revenue streams.",
            "Reduce administrative burden for credential verification requests.",
            "Enhance your school's reputation as a technology leader."
        ]
    },
    {
        icon: <User />,
        title: "For Parents & Students",
        points: [
            "Gain full control over your child's digital academic identity.",
            "Share verified credentials securely and instantly with any organization.",
            "Build a lifelong, tamper-proof portfolio of academic achievements.",
            "Eliminate the risk of lost or forged certificates."
        ]
    },
    {
        icon: <ShieldCheck />,
        title: "For Organizations & Verifiers",
        points: [
            "Verify academic records with 100% certainty and zero friction.",
            "Eliminate the need for manual verification calls or emails to schools.",
            "Build trust with a system backed by blockchain immutability.",
            "Access a single, standardized source of truth for credentials."
        ]
    }
]

export function ForRoles() {
    return (
        <section className="relative py-16 md:py-24 bg-secondary/50 border-y">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">
                        A System for the Entire Ecosystem
                    </h2>
                    <p className="mt-3 text-lg text-muted-foreground">
                       SMSUP+ creates a trusted bridge between schools, families, and the wider world.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {roles.map(role => (
                        <Card key={role.title} className="p-6 bg-card hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center shrink-0">
                                    {role.icon}
                                </div>
                                <h3 className="text-lg font-semibold">{role.title}</h3>
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                {role.points.map(point => (
                                    <li key={point} className="flex items-start gap-2">
                                        <div className="h-4 w-4 rounded-full bg-primary/20 shrink-0 mt-1"/>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
