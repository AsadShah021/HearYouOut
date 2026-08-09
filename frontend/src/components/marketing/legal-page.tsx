import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

/** Shared shell for the policy pages so they stay visually part of the product. */
export function LegalPage({
  title,
  highlight,
  updated,
  intro,
  sections,
}: {
  title: string;
  highlight: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero
        eyebrow={`Last updated ${updated}`}
        title={title}
        highlight={highlight}
        description={intro}
        className="pb-8"
      />

      <Section className="pt-4">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            {/* Contents */}
            <Reveal className="border-border/70 bg-card mb-10 rounded-2xl border p-6">
              <p className="mb-4 text-sm font-semibold">On this page</p>
              <ol className="grid gap-2 sm:grid-cols-2">
                {sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#s-${index}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {index + 1}. {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </Reveal>

            <div className="flex flex-col gap-10">
              {sections.map((section, index) => (
                <Reveal key={section.heading} id={`s-${index}`} className="scroll-mt-28">
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">
                    {index + 1}. {section.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="text-muted-foreground flex flex-col gap-2.5 pl-1">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 leading-relaxed">
                            <span className="bg-primary/50 mt-2.5 size-1.5 shrink-0 rounded-full" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
