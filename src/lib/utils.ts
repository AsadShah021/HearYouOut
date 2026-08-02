import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** `$1,240` / `$1,240.50` — trims the cents when they're zero. */
export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(
  date: Date | string,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
) {
  return new Intl.DateTimeFormat("en-US", opts).format(
    typeof date === "string" ? new Date(date) : date,
  );
}

/** "Today", "Tomorrow", or "Fri, Aug 8" — how humans actually read a schedule. */
export function formatRelativeDay(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(d) - startOf(today)) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return formatDate(d, { weekday: "short", month: "short", day: "numeric" });
}

/** `YYYY-MM-DD` in local time — the shape preferred dates are stored in. */
export function isoDay(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Formats a `YYYY-MM-DD` string without letting UTC parsing shift the day. */
export function formatIsoDay(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" },
) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", opts).format(new Date(year, month - 1, day));
}

/** `14:30` → `2:30 PM` */
export function formatSlot(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${`${minutes}`.padStart(2, "0")} ${period}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deterministic 0–1 value from a string — keeps mock data stable across renders. */
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
