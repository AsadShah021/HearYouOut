import { sessionModeMap } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import type { SessionMode } from "@/types";

export const toneClasses: Record<string, string> = {
  violet: "bg-brand-violet/10 text-brand-violet ring-brand-violet/20",
  teal: "bg-brand-teal/12 text-brand-teal ring-brand-teal/25",
  amber: "bg-brand-amber/14 text-brand-amber ring-brand-amber/25",
  rose: "bg-brand-rose/12 text-brand-rose ring-brand-rose/25",
};

/** Small labelled chip identifying how a conversation happens. */
export function ModeBadge({
  mode,
  className,
  showLabel = true,
  size = "sm",
}: {
  mode: SessionMode;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const meta = sessionModeMap[mode];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset",
        toneClasses[meta.tone],
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3.5" : "size-4"} />
      {showLabel && meta.short}
    </span>
  );
}

/** Square icon tile used in feature grids and dashboard rows. */
export function ModeIcon({
  mode,
  className,
}: {
  mode: SessionMode;
  className?: string;
}) {
  const meta = sessionModeMap[mode];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
        toneClasses[meta.tone],
        className,
      )}
    >
      <Icon className="size-4.5" />
    </span>
  );
}
