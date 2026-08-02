import type { LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                Conversations                               */
/* -------------------------------------------------------------------------- */

export type SessionMode = "text" | "voice" | "meet-audio" | "meet-video";

export interface SessionModeMeta {
  id: SessionMode;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** Typical length shown in the booking flow. */
  duration: string;
  /** Tailwind token name from the brand ramp. */
  tone: "violet" | "teal" | "amber" | "rose";
  /** Chat starts immediately; live formats go through the request form. */
  booking: "instant" | "request";
  requiresPlan?: PlanId;
}

export type SessionStatus = "upcoming" | "live" | "completed" | "cancelled";

export interface Session {
  id: string;
  listenerId: string;
  mode: SessionMode;
  /** ISO 8601 */
  startsAt: string;
  durationMinutes: number;
  status: SessionStatus;
  topic: string;
  meetUrl?: string;
  notes?: string;
  rating?: number;
}

/* -------------------------------------------------------------------------- */
/*                                  Listeners                                 */
/* -------------------------------------------------------------------------- */

export interface Listener {
  id: string;
  name: string;
  slug: string;
  headline: string;
  bio: string;
  avatar: string;
  location: string;
  timezone: string;
  languages: string[];
  specialties: string[];
  modes: SessionMode[];
  rating: number;
  reviews: number;
  sessions: number;
  yearsListening: number;
  responseTime: string;
  /** Marks the small set of listeners surfaced on the landing page. */
  featured?: boolean;
  verified: boolean;
  favourite?: boolean;
  nextAvailable: string;
}

export interface Review {
  id: string;
  author: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  body: string;
  mode: SessionMode;
}

/* -------------------------------------------------------------------------- */
/*                                   Plans                                    */
/* -------------------------------------------------------------------------- */

export type PlanId = "starter" | "professional" | "premium";
export type BillingCycle = "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  sessionsPerMonth: number | "unlimited";
  highlight?: boolean;
  badge?: string;
  bestFor: string;
  features: { label: string; included: boolean; hint?: string }[];
  cta: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Services                                  */
/* -------------------------------------------------------------------------- */

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  tone: "violet" | "teal" | "amber" | "rose";
  outcomes: string[];
  prompts: string[];
  recommendedModes: SessionMode[];
}

/* -------------------------------------------------------------------------- */
/*                              Meeting requests                              */
/* -------------------------------------------------------------------------- */

/** Live meetings are request-based: the member asks, we confirm the time. */
export type RequestStatus = "new" | "reviewing" | "scheduled" | "declined";

export type TimeWindow = "early" | "morning" | "afternoon" | "evening" | "late";

export type Urgency = "flexible" | "this-week" | "asap";

export interface MeetingRequest {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  timezone: string;
  mode: Exclude<SessionMode, "text">;
  topic: string;
  context?: string;
  /** ISO day strings the person said they're free. */
  preferredDates: string[];
  preferredWindows: TimeWindow[];
  urgency: Urgency;
  preferredListenerId?: string;
  submittedAt: string;
  status: RequestStatus;
  scheduledFor?: string;
  isReturning?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                    Chat                                    */
/* -------------------------------------------------------------------------- */

export type ChatStatus = "waiting" | "active" | "closed";

/** A chat as the team sees it — visitors and members land in the same inbox. */
export interface ChatConversation {
  id: string;
  personName: string;
  personEmail?: string;
  source: "visitor" | "member";
  status: ChatStatus;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  waitingFor?: string;
  assignedTo?: string;
  topic?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Dashboard content                             */
/* -------------------------------------------------------------------------- */

export interface Conversation {
  id: string;
  listenerId: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  pinned?: boolean;
}

export interface Message {
  id: string;
  author: "me" | "listener";
  body: string;
  sentAt: string;
}

export interface NoteEntry {
  id: string;
  sessionId?: string;
  title: string;
  excerpt: string;
  createdAt: string;
  tags: string[];
  author: "listener" | "me";
}

export interface Idea {
  id: string;
  title: string;
  summary: string;
  stage: "spark" | "shaping" | "validating" | "committed";
  createdAt: string;
  tags: string[];
  confidence: number;
}

export interface UsageSummary {
  planId: PlanId;
  cycleRenewsAt: string;
  sessionsIncluded: number | "unlimited";
  sessionsUsed: number;
  messagesUsed: number;
  minutesTalked: number;
}

/* -------------------------------------------------------------------------- */
/*                             Listener dashboard                             */
/* -------------------------------------------------------------------------- */

export interface Appointment {
  id: string;
  clientName: string;
  clientAvatar?: string;
  mode: SessionMode;
  startsAt: string;
  durationMinutes: number;
  topic: string;
  isNewClient?: boolean;
  meetUrl?: string;
}

export interface ClientNote {
  id: string;
  clientName: string;
  clientAvatar?: string;
  updatedAt: string;
  summary: string;
  sessionCount: number;
  tags: string[];
}

export interface EarningsPoint {
  label: string;
  amount: number;
}

export interface AvailabilityDay {
  day: string;
  enabled: boolean;
  slots: { from: string; to: string }[];
}

/* -------------------------------------------------------------------------- */
/*                                 Marketing                                  */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  mode: SessionMode;
}

export interface Faq {
  question: string;
  answer: string;
  category: "basics" | "sessions" | "privacy" | "billing";
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}
