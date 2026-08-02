import { AuroraBackdrop } from "@/components/motion/aurora-backdrop";
import { Stagger, RevealItem } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/shared/section";
import { cn } from "@/lib/utils";

/** Shared top-of-page treatment for every marketing page after the landing page. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  /** Rendered in display italic at the end of the headline. */
  highlight?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-44",
        className,
      )}
    >
      <AuroraBackdrop intensity="subtle" className="mask-fade-b" />
      <div
        aria-hidden
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="container-page relative">
        <Stagger className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {eyebrow && (
            <RevealItem className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </RevealItem>
          )}
          <RevealItem>
            <h1 className="text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.5rem]">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-gradient font-display text-[1.08em] italic">
                    {highlight}
                  </span>
                </>
              )}
            </h1>
          </RevealItem>
          {description && (
            <RevealItem>
              <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                {description}
              </p>
            </RevealItem>
          )}
          {children && <RevealItem className="mt-9">{children}</RevealItem>}
        </Stagger>
      </div>
    </section>
  );
}
