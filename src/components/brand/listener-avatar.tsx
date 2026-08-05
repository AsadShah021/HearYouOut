"use client";

import * as React from "react";
import Image from "next/image";

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
  /** Portrait size — big enough that a face in a wide shot is still readable. */
  "3xl": "size-36 text-3xl sm:size-40",
};

/** Rendered width in px, so Next serves a sensibly sized image. */
const pixelSizes: Record<keyof typeof sizes, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
  "2xl": 112,
  "3xl": 160,
};

/**
 * Identity avatar. Shows a real photograph when one exists — this is a service
 * about real people, and faces are the point — and falls back to a generated
 * gradient mark with the person's initials otherwise.
 *
 * The fallback also catches load failures, so a photo that hasn't been added to
 * /public yet degrades quietly instead of showing a broken image.
 */
export function ListenerAvatar({
  name,
  src,
  size = "md",
  shape = "circle",
  className,
  ring = false,
  online = false,
  announce = false,
}: {
  name: string;
  /** Path under /public. Empty or missing falls back to the gradient mark. */
  src?: string;
  size?: keyof typeof sizes;
  /** Square reads better for a large portrait; circle for inline identity. */
  shape?: "circle" | "square";
  className?: string;
  ring?: boolean;
  online?: boolean;
  /** Set when the avatar stands alone — otherwise the adjacent name is enough. */
  announce?: boolean;
}) {
  const [failed, setFailed] = React.useState(false);
  const radius = shape === "square" ? "rounded-2xl" : "rounded-full";
  const palette = palettes[Math.floor(seededRandom(name) * palettes.length)];
  const showPhoto = Boolean(src) && !failed;

  // A newly supplied photo should get another chance to load.
  React.useEffect(() => setFailed(false), [src]);

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      aria-hidden={announce ? undefined : true}
    >
      {showPhoto ? (
        <Image
          src={src!}
          alt={announce ? name : ""}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          onError={() => setFailed(true)}
          className={cn(
            // Bias to the top so a head near the frame edge never gets cropped.
            "object-cover object-top",
            radius,
            sizes[size],
            ring && "ring-background ring-2",
          )}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "grid place-items-center bg-linear-to-br font-semibold text-white select-none",
            radius,
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
            palette,
            sizes[size],
            ring && "ring-background ring-2",
          )}
        >
          {initials(name)}
        </span>
      )}

      {announce && !showPhoto && <span className="sr-only">{name}</span>}

      {online && (
        <span className="absolute right-0 bottom-0 flex size-3">
          <span className="bg-success/70 absolute inline-flex size-full animate-ping rounded-full" />
          <span className="bg-success ring-background relative inline-flex size-3 rounded-full ring-2" />
        </span>
      )}
    </span>
  );
}
