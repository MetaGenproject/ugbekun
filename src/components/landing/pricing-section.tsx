/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import type { Plan } from "@/context/plan-context";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { School } from "@/lib/super-admin-data";
import { schoolsData } from "@/lib/super-admin-data";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter" as const,
    price: "Free",
    priceDetail: "14-day trial",
    description: "For small schools getting started",
    features: [
      "200 active students",
      "Attendance & profiles",
      "Email support",
    ],
    cta: "Get started",
    variant: "default" as const,
  },
  {
    name: "Growth" as const,
    price: "₦75,000",
    priceDetail: "/term",
    description: "Best for growing campuses",
    features: [
      "2,000 active students",
      "Finance & invoicing",
      "Messaging & notifications",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Choose Growth",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise" as const,
    price: "Custom",
    priceDetail: "",
    description: "For multi-campus networks",
    features: [
      "Unlimited students",
      "SSO & SAML",
      "Dedicated success manager",
      "Custom integrations & SLAs",
    ],
    cta: "Contact sales",
    variant: "default" as const,
  },
];

export function PricingSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [schools] = useLocalStorage<School[]>("schools", schoolsData);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn && schools.length > 0) {
      setCurrentPlan(schools[0].plan);
    }
  }, [schools]);
  
  const getButtonState = (planName: Plan) => {
    if (!isLoggedIn || !currentPlan) {
        return { text: plans.find(p => p.name === planName)?.cta || "Get Started", disabled: false, href: planName === 'Enterprise' ? "#get-started" : "/onboarding" };
    }
    
    if (planName === currentPlan) {
      return { text: "Current Plan", disabled: true, href: "#" };
    }

    const planOrder: Plan[] = ["Starter", "Growth", "Enterprise"];
    const currentPlanIndex = planOrder.indexOf(currentPlan);
    const targetPlanIndex = planOrder.indexOf(planName);

    if (targetPlanIndex > currentPlanIndex) {
       return { text: "Upgrade", disabled: false, href: `/admin/settings?tab=billing` };
    }
    
    return { text: "Contact Sales", disabled: false, href: "#get-started" };
  }


  return (
    <section id="pricing" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display text-3xl sm:text-4xl tracking-tight font-semibold text-foreground">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const { text, disabled, href } = getButtonState(plan.name);
            return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-6 shadow-sm transition hover:shadow-lg ${
                plan.popular ? 'bg-primary text-primary-foreground ring-2 ring-primary/80 shadow-2xl' : 'bg-card ring-1 ring-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                  Most popular
                </div>
              )}
              <div className="flex-1">
                <h3 className="display text-xl font-semibold">{plan.name}</h3>
                <p className={`mt-2 text-sm ${plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="display text-4xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.priceDetail && <span className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{plan.priceDetail}</span>}
                </div>
                <ul className={`mt-6 space-y-3 text-sm ${plan.popular ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check className={`h-5 w-5 ${plan.popular ? 'text-accent' : 'text-primary'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button asChild className={`mt-8 w-full rounded-xl`}
                variant={plan.popular ? "secondary" : "default"}
                disabled={disabled}
                >
                <Link href={href}>
                    {text}
                </Link>
              </Button>
            </div>
          )})}
        </div>
        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Need more features or have a larger school network? <Link href="#get-started" className="font-medium underline hover:text-foreground">Contact us for a custom plan.</Link></p>
        </div>
      </div>
    </section>
  );
}
