import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < Math.round(value)
                ? "fill-brand-amber text-brand-amber"
                : "text-muted-foreground/30",
            )}
          />
        ))}
      </span>
      <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground text-xs">
          ({count.toLocaleString()})
        </span>
      )}
      <span className="sr-only">
        Rated {value} out of 5{count !== undefined ? ` from ${count} reviews` : ""}
      </span>
    </span>
  );
}
