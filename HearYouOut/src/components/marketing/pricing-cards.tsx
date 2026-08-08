"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Sparkles } from "lucide-react";

import { Stagger, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/data/plans";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { BillingCycle } from "@/types";

export function BillingToggle({
  cycle,
  onChange,
  className,
}: {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted/70 relative inline-flex items-center rounded-full p-1",
        className,
      )}
      role="radiogroup"
      aria-label="Billing cycle"
    >
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={cycle === option}
          onClick={() => onChange(option)}
          className={cn(
            "focus-visible:ring-ring/50 relative z-10 inline-flex h-9 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]",
            cycle === option ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {cycle === option && (
            <motion.span
              layoutId="billing-pill"
              transition={{ duration: 0.32, ease: easeOutExpo }}
              className="bg-card absolute inset-0 -z-10 rounded-full shadow-[0_1px_2px_rgba(16,16,32,0.06),0_4px_12px_-6px_rgba(16,16,32,0.18)]"
            />
          )}
          {option === "monthly" ? "Monthly" : "Yearly"}
          {option === "yearly" && (
            <Badge variant="success" className="px-1.5 py-0 text-[0.625rem]">
              −20%
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}

export function PricingCards({
  showToggle = true,
  className,
}: {
  showToggle?: boolean;
  className?: string;
}) {
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {showToggle && (
        <BillingToggle cycle={cycle} onChange={setCycle} className="mb-12" />
      )}

      <Stagger className="grid w-full gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = cycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

          return (
            <RevealItem key={plan.id}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 sm:p-8",
                  plan.highlight
                    ? "border-primary/35 bg-card shadow-glow lg:-my-3 lg:py-11"
                    : "border-border/70 bg-card hover:border-primary/25",
                )}
              >
                {plan.highlight && (
                  <div
                    aria-hidden
                    className="bg-primary/8 pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl"
                  />
                )}

                {plan.badge && (
                  <Badge
                    variant={plan.highlight ? "default" : "muted"}
                    className="absolute -top-3 left-7 shadow-sm"
                  >
                    {plan.highlight && <Sparkles className="size-3" />}
                    {plan.badge}
                  </Badge>
                )}

                <div className="relative">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">{plan.tagline}</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25, ease: easeOutExpo }}
                        className="text-4xl font-semibold tracking-[-0.035em] tabular-nums"
                      >
                        ${price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-muted-foreground text-sm">/ month</span>
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    {cycle === "yearly"
                      ? `Billed $${price * 12} yearly · save $${(plan.priceMonthly - plan.priceYearly) * 12}`
                      : "Billed monthly · cancel anytime"}
                  </p>

                  <Button
                    asChild
                    size="lg"
                    variant={plan.highlight ? "gradient" : "outline"}
                    className="mt-7 w-full"
                  >
                    <Link href={`/sign-up?plan=${plan.id}&cycle=${cycle}`}>
                      {plan.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>

                  <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
                    {plan.bestFor}
                  </p>
                </div>

                <ul className="border-border/60 relative mt-7 flex flex-col gap-3.5 border-t pt-7">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className={cn(
                        "flex items-start gap-3 text-sm",
                        !feature.included && "text-muted-foreground/60",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full",
                          feature.included
                            ? "bg-primary/12 text-primary"
                            : "bg-muted text-muted-foreground/60",
                        )}
                      >
                        {feature.included ? (
                          <Check className="size-2.5" strokeWidth={3.5} />
                        ) : (
                          <Minus className="size-2.5" strokeWidth={3.5} />
                        )}
                      </span>
                      <span className="leading-snug">
                        {feature.label}
                        {feature.hint && (
                          <span className="text-muted-foreground block text-xs">
                            {feature.hint}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          );
        })}
      </Stagger>
    </div>
  );
}
