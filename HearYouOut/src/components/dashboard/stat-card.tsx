import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  tone?: "default" | "brand";
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5",
        tone === "brand" && "border-primary/25 bg-primary/[0.035]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl",
            tone === "brand" ? "bg-primary/12 text-primary" : "bg-muted text-foreground",
          )}
        >
          <Icon className="size-4.5" />
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
              trend.direction === "up"
                ? "bg-success/12 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] tabular-nums">
        {value}
      </p>
      <p className="text-muted-foreground mt-0.5 text-sm">{label}</p>
      {hint && <p className="text-muted-foreground/80 mt-2 text-xs">{hint}</p>}
    </Card>
  );
}
