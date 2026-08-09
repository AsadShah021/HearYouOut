import type { Plan } from "@/types";

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Room to talk when you need it",
    priceMonthly: 39,
    priceYearly: 31,
    sessionsPerMonth: 2,
    bestFor: "Trying it out, or one meaningful conversation a fortnight.",
    cta: "Start with Starter",
    features: [
      { label: "2 live sessions per month", included: true, hint: "45 minutes each" },
      { label: "Secure text chat support", included: true },
      { label: "Voice calls", included: true },
      { label: "Session notes after every call", included: true },
      { label: "Browse and choose any listener", included: true },
      { label: "Google Meet video sessions", included: false },
      { label: "Priority booking", included: false },
      { label: "Dedicated preferred listener", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For people building something",
    priceMonthly: 89,
    priceYearly: 71,
    sessionsPerMonth: 6,
    highlight: true,
    badge: "Most chosen",
    bestFor: "Founders, creatives and anyone thinking out loud every week.",
    cta: "Choose Professional",
    features: [
      { label: "6 live sessions per month", included: true, hint: "45 or 60 minutes" },
      { label: "Unlimited text chat", included: true },
      { label: "Voice calls", included: true },
      { label: "Google Meet video sessions", included: true },
      { label: "Priority booking windows", included: true, hint: "24h before general release" },
      { label: "Favourite listener shortlist", included: true },
      { label: "Saved ideas & conversation notes", included: true },
      { label: "Dedicated preferred listener", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Someone who already knows your story",
    priceMonthly: 179,
    priceYearly: 143,
    sessionsPerMonth: "unlimited",
    badge: "Unlimited",
    bestFor: "Continuous thinking partnership with one consistent listener.",
    cta: "Go Premium",
    features: [
      { label: "Unlimited monthly sessions", included: true, hint: "Fair-use, 2 per day" },
      { label: "Unlimited messaging", included: true },
      { label: "Voice conversations", included: true },
      { label: "Face-to-face Google Meet meetings", included: true },
      { label: "Dedicated preferred listener", included: true },
      { label: "Early booking access", included: true, hint: "72h before general release" },
      { label: "Personalised conversation history", included: true },
      { label: "Progress journal", included: true },
    ],
  },
];

export const planMap = Object.fromEntries(plans.map((p) => [p.id, p])) as Record<
  Plan["id"],
  Plan
>;

/** Rows for the side-by-side comparison table on /pricing. */
export const comparisonMatrix: {
  group: string;
  rows: { label: string; starter: string | boolean; professional: string | boolean; premium: string | boolean }[];
}[] = [
  {
    group: "Conversations",
    rows: [
      { label: "Live sessions per month", starter: "2", professional: "6", premium: "Unlimited" },
      { label: "Session length", starter: "45 min", professional: "45–60 min", premium: "45–60 min" },
      { label: "Secure text chat", starter: "Business hours", professional: "Unlimited", premium: "Unlimited" },
      { label: "Voice calls", starter: true, professional: true, premium: true },
      { label: "Google Meet audio", starter: true, professional: true, premium: true },
      { label: "Google Meet video", starter: false, professional: true, premium: true },
    ],
  },
  {
    group: "Matching & booking",
    rows: [
      { label: "Browse all listeners", starter: true, professional: true, premium: true },
      { label: "Favourite listeners", starter: false, professional: true, premium: true },
      { label: "Dedicated preferred listener", starter: false, professional: false, premium: true },
      { label: "Booking window", starter: "General", professional: "24h early", premium: "72h early" },
      { label: "Reschedule window", starter: "12h", professional: "4h", premium: "1h" },
    ],
  },
  {
    group: "Your record",
    rows: [
      { label: "Session notes", starter: true, professional: true, premium: true },
      { label: "Saved ideas board", starter: false, professional: true, premium: true },
      { label: "Full conversation history", starter: "90 days", professional: "12 months", premium: "Forever" },
      { label: "Progress journal", starter: false, professional: false, premium: true },
      { label: "Export your data", starter: true, professional: true, premium: true },
    ],
  },
];
