import Link from "next/link";

import { cn } from "@/lib/utils";
import { site } from "@/lib/data/site";

/**
 * The mark: a speech bubble whose tail doubles as the opening of an ear, with
 * two arcs travelling toward it — sound arriving at someone who's listening.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={cn("size-8", className)}
    >
      <defs>
        <linearGradient id="hmo-mark" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-violet)" />
          <stop offset="0.55" stopColor="var(--brand-violet-soft)" />
          <stop offset="1" stopColor="var(--brand-amber)" />
        </linearGradient>
      </defs>
      <path
        d="M16 3.5c7.18 0 12.5 4.6 12.5 10.7 0 6.1-5.32 10.7-12.5 10.7-1.16 0-2.29-.1-3.36-.3l-5.3 3.16a.9.9 0 0 1-1.36-.86l.36-4.6C3.6 20.3 3.5 17.3 3.5 14.2 3.5 8.1 8.82 3.5 16 3.5Z"
        fill="url(#hmo-mark)"
      />
      <path
        d="M13.1 18.9c-1.5-.85-2.4-2.3-2.4-4.05 0-2.7 2.2-4.75 4.95-4.75 2.4 0 4.2 1.5 4.2 3.5 0 1.7-1.3 2.9-2.85 2.9-1.1 0-1.85-.6-1.85-1.5"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeOpacity="0.95"
      />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={`${site.name} home`}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full transition-opacity hover:opacity-85 focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
        className,
      )}
    >
      <LogoMark className="size-8 transition-transform duration-500 group-hover:rotate-[-6deg]" />
      {showWordmark && (
        <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">
          Snug<span className="text-primary">Talk</span>
        </span>
      )}
    </Link>
  );
}
