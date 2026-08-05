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
  /** 30–60s self-introduction. Absent until the file is added to /public/videos. */
  introVideo?: string;
  introPoster?: string;
  /** Shown beneath the player; required alongside captions for accessibility. */
  introTranscript?: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  photo: string;
  /** First-person, signed. The whole point is that it reads as a person. */
  letter: string[];
  signature: string;
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

/**
 * "work" covers ideas, career and decisions. "life" covers the heavier personal
 * conversations, which carry an explicit boundary notice and can be held
 * anonymously.
 */
export type ServiceGroup = "work" | "life";

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  tone: "violet" | "teal" | "amber" | "rose";
  group: ServiceGroup;
  outcomes: string[];
  prompts: string[];
  recommendedModes: SessionMode[];
  /**
   * Opt-in only. Our default is listening without advising; these are the
   * conversations where a member may explicitly ask for an opinion instead.
   */
  allowsFeedback?: boolean;
  /** Renders the boundary notice and offers anonymity. */
  sensitive?: boolean;
  /**
   * Topics where listening alone may not be enough. Renders an explicit
   * scope-limits panel and signposts specialist organisations before the person
   * ever books, and flags the request for a referral check on our side.
   */
  escalation?: boolean;
  /** Specialist services to signpost for this topic. */
  supportLines?: { region: string; line: string }[];
  /** Recurring 15-minute format rather than a one-off session. */
  standing?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Meeting requests                              */
/* -------------------------------------------------------------------------- */

/** Live meetings are request-based: the member asks, we confirm the time. */
export type RequestStatus = "new" | "reviewing" | "scheduled" | "declined";

export type TimeWindow = "early" | "morning" | "afternoon" | "evening" | "late";

export type Urgency = "flexible" | "this-week" | "asap";

/** Standing check-ins repeat; everything else is a one-off. */
export type Cadence = "weekly" | "fortnightly";

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
  /** Member explicitly asked for an opinion rather than pure listening. */
  feedbackMode?: boolean;
  /** Name is withheld from everyone but the listener taking the session. */
  anonymous?: boolean;
  /** Set for recurring 15-minute accountability check-ins. */
  cadence?: Cadence;
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
