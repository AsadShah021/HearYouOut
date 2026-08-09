import { Quote } from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { founders, foundersReady } from "@/lib/data/founders";
import { cn } from "@/lib/utils";

/**
 * "Meet the founders" — the site claims we built what we wished existed, so this
 * is where we say who "we" is.
 *
 * Each founder's letter renders only once it has been written. Until then the
 * card shows the photo, name and role, which is true, and nothing more, which is
 * better than filling the space with something invented.
 */
export function Founders() {
  if (!foundersReady) return null;

  const anyLetterMissing = founders.some((founder) => founder.letter.length === 0);

  return (
    <Section id="founders" className="scroll-mt-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Meet the founders"
          title="Who &ldquo;we&rdquo; actually is"
          description="We built the thing we kept wishing existed. That sentence is on our homepage, so it seems only fair to show you who wrote it."
        />

        {anyLetterMissing && process.env.NODE_ENV !== "production" && (
          <Reveal className="mx-auto mt-8 max-w-2xl">
            <p className="border-warning/40 bg-warning/[0.05] text-muted-foreground rounded-2xl border border-dashed p-4 text-center text-xs leading-relaxed">
              <span className="text-foreground font-semibold">
                Development note — not shown to visitors.
              </span>{" "}
              One or more founders still have an empty{" "}
              <code className="font-mono">letter</code> in{" "}
              <code className="font-mono">src/lib/data/founders.ts</code>. Add
              paragraphs there and they appear on this card automatically.
            </p>
          </Reveal>
        )}

        <div
          className={cn(
            "mx-auto mt-12 grid gap-6",
            founders.length > 1 ? "lg:grid-cols-2" : "max-w-2xl",
          )}
        >
          {founders.map((founder, index) => (
            <Reveal key={founder.id} delay={index * 0.08}>
              <article className="border-border/70 bg-card relative flex h-full flex-col gap-6 overflow-hidden rounded-3xl border p-7 sm:p-8">
                {founder.letter.length > 0 && (
                  <Quote
                    aria-hidden
                    className="text-primary/10 absolute -top-2 right-4 size-24"
                  />
                )}

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                  <ListenerAvatar
                    name={founder.name}
                    src={founder.photo}
                    size="3xl"
                    shape="square"
                    announce
                  />
                  <div className="min-w-0">
                    <p className="text-xl font-semibold">{founder.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-sm">{founder.role}</p>
                  </div>
                </div>

                {founder.letter.length > 0 && (
                  <>
                    <div className="relative flex flex-col gap-4">
                      {founder.letter.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 40)}
                          className="text-muted-foreground text-sm leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <p className="font-display border-border/60 mt-auto border-t pt-5 text-xl italic">
                      {founder.signature}
                    </p>
                  </>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
