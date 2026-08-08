import * as React from "react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("relative py-20 sm:py-24 lg:py-32", className)} {...props}>
      {children}
    </section>
  );
}

export function Eyebrow({ className, children }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "border-border/70 bg-card/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-xl text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}
