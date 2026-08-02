import { Stagger, RevealItem } from "@/components/motion/reveal";
import { trustStats } from "@/lib/data/marketing";

export function TrustBar() {
  return (
    <section className="border-border/60 relative border-y">
      <div className="container-page">
        <Stagger
          stagger={0.06}
          className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:divide-y-0 lg:grid-cols-4"
        >
          {trustStats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col items-center gap-1.5 px-4 py-8 text-center sm:py-10"
            >
              <span className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {stat.label}
              </span>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
