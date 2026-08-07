import { LifeBuoy } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { disclaimer } from "@/lib/data/site";

/**
 * Crisis resources and the "this is not therapy" boundary.
 *
 * This used to live on /about. That page is parked for the testing phase, but
 * the disclaimer and these helplines are not optional on a service like this —
 * so they moved here rather than going away. Every `#safety` link on the site
 * points at this section.
 */
const resources = [
  { region: "United States", line: "988 Suicide & Crisis Lifeline — call or text 988" },
  { region: "United Kingdom", line: "Samaritans — call 116 123, free, 24/7" },
  { region: "Australia", line: "Lifeline — call 13 11 14" },
  { region: "Elsewhere", line: "findahelpline.com lists services in 130+ countries" },
];

export function SafetySection() {
  return (
    <Section id="safety" className="scroll-mt-24">
      <div className="container-page">
        <Reveal>
          <div className="border-destructive/20 bg-destructive/[0.035] mx-auto max-w-3xl rounded-3xl border p-8 sm:p-10">
            <span className="bg-destructive/10 text-destructive mb-6 grid size-12 place-items-center rounded-2xl">
              <LifeBuoy className="size-6" />
            </span>

            <h2 className="text-2xl font-semibold tracking-[-0.02em]">
              Safety and crisis resources
            </h2>

            <p className="text-muted-foreground mt-4 leading-relaxed">{disclaimer}</p>

            <div className="border-border/60 mt-8 grid gap-4 border-t pt-8 sm:grid-cols-2">
              {resources.map((resource) => (
                <div key={resource.region}>
                  <p className="text-sm font-semibold">{resource.region}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{resource.line}</p>
                </div>
              ))}
            </div>

            <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
              We are trained to recognise when someone needs professional support
              and to say so kindly and directly. That referral is a success, not a
              failed conversation.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
