import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";

import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal, Stagger, RevealItem } from "@/components/motion/reveal";
import { ModeBadge, toneClasses } from "@/components/shared/mode-badge";
import { Section, SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";
import { sessionModes } from "@/lib/data/site";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Idea validation, business brainstorming, creative thinking, career discussions, life conversations, confidence building, decision support and general listening — over text, voice or Google Meet.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Eight ways to start"
        title="Every conversation starts somewhere. Ours starts"
        highlight="with you talking"
        description="These aren't packages or programmes — they're the topics people bring most often. Pick the one that fits, or book a general session and see where it goes."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="gradient">
            <Link href="/book">
              Request a meeting <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/chat">Or start a chat now</Link>
          </Button>
        </div>
      </PageHero>

      <Section className="pt-4">
        <div className="container-page">
          <div className="flex flex-col gap-4">
            {services.map((service, index) => (
              <Reveal key={service.slug} id={service.slug} className="scroll-mt-28">
                <article
                  className={cn(
                    "border-border/70 bg-card group relative grid gap-8 overflow-hidden rounded-3xl border p-7 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12",
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -left-24 size-80 rounded-full opacity-[0.07] blur-3xl transition-opacity duration-500 group-hover:opacity-[0.14]"
                    style={{ background: `var(--brand-${service.tone})` }}
                  />

                  <div className="relative">
                    <div className="mb-6 flex items-center gap-4">
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-2xl ring-1 ring-inset",
                          toneClasses[service.tone],
                        )}
                      >
                        <service.icon className="size-5.5" />
                      </span>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-foreground/90 text-[1.0625rem] leading-relaxed font-medium">
                      {service.summary}
                    </p>
                    <p className="text-muted-foreground mt-3.5 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground mr-1 text-xs">
                        Works best over
                      </span>
                      {service.recommendedModes.map((mode) => (
                        <ModeBadge key={mode} mode={mode} />
                      ))}
                    </div>

                    <Button asChild variant="subtle" size="sm" className="mt-7">
                      <Link href={`/book?service=${service.slug}`}>
                        Request this conversation <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>

                  <div className="relative flex flex-col gap-5">
                    <div className="border-border/60 bg-muted/35 rounded-2xl border p-5">
                      <p className="mb-4 text-xs font-semibold tracking-wide uppercase">
                        You usually leave with
                      </p>
                      <ul className="flex flex-col gap-3">
                        {service.outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2.5 text-sm">
                            <span className="bg-success/15 text-success mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full">
                              <Check className="size-2.5" strokeWidth={3.5} />
                            </span>
                            <span className="leading-snug">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-border/60 rounded-2xl border p-5">
                      <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
                        People often open with
                      </p>
                      <ul className="flex flex-col gap-3.5">
                        {service.prompts.map((prompt) => (
                          <li key={prompt} className="flex gap-2.5">
                            <Quote className="text-primary/30 size-3.5 shrink-0 translate-y-1" />
                            <p className="text-muted-foreground text-sm leading-relaxed italic">
                              {prompt}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-muted/25">
        <div className="container-page">
          <SectionHeading
            eyebrow="No topic required"
            title="You can also just show up"
            description="Plenty of members book a general listening session with nothing prepared. Your listener will follow you rather than steer you."
          />

          <Stagger className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sessionModes.map((mode) => (
              <RevealItem key={mode.id}>
                <Link
                  href={`/book?mode=${mode.id}`}
                  className="border-border/70 bg-card hover:border-primary/35 flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors"
                >
                  <mode.icon className="text-primary size-5" />
                  <span className="text-sm font-medium">{mode.short}</span>
                  <span className="text-muted-foreground text-xs">{mode.duration}</span>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
