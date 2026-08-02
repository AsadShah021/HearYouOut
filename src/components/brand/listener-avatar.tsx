import { cn, initials, seededRandom } from "@/lib/utils";

const palettes = [
  "from-[var(--brand-violet)] to-[var(--brand-violet-soft)]",
  "from-[var(--brand-teal)] to-[var(--brand-violet-soft)]",
  "from-[var(--brand-amber)] to-[var(--brand-rose)]",
  "from-[var(--brand-rose)] to-[var(--brand-violet)]",
  "from-[var(--brand-violet-soft)] to-[var(--brand-teal)]",
];

const sizes = {
  xs: "size-7 text-[0.625rem]",
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
  "2xl": "size-28 text-2xl",
};

/**
 * Identity avatar. We deliberately use generated gradients rather than stock
 * photography — listeners choose whether to show their face, and a consistent
 * mark keeps the directory from reading as a marketplace of headshots.
 */
export function ListenerAvatar({
  name,
  size = "md",
  className,
  ring = false,
  online = false,
  announce = false,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  ring?: boolean;
  online?: boolean;
  /** Set when the avatar stands alone — otherwise the adjacent name is enough. */
  announce?: boolean;
}) {
  const palette = palettes[Math.floor(seededRandom(name) * palettes.length)];

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      aria-hidden={announce ? undefined : true}
    >
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-full bg-linear-to-br font-semibold text-white select-none",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
          palette,
          sizes[size],
          ring && "ring-background ring-2",
        )}
      >
        {initials(name)}
      </span>
      {announce && <span className="sr-only">{name}</span>}
      {online && (
        <span className="absolute right-0 bottom-0 flex size-3">
          <span className="bg-success/70 absolute inline-flex size-full animate-ping rounded-full" />
          <span className="bg-success ring-background relative inline-flex size-3 rounded-full ring-2" />
        </span>
      )}
    </span>
  );
}
