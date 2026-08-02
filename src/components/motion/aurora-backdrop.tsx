import { cn } from "@/lib/utils";

/**
 * Slow-drifting colour field behind hero sections. Pure CSS so it costs nothing
 * on the main thread and degrades to a static wash under reduced motion.
 */
export function AuroraBackdrop({
  className,
  intensity = "default",
}: {
  className?: string;
  intensity?: "subtle" | "default" | "bold";
}) {
  const opacity = {
    subtle: "opacity-40 dark:opacity-30",
    default: "opacity-70 dark:opacity-50",
    bold: "opacity-90 dark:opacity-65",
  }[intensity];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className={cn("absolute inset-0", opacity)}>
        <div className="animate-aurora absolute -top-1/3 -left-[15%] size-[46rem] rounded-full bg-[radial-gradient(circle_at_center,var(--brand-violet),transparent_65%)] blur-3xl" />
        <div
          className="animate-aurora absolute -top-[22%] right-[-10%] size-[38rem] rounded-full bg-[radial-gradient(circle_at_center,var(--brand-amber),transparent_65%)] blur-3xl"
          style={{ animationDelay: "-7s", animationDuration: "26s" }}
        />
        <div
          className="animate-aurora absolute top-[35%] left-[28%] size-[42rem] rounded-full bg-[radial-gradient(circle_at_center,var(--brand-teal),transparent_68%)] blur-3xl"
          style={{ animationDelay: "-14s", animationDuration: "30s" }}
        />
      </div>

      {/* Fine grain keeps the gradient from banding on wide displays */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
