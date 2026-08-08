import { cn, formatCurrency } from "@/lib/utils";
import type { EarningsPoint } from "@/types";

/**
 * Lightweight bar chart — no charting dependency for six data points, and it
 * inherits the brand ramp so it themes for free.
 */
export function EarningsChart({
  data,
  className,
}: {
  data: EarningsPoint[];
  className?: string;
}) {
  const max = Math.max(...data.map((point) => point.amount));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex h-44 items-end gap-2.5" role="img" aria-label="Monthly earnings">
        {data.map((point, index) => {
          const height = Math.round((point.amount / max) * 100);
          const latest = index === data.length - 1;
          return (
            <div key={point.label} className="group flex flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  "text-[0.6875rem] font-medium tabular-nums transition-opacity",
                  latest ? "text-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100",
                )}
              >
                {formatCurrency(point.amount)}
              </span>
              <div
                style={{ height: `${height}%` }}
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500",
                  latest
                    ? "bg-[linear-gradient(180deg,var(--brand-violet),color-mix(in_oklab,var(--brand-violet)_55%,var(--brand-amber)))]"
                    : "bg-primary/25 group-hover:bg-primary/45",
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-2.5">
        {data.map((point) => (
          <span
            key={point.label}
            className="text-muted-foreground flex-1 text-center text-xs"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
