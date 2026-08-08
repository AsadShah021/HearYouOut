import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Stagger, RevealItem } from "@/components/motion/reveal";
import { toneClasses } from "@/components/shared/mode-badge";
import { Section, SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function ServicesGrid({
  limit,
  showHeading = true,
}: {
  limit?: number;
  showHeading?: boolean;
}) {
  const items = limit ? services.slice(0, limit) : services;

  return (
    <Section id="services" className="bg-muted/25 relative">
      <div className="container-page">
        {showHeading && (
          <SectionHeading
            eyebrow="What people talk about"
            title="Bring whatever is actually on your mind"
            description="Some sessions are about a business. Some are about a Tuesday. Both are welcome here — pick a starting point or arrive with nothing at all."
          />
        )}

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((service) => (
            <RevealItem key={service.slug} id={service.slug} className="scroll-mt-28">
              <div className="group border-border/70 bg-card hover:border-primary/30 flex h-full flex-col gap-4 rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl ring-1 ring-inset",
                    toneClasses[service.tone],
                  )}
                >
                  <service.icon className="size-5" />
                </span>

                <div className="flex-1">
                  <h3 className="mb-1.5 text-[0.975rem] font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.summary}
                  </p>
                </div>

                <Link
                  href={`/book?service=${service.slug}`}
                  className="text-primary inline-flex items-center gap-1.5 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  Request this conversation
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        {limit && (
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/services">
                Explore all services <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}
