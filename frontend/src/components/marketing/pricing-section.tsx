import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { PricingCards } from "@/components/marketing/pricing-cards";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";

export function PricingSection() {
  return (
    <Section id="pricing" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-brand-violet/6 absolute top-1/3 -right-40 size-[28rem] rounded-full blur-3xl"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Simple subscriptions"
          title="Pick the amount of listening you need"
          description="Every plan includes real human listeners, encrypted conversations and session notes. Upgrade, downgrade or cancel whenever you like."
        />

        <PricingCards className="mt-12" />

        <Reveal delay={0.15} className="mt-12">
          <div className="border-border/70 bg-card/60 mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl border p-6 text-center backdrop-blur-sm sm:flex-row sm:text-left">
            <ShieldCheck className="text-success size-6 shrink-0" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              <span className="text-foreground font-medium">
                No cancellation flow, ever.
              </span>{" "}
              One click ends your subscription, you keep access until the period
              you&rsquo;ve paid for is up, and you can export everything on the
              way out.{" "}
              <Link href="/pricing" className="text-foreground underline underline-offset-4">
                Compare plans in detail
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
