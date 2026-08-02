import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/data/marketing";
import { site } from "@/lib/data/site";

export function FaqSection() {
  return (
    <Section id="faq" className="bg-muted/25">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Questions people ask first"
              title="Everything you're wondering, answered plainly"
              description="Especially the one about whether this is therapy. It isn't — and we explain exactly what that means."
            />

            <Reveal delay={0.15} className="mt-8">
              <div className="border-border/70 bg-card rounded-3xl border p-6">
                <MessageCircleQuestion className="text-primary mb-4 size-6" />
                <p className="text-sm font-medium">Still unsure?</p>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  Ask us anything before you subscribe. A person replies, usually
                  within a few hours.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-5">
                  <Link href={`mailto:${site.email}`}>Email the team</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
