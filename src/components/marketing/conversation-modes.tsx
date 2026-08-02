import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Stagger, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { toneClasses } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { sessionModes } from "@/lib/data/site";
import { cn } from "@/lib/utils";

export function ConversationModes() {
  return (
    <Section id="ways-to-talk">
      <div className="container-page">
        <SectionHeading
          eyebrow="Four ways to be heard"
          title="Choose the way that feels easiest today"
          description="Chat starts the moment you open it. Voice and Google Meet sessions are arranged by request, so a person reads what you need before picking a time."
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sessionModes.map((mode) => (
            <RevealItem key={mode.id}>
              <Link
                href={mode.booking === "instant" ? "/chat" : `/book?mode=${mode.id}`}
                className="group border-border/70 bg-card hover:border-primary/35 relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div
                  aria-hidden
                  className="absolute -top-16 -right-12 size-40 rounded-full bg-[radial-gradient(circle,var(--tw-gradient-from),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: `radial-gradient(circle, var(--brand-${mode.tone}), transparent 70%)`,
                  }}
                />
                <span
                  className={cn(
                    "relative grid size-12 place-items-center rounded-2xl ring-1 ring-inset",
                    toneClasses[mode.tone],
                  )}
                >
                  <mode.icon className="size-5.5" />
                </span>

                <div className="relative flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{mode.short}</h3>
                    {mode.booking === "instant" ? (
                      <Badge variant="success" className="text-[0.625rem]">
                        Instant
                      </Badge>
                    ) : (
                      <Badge variant="muted" className="text-[0.625rem]">
                        By request
                      </Badge>
                    )}
                    {mode.requiresPlan && (
                      <Badge variant="muted" className="text-[0.625rem]">
                        Pro+
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {mode.description}
                  </p>
                </div>

                <div className="border-border/60 relative flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground text-xs">{mode.duration}</span>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-primary size-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
