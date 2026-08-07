import { Fragment } from "react";
import Link from "next/link";
import { Check, Minus, ShieldCheck, Sparkles } from "lucide-react";

import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { comparisonMatrix, plans } from "@/lib/data/plans";
import { faqs } from "@/lib/data/marketing";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Pricing",
  description:
    "Three simple subscriptions: Starter at $39, Professional at $89, Premium at $179. Real human listeners, encrypted conversations, cancel anytime.",
  path: "/pricing",
});

const billingFaqs = faqs.filter((faq) => faq.category === "billing");

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="bg-primary/12 text-primary mx-auto grid size-5 place-items-center rounded-full">
        <Check className="size-3" strokeWidth={3.5} />
        <span className="sr-only">Included</span>
      </span>
    ) : (
      <span className="bg-muted text-muted-foreground/70 mx-auto grid size-5 place-items-center rounded-full">
        <Minus className="size-3" strokeWidth={3.5} />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className="text-sm">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow={
          <>
            <Sparkles className="size-3.5" /> 20% off yearly plans
          </>
        }
        title="Pick the amount of"
        highlight="listening you need"
        description="Every plan includes real human listeners, encrypted conversations, session notes and the ability to cancel in a single click."
      />

      <div className="container-page pb-8">
        <PricingCards />
      </div>

      <Section className="pt-12">
        <div className="container-page">
          <SectionHeading
            eyebrow="Side by side"
            title="Compare every plan"
            description="The full detail, without the asterisks."
          />

          <Reveal className="mt-12">
            <div className="border-border/70 bg-card overflow-hidden rounded-3xl border">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[46rem] border-collapse text-left">
                  <thead>
                    <tr className="border-border/70 border-b">
                      <th
                        scope="col"
                        className="text-muted-foreground w-[34%] px-6 py-5 text-xs font-medium"
                      >
                        Feature
                      </th>
                      {plans.map((plan) => (
                        <th
                          key={plan.id}
                          scope="col"
                          className={cn(
                            "px-6 py-5 text-center",
                            plan.highlight && "bg-primary/[0.035]",
                          )}
                        >
                          <span className="block text-sm font-semibold">{plan.name}</span>
                          <span className="text-muted-foreground block text-xs font-normal">
                            ${plan.priceMonthly}/mo
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.map((group) => (
                      <Fragment key={group.group}>
                        <tr className="bg-muted/40">
                          <th
                            scope="colgroup"
                            colSpan={4}
                            className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                          >
                            {group.group}
                          </th>
                        </tr>
                        {group.rows.map((row) => (
                          <tr
                            key={row.label}
                            className="border-border/50 border-b last:border-b-0"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 text-sm font-normal"
                            >
                              {row.label}
                            </th>
                            <td className="px-6 py-4 text-center">
                              <Cell value={row.starter} />
                            </td>
                            <td className="bg-primary/[0.035] px-6 py-4 text-center">
                              <Cell value={row.professional} />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Cell value={row.premium} />
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-muted/25 pt-0">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Billing"
                title="No surprises, no lock-in"
                description="The commercial terms in plain language."
              />

              <Reveal delay={0.1} className="mt-8">
                <div className="border-border/70 bg-card rounded-3xl border p-6">
                  <ShieldCheck className="text-success mb-4 size-6" />
                  <p className="text-sm font-medium">Unused sessions roll over</p>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    On Starter and Professional, sessions you don&rsquo;t use carry
                    into the following month. A quiet month is never wasted.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-5">
                    <Link href="/sign-up">Start your subscription</Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <Accordion type="single" collapsible className="w-full">
                {billingFaqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`billing-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItem value="billing-switch">
                  <AccordionTrigger>Can I switch plans mid-month?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Upgrades apply immediately and we prorate the difference —
                    your new session allowance is available the moment you switch.
                    Downgrades take effect at your next billing date so you keep
                    everything you&rsquo;ve already paid for.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="billing-refund">
                  <AccordionTrigger>What if a session goes badly?</AccordionTrigger>
                  <AccordionContent>
                    Tell us within 48 hours and we&rsquo;ll credit the session back to
                    your allowance, no explanation needed. If a listener wasn&rsquo;t
                    the right fit, we&rsquo;ll help you find someone who is.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
