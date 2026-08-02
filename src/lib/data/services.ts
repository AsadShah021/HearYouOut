import {
  Briefcase,
  Compass,
  Ear,
  Lightbulb,
  Rocket,
  Scale,
  Sparkles,
  Sunrise,
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
];

export const serviceMap = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<
  string,
  Service
>;
