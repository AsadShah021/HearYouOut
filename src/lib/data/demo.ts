import type {
  Appointment,
  AvailabilityDay,
  ChatConversation,
  ClientNote,
  Conversation,
  EarningsPoint,
  Idea,
  MeetingRequest,
  Message,
  NoteEntry,
  Session,
  UsageSummary,
} from "@/types";

/**
 * Demo fixtures for the dashboards. Everything is anchored to the current day so
 * the product always looks alive; dates are rendered in server components so the
 * formatted output never drifts between server and client.
 */
function at(dayOffset: number, time: `${number}:${number}`) {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

/** `YYYY-MM-DD`, the shape the request form stores preferred dates in. */
function day(dayOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;
}

/* ------------------------------- Member side ------------------------------ */

export const upcomingSessions: Session[] = [
  {
    id: "s-901",
    listenerId: "l-amara",
    mode: "meet-video",
    startsAt: at(0, "16:30"),
    durationMinutes: 45,
    status: "upcoming",
    topic: "Pricing model for the second product line",
    meetUrl: "https://meet.google.com/hmo-demo-vid",
  },
  {
    id: "s-902",
    listenerId: "l-daniel",
    mode: "voice",
    startsAt: at(1, "19:00"),
    durationMinutes: 45,
    status: "upcoming",
    topic: "Thinking out loud — no agenda",
  },
  {
    id: "s-903",
    listenerId: "l-mei",
    mode: "meet-audio",
    startsAt: at(4, "09:00"),
    durationMinutes: 45,
    status: "upcoming",
    topic: "The offer from Northwind — deciding by Friday",
    meetUrl: "https://meet.google.com/hmo-demo-aud",
  },
];

export const pastSessions: Session[] = [
  {
    id: "s-880",
    listenerId: "l-amara",
    mode: "meet-video",
    startsAt: at(-3, "16:30"),
    durationMinutes: 45,
    status: "completed",
    topic: "Positioning: are we a tool or a service?",
    rating: 5,
    notes: "Landed on 'service with a product attached'. Test the line with 5 customers.",
  },
  {
    id: "s-874",
    listenerId: "l-sofia",
    mode: "voice",
    startsAt: at(-6, "11:15"),
    durationMinutes: 45,
    status: "completed",
    topic: "Untangling the roadmap",
    rating: 5,
    notes: "Two roadmaps, not one: the one we ship and the one we tell investors.",
  },
  {
    id: "s-869",
    listenerId: "l-daniel",
    mode: "voice",
    startsAt: at(-10, "20:00"),
    durationMinutes: 30,
    status: "completed",
    topic: "Hard week, no agenda",
    rating: 5,
  },
  {
    id: "s-861",
    listenerId: "l-mei",
    mode: "meet-audio",
    startsAt: at(-14, "09:00"),
    durationMinutes: 45,
    status: "completed",
    topic: "Whether to hire a second engineer now",
    rating: 4,
    notes: "Decision deferred 30 days. Revisit once June churn number lands.",
  },
];

export const conversations: Conversation[] = [
  {
    id: "c-1",
    listenerId: "l-amara",
    lastMessage:
      "That framing you used at the end — 'a service with a product attached' — I'd start there tomorrow.",
    lastMessageAt: at(0, "09:12"),
    unread: 2,
    pinned: true,
  },
  {
    id: "c-2",
    listenerId: "l-daniel",
    lastMessage: "No rush on replying. I'm around whenever you want to pick it back up.",
    lastMessageAt: at(-1, "21:40"),
    unread: 0,
  },
  {
    id: "c-3",
    listenerId: "l-yuki",
    lastMessage: "Thank you for sharing that. Take your time — I'll be here.",
    lastMessageAt: at(-2, "08:05"),
    unread: 0,
  },
  {
    id: "c-4",
    listenerId: "l-sofia",
    lastMessage: "Notes from Tuesday are in your dashboard whenever you want them.",
    lastMessageAt: at(-5, "13:22"),
    unread: 0,
  },
];

export const messageThread: Message[] = [
  {
    id: "m-1",
    author: "listener",
    body: "Morning. How did the customer calls go yesterday?",
    sentAt: at(0, "08:40"),
  },
  {
    id: "m-2",
    author: "me",
    body: "Three of five said they'd pay. The other two got confused about what we actually do, which is the part that's bugging me.",
    sentAt: at(0, "08:52"),
  },
  {
    id: "m-3",
    author: "listener",
    body: "What did you say to the two who got confused? Word for word, if you remember.",
    sentAt: at(0, "08:55"),
  },
  {
    id: "m-4",
    author: "me",
    body: "Something like 'a platform for operations teams to coordinate'. Which now that I type it out means nothing.",
    sentAt: at(0, "09:03"),
  },
  {
    id: "m-5",
    author: "listener",
    body: "That framing you used at the end of our call — 'a service with a product attached' — I'd start there tomorrow.",
    sentAt: at(0, "09:12"),
  },
];

export const notes: NoteEntry[] = [
  {
    id: "n-1",
    sessionId: "s-880",
    title: "Positioning session — what actually landed",
    excerpt:
      "You described the business three ways in forty minutes. The third one, the one you almost apologised for, is the one you said fastest and with the most conviction.",
    createdAt: at(-3, "17:20"),
    tags: ["positioning", "clarity"],
    author: "listener",
  },
  {
    id: "n-2",
    sessionId: "s-874",
    title: "Two roadmaps, not one",
    excerpt:
      "The tension isn't between features — it's between the roadmap you ship and the roadmap you narrate. Naming them separately dissolved most of the argument.",
    createdAt: at(-6, "12:10"),
    tags: ["roadmap", "decision"],
    author: "listener",
  },
  {
    id: "n-3",
    title: "Things I want to say out loud on Thursday",
    excerpt:
      "The hiring plan is a proxy for whether I trust the revenue forecast. Talk about the forecast, not the hire.",
    createdAt: at(-2, "22:05"),
    tags: ["prep", "hiring"],
    author: "me",
  },
  {
    id: "n-4",
    sessionId: "s-861",
    title: "Hiring decision — deferred, deliberately",
    excerpt:
      "Not a no. A 30-day hold with one condition attached: June churn under 4%. Writing the condition down was the whole value of the session.",
    createdAt: at(-14, "10:05"),
    tags: ["hiring", "decision"],
    author: "listener",
  },
];

export const ideas: Idea[] = [
  {
    id: "i-1",
    title: "Onboarding concierge for mid-market accounts",
    summary:
      "White-glove first 30 days sold as a fixed-fee add-on. Talked through with Amara — the pricing objection disappears if it's framed as insurance, not service.",
    stage: "validating",
    createdAt: at(-3, "17:40"),
    tags: ["revenue", "services"],
    confidence: 72,
  },
  {
    id: "i-2",
    title: "Weekly operator letter",
    summary:
      "Write the thing I keep saying in sales calls. Low cost, compounding, and it forces the positioning to get clear.",
    stage: "shaping",
    createdAt: at(-8, "20:15"),
    tags: ["marketing", "writing"],
    confidence: 58,
  },
  {
    id: "i-3",
    title: "Open-source the scheduling engine",
    summary:
      "Half-formed. Might be a distribution play, might be a distraction. Parked until after the pricing work.",
    stage: "spark",
    createdAt: at(-12, "23:30"),
    tags: ["distribution"],
    confidence: 31,
  },
  {
    id: "i-4",
    title: "Move to annual-only pricing for enterprise",
    summary:
      "Decided. Rolling out with the Q4 pricing page refresh. Two sessions to get here and it took eleven minutes in the last one.",
    stage: "committed",
    createdAt: at(-20, "10:00"),
    tags: ["pricing"],
    confidence: 91,
  },
];

export const usage: UsageSummary = {
  planId: "professional",
  cycleRenewsAt: at(18, "00:00"),
  sessionsIncluded: 6,
  sessionsUsed: 4,
  messagesUsed: 213,
  minutesTalked: 187,
};

/* ------------------------------ Listener side ----------------------------- */

export const appointments: Appointment[] = [
  {
    id: "a-1",
    clientName: "Jordan M.",
    mode: "meet-video",
    startsAt: at(0, "16:30"),
    durationMinutes: 45,
    topic: "Pricing model for the second product line",
    meetUrl: "https://meet.google.com/hmo-demo-vid",
  },
  {
    id: "a-2",
    clientName: "Priyanka S.",
    mode: "voice",
    startsAt: at(0, "18:15"),
    durationMinutes: 30,
    topic: "Prep for a difficult conversation with a co-founder",
  },
  {
    id: "a-3",
    clientName: "Aaron D.",
    mode: "meet-audio",
    startsAt: at(1, "10:00"),
    durationMinutes: 45,
    topic: "First session — general listening",
    isNewClient: true,
    meetUrl: "https://meet.google.com/hmo-demo-aud",
  },
  {
    id: "a-4",
    clientName: "Lucia F.",
    mode: "meet-video",
    startsAt: at(2, "14:30"),
    durationMinutes: 60,
    topic: "Career pivot — the six-month question",
    meetUrl: "https://meet.google.com/hmo-demo-vid2",
  },
];

export const clientNotes: ClientNote[] = [
  {
    id: "cn-1",
    clientName: "Jordan M.",
    updatedAt: at(-3, "17:20"),
    summary:
      "Building in logistics ops. Thinks fastest when interrupted least. Currently circling a positioning question — resist the urge to resolve it for him.",
    sessionCount: 11,
    tags: ["founder", "positioning", "long-pauses"],
  },
  {
    id: "cn-2",
    clientName: "Priyanka S.",
    updatedAt: at(-4, "19:00"),
    summary:
      "Co-founder friction, unresolved since March. Prefers voice over video. Asked me not to summarise unless she requests it.",
    sessionCount: 6,
    tags: ["voice-only", "no-notes", "co-founder"],
  },
  {
    id: "cn-3",
    clientName: "Lucia F.",
    updatedAt: at(-7, "15:45"),
    summary:
      "Considering leaving medicine for health policy. Deliberate thinker, arrives with written questions. Wants to decide by end of quarter.",
    sessionCount: 9,
    tags: ["career", "decision", "prepared"],
  },
  {
    id: "cn-4",
    clientName: "Aaron D.",
    updatedAt: at(-1, "12:00"),
    summary: "New. Intake note only: 'not sure what I want to talk about yet, that's fine right?'",
    sessionCount: 0,
    tags: ["new", "general-listening"],
  },
];

export const earningsSeries: EarningsPoint[] = [
  { label: "Feb", amount: 2180 },
  { label: "Mar", amount: 2640 },
  { label: "Apr", amount: 2410 },
  { label: "May", amount: 3120 },
  { label: "Jun", amount: 3480 },
  { label: "Jul", amount: 3910 },
];

export const availability: AvailabilityDay[] = [
  { day: "Monday", enabled: true, slots: [{ from: "09:00", to: "12:30" }, { from: "16:00", to: "19:00" }] },
  { day: "Tuesday", enabled: true, slots: [{ from: "09:00", to: "12:30" }] },
  { day: "Wednesday", enabled: true, slots: [{ from: "14:00", to: "20:00" }] },
  { day: "Thursday", enabled: true, slots: [{ from: "09:00", to: "12:30" }, { from: "16:00", to: "19:00" }] },
  { day: "Friday", enabled: true, slots: [{ from: "09:00", to: "13:00" }] },
  { day: "Saturday", enabled: false, slots: [] },
  { day: "Sunday", enabled: false, slots: [] },
];

/** Incoming meeting requests waiting on us to confirm a time. */
export const meetingRequests: MeetingRequest[] = [
  {
    id: "mr-1",
    reference: "HMO-8241",
    name: "Ravi Anand",
    email: "ravi.anand@example.com",
    timezone: "IST (UTC+5:30)",
    mode: "meet-video",
    topic: "Idea Validation",
    context:
      "I've been building a marketplace for lab equipment for eight months and I still can't tell if the pull is real or if I'm just enjoying building it. I'd like someone to poke at it who isn't invested.",
    preferredDates: [day(1), day(2), day(4)],
    preferredWindows: ["evening", "late"],
    urgency: "this-week",
    preferredListenerId: "l-amara",
    submittedAt: at(0, "07:42"),
    status: "new",
  },
  {
    id: "mr-2",
    reference: "HMO-8240",
    name: "Claire Devereux",
    email: "c.devereux@example.com",
    phone: "+33 6 12 34 56 78",
    timezone: "CEST (UTC+2)",
    mode: "voice",
    topic: "Career Discussions",
    context:
      "Offer on the table, deadline Friday. I don't want advice, I want to hear myself talk it through with someone neutral.",
    preferredDates: [day(1), day(2)],
    preferredWindows: ["morning"],
    urgency: "asap",
    submittedAt: at(0, "06:15"),
    status: "new",
  },
  {
    id: "mr-3",
    reference: "HMO-8237",
    name: "Beatrice Osei",
    email: "b.osei@example.com",
    timezone: "GMT (UTC+0)",
    mode: "meet-audio",
    topic: "General Listening Sessions",
    context: "Nothing specific. It's been a heavy month and I'd like to talk.",
    preferredDates: [day(3), day(5)],
    preferredWindows: ["afternoon", "evening"],
    urgency: "flexible",
    submittedAt: at(-1, "21:08"),
    status: "reviewing",
    isReturning: true,
  },
  {
    id: "mr-4",
    reference: "HMO-8233",
    name: "Marco Bianchi",
    email: "marco.b@example.com",
    timezone: "CEST (UTC+2)",
    mode: "meet-video",
    topic: "Confidence Building",
    context: "Board presentation in two weeks. I'd like to run it twice with someone.",
    preferredDates: [day(6), day(7)],
    preferredWindows: ["morning", "afternoon"],
    urgency: "flexible",
    preferredListenerId: "l-marcus",
    submittedAt: at(-2, "14:30"),
    status: "scheduled",
    scheduledFor: at(6, "10:00"),
  },
];

/** The team-side chat inbox — visitors and members land in the same queue. */
export const teamChats: ChatConversation[] = [
  {
    id: "tc-1",
    personName: "Sena Adeyemi",
    personEmail: "sena.a@example.com",
    source: "visitor",
    status: "waiting",
    lastMessage:
      "Hi — I'm not really sure how this works. Can I just talk about something that's bothering me, or does it have to be a business thing?",
    lastMessageAt: at(0, "09:41"),
    unread: 1,
    waitingFor: "2 min",
    topic: "First message",
  },
  {
    id: "tc-2",
    personName: "Jordan Mercer",
    personEmail: "jordan@example.com",
    source: "member",
    status: "active",
    lastMessage:
      "Something like 'a platform for operations teams to coordinate'. Which now that I type it out means nothing.",
    lastMessageAt: at(0, "09:03"),
    unread: 2,
    assignedTo: "l-amara",
    topic: "Positioning",
  },
  {
    id: "tc-3",
    personName: "Hana Kowalski",
    source: "visitor",
    status: "waiting",
    lastMessage: "is there an actual person reading this or is it a bot",
    lastMessageAt: at(0, "08:58"),
    unread: 1,
    waitingFor: "45 sec",
    topic: "First message",
  },
  {
    id: "tc-4",
    personName: "Priyanka Shah",
    personEmail: "p.shah@example.com",
    source: "member",
    status: "active",
    lastMessage: "That's helpful. I'll sit with it and message you tomorrow.",
    lastMessageAt: at(-1, "19:22"),
    unread: 0,
    assignedTo: "l-daniel",
    topic: "Co-founder conversation",
  },
  {
    id: "tc-5",
    personName: "Aaron Delgado",
    personEmail: "aaron.d@example.com",
    source: "member",
    status: "closed",
    lastMessage: "Thank you. Genuinely.",
    lastMessageAt: at(-2, "11:04"),
    unread: 0,
    assignedTo: "l-yuki",
    topic: "General listening",
  },
];

/** A visitor's first exchange, used to demo the public chat surface. */
export const visitorChatSeed: Message[] = [
  {
    id: "vc-1",
    author: "listener",
    body: "Hi, I'm Daniel — I'm one of the listeners here, and I'm reading this as you type. What's on your mind?",
    sentAt: at(0, "09:38"),
  },
];

export const listenerReviewFeed = [
  {
    id: "lr-1",
    author: "Jordan M.",
    rating: 5,
    date: at(-3, "18:00"),
    body: "Didn't try to solve it. Asked one question at minute thirty that reframed the whole thing.",
  },
  {
    id: "lr-2",
    author: "Lucia F.",
    rating: 5,
    date: at(-7, "16:20"),
    body: "I arrive with a list every time and she never makes me feel silly for it.",
  },
  {
    id: "lr-3",
    author: "Priyanka S.",
    rating: 4,
    date: at(-11, "19:30"),
    body: "Good session. Would have liked five more minutes at the end.",
  },
];
