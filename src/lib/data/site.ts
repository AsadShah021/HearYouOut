import {
  CalendarClock,
  Headphones,
  MessageSquareText,
  Mic,
  Video,
} from "lucide-react";

import type { NavItem, SessionMode, SessionModeMeta } from "@/types";

export const site = {
  name: "HearMeOut",
  tagline: "Everyone deserves someone who truly listens.",
  description:
    "HearMeOut is a small team of trained listeners. Chat with us now, or request a voice or Google Meet conversation and we'll confirm a time. Not therapy — real people who listen.",
  url: "https://hearmeout.com",
  locale: "en_US",
  email: "hello@hearmeout.com",
  twitter: "@hearmeout",
  /** Typical turnaround we promise on a meeting request. */
  requestResponseTime: "4 hours",
  keywords: [
    "human listener",
    "someone to talk to",
    "live chat listener",
    "idea validation",
    "business brainstorming",
    "confidence building",
    "non-judgmental listening",
    "google meet sessions",
    "subscription listening platform",
  ],
} as const;

/**
 * The one line that keeps this product legally and ethically legible.
 * Rendered anywhere a visitor might mistake us for a clinical service.
 */
export const disclaimer =
  "HearMeOut is not therapy, counseling, or mental health treatment. Our listeners are trained to listen — not to diagnose or treat. If you are in crisis, please contact your local emergency services.";

export const sessionModes: SessionModeMeta[] = [
  {
    id: "text",
    label: "Live chat with us",
    short: "Chat",
    description:
      "Open a chat and write. One of us reads it and replies in the same thread — no appointment, no waiting room.",
    icon: MessageSquareText,
    duration: "Start instantly",
    tone: "teal",
    booking: "instant",
  },
  {
    id: "voice",
    label: "Voice conversation",
    short: "Voice call",
    description:
      "A call with no camera. Just a voice on the other end, fully present. Tell us when suits and we'll confirm.",
    icon: Mic,
    duration: "30 or 45 min",
    tone: "violet",
    booking: "request",
  },
  {
    id: "meet-audio",
    label: "Google Meet audio",
    short: "Meet audio",
    description:
      "A scheduled audio session with a calendar invite, joined straight from your dashboard.",
    icon: Headphones,
    duration: "45 min",
    tone: "amber",
    booking: "request",
  },
  {
    id: "meet-video",
    label: "Google Meet video",
    short: "Meet video",
    description:
      "Face-to-face when you want to be seen as well as heard. Camera always optional.",
    icon: Video,
    duration: "45 or 60 min",
    tone: "rose",
    booking: "request",
    requiresPlan: "professional",
  },
];

export const sessionModeMap = Object.fromEntries(
  sessionModes.map((mode) => [mode.id, mode]),
) as Record<SessionMode, SessionModeMeta>;

/** The three formats that go through the request form rather than starting instantly. */
export const requestableModes = sessionModes.filter(
  (mode) => mode.booking === "request",
);

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Our team", href: "/listeners" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Talk to us",
    items: [
      { label: "Start a chat", href: "/chat" },
      { label: "Request a meeting", href: "/book" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About us", href: "/about" },
      { label: "Meet the team", href: "/listeners" },
      { label: "How we listen", href: "/about#standards" },
      { label: "Contact", href: `mailto:${site.email}` },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create account", href: "/sign-up" },
      { label: "Member dashboard", href: "/dashboard" },
      { label: "Team dashboard", href: "/listener" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "FAQ", href: "/#faq" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
      { label: "Safety & crisis resources", href: "/about#safety" },
    ],
  },
];

export const quickActions: NavItem[] = [
  { label: "Start a chat", href: "/chat", icon: MessageSquareText },
  { label: "Request a meeting", href: "/book", icon: CalendarClock },
];
