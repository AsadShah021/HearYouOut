import {
  Anchor,
  Briefcase,
  Compass,
  DoorOpen,
  Ear,
  Lightbulb,
  PenLine,
  Repeat,
  Rocket,
  Scale,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Sunrise,
  UsersRound,
} from "lucide-react";

import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "idea-validation",
    title: "Idea Validation",
    summary: "Say the idea out loud before you bet a year on it.",
    description:
      "Bring the thing you've been turning over at 2am. Your listener asks the questions a first customer would ask, without the pressure of a pitch meeting or the politeness of a friend.",
    icon: Lightbulb,
    tone: "amber",
    group: "work",
    outcomes: [
      "A sharper one-sentence version of your idea",
      "The three assumptions worth testing first",
      "An honest read on where you sound unsure",
    ],
    prompts: [
      "I think there's a business here, but I can't explain it in one line yet.",
      "Everyone I know says it's great. That worries me.",
    ],
    recommendedModes: ["meet-video", "voice"],
  },
  {
    slug: "business-brainstorming",
    title: "Business Brainstorming",
    summary: "A thinking partner who has no stake in the outcome.",
    description:
      "Pricing, positioning, the hire you keep postponing. Talk it through with someone who is genuinely curious and has nothing to gain from the answer you land on.",
    icon: Briefcase,
    tone: "violet",
    group: "work",
    outcomes: [
      "Options you hadn't considered on the whiteboard",
      "The trade-off you were avoiding, named",
      "A next step small enough to actually do",
    ],
    prompts: [
      "I've got three directions and I keep switching between them.",
      "I need to raise prices and I've been putting it off for months.",
    ],
    recommendedModes: ["meet-video", "meet-audio"],
  },
  {
    slug: "creative-thinking",
    title: "Creative Thinking",
    summary: "Unblock the work by talking around it.",
    description:
      "Writers, designers, musicians and makers use these sessions to escape the loop. No critique, no notes — just a listener helping you hear what you actually want to make.",
    icon: Sparkles,
    tone: "rose",
    group: "work",
    outcomes: [
      "The thread worth pulling on",
      "Permission to abandon what isn't working",
      "Momentum back in the project",
    ],
    prompts: [
      "I've rewritten the opening eleven times.",
      "I don't know if I've lost the idea or lost interest.",
    ],
    recommendedModes: ["voice", "text"],
  },
  {
    slug: "career-discussions",
    title: "Career Discussions",
    summary: "Think about the offer without anyone's agenda in the room.",
    description:
      "Offers, promotions, the resignation you keep drafting. Your listener isn't your manager, your partner, or your recruiter — which is exactly why it's easier to be honest.",
    icon: Compass,
    tone: "teal",
    group: "work",
    outcomes: [
      "What you're actually optimising for",
      "The question to ask before you accept",
      "A clearer sense of your own timeline",
    ],
    prompts: [
      "The money is better but something feels off.",
      "I've been ready to leave for a year and haven't moved.",
    ],
    recommendedModes: ["meet-video", "voice"],
  },
  {
    slug: "life-conversations",
    title: "Life Conversations",
    summary: "For the things that don't fit anywhere else.",
    description:
      "A move, a relationship, a season that's harder than you expected. Not treatment and not advice — a warm, attentive person for the conversation you haven't had yet.",
    icon: Sunrise,
    tone: "amber",
    group: "work",
    outcomes: [
      "Room to say it without managing anyone's reaction",
      "Feeling genuinely heard",
      "A little more steadiness than you started with",
    ],
    prompts: [
      "I just need to say this out loud to somebody.",
      "Everyone in my life is too close to this one.",
    ],
    recommendedModes: ["voice", "text"],
  },
  {
    slug: "confidence-building",
    title: "Confidence Building",
    summary: "Rehearse the hard conversation before the real one.",
    description:
      "Practise the pitch, the salary ask, the difficult message. Your listener gives you an audience, honest reflections on how you're landing, and as many takes as you need.",
    icon: Rocket,
    tone: "violet",
    group: "work",
    outcomes: [
      "The version of it that sounds like you",
      "Noticeably steadier delivery",
      "Less dread walking into the room",
    ],
    prompts: [
      "I have to present to the board on Thursday.",
      "I always shrink when I have to talk about money.",
    ],
    recommendedModes: ["meet-video", "voice"],
  },
  {
    slug: "decision-making-support",
    title: "Decision Making Support",
    summary: "Get the decision out of your head and into the open.",
    description:
      "When every option has been rehearsed internally until it blurs, saying it to another person restores the shape of it. Your listener holds the thread while you weigh it.",
    icon: Scale,
    tone: "teal",
    group: "work",
    outcomes: [
      "The real criteria, written down",
      "Which unknowns actually change the answer",
      "A decision, or a date to make one",
    ],
    prompts: [
      "I've made a pros and cons list four times.",
      "I think I know what I want and I want to check that.",
    ],
    recommendedModes: ["meet-audio", "voice"],
  },
  {
    slug: "general-listening",
    title: "General Listening Sessions",
    summary: "No agenda required. Start anywhere.",
    description:
      "Some sessions don't have a topic. You start talking and see where it goes. Your listener follows you rather than steering — that's the whole service.",
    icon: Ear,
    tone: "rose",
    group: "work",
    outcomes: [
      "Somewhere to put what you're carrying",
      "Thoughts in an order that makes sense",
      "The relief of not performing for anyone",
    ],
    prompts: [
      "I don't really know what I want to talk about yet.",
      "Can I just think out loud for forty minutes?",
    ],
    recommendedModes: ["voice", "meet-audio", "text"],
  },

  /* ------------------------------------------------------------------------ */
  /*            Added from testing feedback — work conversations              */
  /* ------------------------------------------------------------------------ */

  {
    slug: "creative-writing-feedback",
    title: "Creative Writing Feedback",
    summary: "Read it out loud to someone who's actually listening.",
    description:
      "Bring the draft, the chapter, the script, the song you can't finish — and read it aloud. Hearing your own words in your own voice, to a person rather than a wall, changes what you notice about them. By default your listener reflects back what landed and what they lost the thread of. Ask for feedback mode and they'll also tell you what they honestly think.",
    icon: PenLine,
    tone: "violet",
    group: "work",
    allowsFeedback: true,
    outcomes: [
      "The parts that landed, in someone else's words",
      "Where a real listener got lost or stopped caring",
      "Whatever you noticed yourself while reading it aloud",
    ],
    prompts: [
      "I've rewritten this opening eleven times and I've lost all perspective.",
      "Everyone who loves me says it's good. I need someone with no stake in it.",
    ],
    recommendedModes: ["voice", "meet-video"],
  },
  {
    slug: "exit-strategy-planning",
    title: "Exit Strategy Planning",
    summary: "Leaving a job, a business, or a relationship — out loud, first.",
    description:
      "Most people decide to leave something long before they can say it plainly. This is the conversation where you say it plainly. We won't tell you whether to go; we'll stay with the question until the shape of your own answer is clear, and until you can describe what leaving would actually involve.",
    icon: DoorOpen,
    tone: "teal",
    group: "work",
    allowsFeedback: true,
    sensitive: true,
    outcomes: [
      "The real reason, said out loud at least once",
      "What leaving would actually cost, named rather than feared",
      "A first step small enough that you'd genuinely take it",
    ],
    prompts: [
      "I've been drafting the same resignation email for four months.",
      "I don't know if I want to fix this or leave it.",
    ],
    recommendedModes: ["voice", "meet-audio"],
  },
  {
    slug: "accountability-check-ins",
    title: "Accountability Check-ins",
    summary: "Fifteen minutes, every week, with someone who remembers.",
    description:
      "A standing short call with the same listener. You say what you meant to do, what actually happened, and what's next. No lecture when you miss a week — the value isn't pressure, it's that someone is expecting you and remembers what you said last time.",
    icon: Repeat,
    tone: "amber",
    group: "work",
    standing: true,
    outcomes: [
      "A rhythm that survives the weeks you don't feel like it",
      "A record of what you actually said you'd do",
      "One person who notices when you go quiet",
    ],
    prompts: [
      "I'm great at starting things alone and terrible at continuing them.",
      "I just need someone to be expecting me on Monday mornings.",
    ],
    recommendedModes: ["voice", "text"],
  },

  /* ------------------------------------------------------------------------ */
  /*            Added from testing feedback — life conversations              */
  /* ------------------------------------------------------------------------ */

  {
    slug: "loneliness-in-a-crowd",
    title: "Loneliness in a Crowd",
    summary: "Surrounded by people and still not known by any of them.",
    description:
      "You have family, friends, colleagues, a full calendar — and something still doesn't reach you. This is a particularly hard thing to say to the very people you're surrounded by, because it sounds like an accusation. It isn't one, and you can say it here without it costing you a relationship.",
    icon: UsersRound,
    tone: "rose",
    group: "life",
    sensitive: true,
    outcomes: [
      "To say the thing that sounds ungrateful out loud",
      "The difference between being around people and being known",
      "One honest hour that isn't a performance",
    ],
    prompts: [
      "I was at a table of eight people last night and I've never felt further away.",
      "Everyone would say I have a lot of friends. I'm not sure any of them know me.",
    ],
    recommendedModes: ["voice", "meet-audio", "text"],
  },
  {
    slug: "comparison-anxiety",
    title: "Comparison Anxiety",
    summary: "Everyone else's highlight reel against your whole life.",
    description:
      "The feeling that everyone is further along, and that you're the only one still figuring it out. We won't tell you to delete the apps or that comparison is the thief of joy. We'll ask who exactly you're measuring yourself against, and what you'd have to believe about yourself for that measurement to matter.",
    icon: Smartphone,
    tone: "violet",
    group: "life",
    sensitive: true,
    outcomes: [
      "Names for who you're actually comparing yourself to",
      "The standard you're using, said out loud where you can look at it",
      "Some distance between their timeline and yours",
    ],
    prompts: [
      "I closed the app and felt worse about my life than before I opened it.",
      "Everyone I started out with seems to be years ahead of me now.",
    ],
    recommendedModes: ["text", "voice"],
  },
  {
    slug: "regret-and-guilt",
    title: "Regret & Guilt",
    summary: "The thing you've never told anyone.",
    description:
      "An old mistake — in a relationship, at work, with family — that you've carried without ever putting into words. You can have this conversation anonymously if that's what makes it possible. Your listener isn't here to absolve you or to judge you; they're here so that it stops being something you carry entirely alone.",
    icon: Anchor,
    tone: "teal",
    group: "life",
    sensitive: true,
    outcomes: [
      "To say it out loud once, to a person, in full",
      "The version of the story you've never told",
      "Something that's slightly less heavy for having been shared",
    ],
    prompts: [
      "There's something I did years ago that I've never told a single person.",
      "I don't want advice about it. I just want to stop being the only one who knows.",
    ],
    recommendedModes: ["text", "voice"],
  },
  {
    slug: "harassment",
    title: "Harassment",
    summary: "Somewhere to say what happened, at your own pace.",
    description:
      "Being harassed — at work, online, or by someone you know — is isolating in a specific way: you spend enormous energy deciding whether it even counts, and whether saying it out loud will make things worse. You can bring it here without deciding any of that first. Your listener will not press you for details, will not tell you what you should have done, and will not push you toward reporting it or away from it.",
    icon: ShieldAlert,
    tone: "amber",
    group: "life",
    sensitive: true,
    escalation: true,
    outcomes: [
      "To describe it once, in your own order, without being cross-examined",
      "To be believed without having to prove anything",
      "A clear picture of who can actually help with the parts we can't",
    ],
    prompts: [
      "I don't know if what's happening counts as harassment or if I'm overreacting.",
      "I've told HR and nothing happened. I mostly need to say it to someone who'll just listen.",
    ],
    // TODO before launch: verify every number below against the organisation's
    // own site, and add the regions where most of your members actually are.
    supportLines: [
      { region: "United States", line: "RAINN — 800 656 4673, free and 24/7" },
      { region: "United Kingdom", line: "Rape Crisis — 0808 500 2222" },
      { region: "Australia", line: "1800RESPECT — 1800 737 732" },
      { region: "Elsewhere", line: "findahelpline.com covers 130+ countries" },
    ],
    recommendedModes: ["text", "voice"],
  },
];

/** Ideas, work and decisions. */
export const workServices = services.filter((s) => s.group === "work");

/** The heavier personal conversations — these carry the boundary notice. */
export const lifeServices = services.filter((s) => s.group === "life");

export const serviceMap = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<
  string,
  Service
>;

/** Requests store the service *title*, so the queue can look the record back up. */
export const serviceByTitle = Object.fromEntries(
  services.map((service) => [service.title, service]),
) as Record<string, Service | undefined>;
