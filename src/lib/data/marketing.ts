import { listeners } from "@/lib/data/listeners";
import { site } from "@/lib/data/site";
import type { Faq, Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "I'd pitched the same idea to eight friends and they all said it was great. Forty minutes with a listener and I finally heard the part I'd been skipping over.",
    name: "Dara Osei",
    role: "Founder, logistics startup",
    mode: "meet-video",
  },
  {
    id: "t-2",
    quote:
      "It's not therapy and it doesn't pretend to be. It's a real person, once a week, who has time for the whole thought.",
    name: "Marguerite Blanc",
    role: "Design director",
    mode: "voice",
  },
  {
    id: "t-3",
    quote:
      "I moved countries alone last year. Having a standing Thursday call with someone who actually remembered what I said last week changed how that year went.",
    name: "Nikolai Petrov",
    role: "Software engineer",
    mode: "meet-audio",
  },
  {
    id: "t-4",
    quote:
      "I asked for a meeting on a Sunday night expecting to hear back Monday afternoon. Had a confirmed time in my calendar within the hour.",
    name: "Aisha Rahman",
    role: "CEO, health tech",
    mode: "meet-video",
  },
  {
    id: "t-5",
    quote:
      "Chat was the only way I was ever going to start. I typed for ten minutes, someone answered like a person, and six weeks later I asked for my first video call.",
    name: "Tom Whitaker",
    role: "PhD candidate",
    mode: "text",
  },
  {
    id: "t-6",
    quote:
      "The absence of advice is the point. Nobody tells me what to do. I leave knowing what I think.",
    name: "Lena Fischer",
    role: "Independent consultant",
    mode: "voice",
  },
];

/*
 * Testing-phase FAQ. Questions about pricing, favourite listeners, feedback
 * mode, anonymous mode and standing check-ins are parked with the features they
 * describe — restore them here when those come back.
 */
export const faqs: Faq[] = [
  {
    question: "Is this therapy?",
    answer:
      "No. HearMeOut is not therapy, counseling, or mental health treatment, and we do not diagnose, treat, or give clinical advice. This is a human connection service: trained people who give you their full attention while you think out loud. If you are looking for clinical care, or you are in crisis, please contact a licensed provider or your local emergency services — we keep a list of resources on our safety page.",
    category: "basics",
  },
  {
    question: "Who exactly am I talking to?",
    answer:
      "Us. HearMeOut is a small in-house team of trained listeners — never AI, and never freelancers we've never met. We don't run a marketplace and we're not recruiting: the same few people answer every chat and every meeting.",
    category: "basics",
  },
  {
    question: "How does the chat work?",
    answer:
      "Open a chat from any page and start writing — no appointment needed. Whoever is on shift reads it and replies in the same thread, usually within a few minutes during our hours and by the next morning outside them. You can write three words or three paragraphs, leave and come back hours later, and pick the thread up exactly where you left it. Nobody will rush you toward a call.",
    category: "sessions",
  },
  {
    question: "How do I get a voice or video meeting?",
    answer:
      `You send us a short request rather than picking a slot from a calendar — your name, your email, and what you'd like to talk about. We're notified straight away, a real person reads it, and we email you to agree a time that suits you, usually within ${site.requestResponseTime}. We do it this way on purpose: you get matched thoughtfully rather than by whoever happens to have a gap.`,
    category: "sessions",
  },
  {
    question: "How do Google Meet sessions work?",
    answer:
      "Once we've agreed a time, we generate the Google Meet link and send a calendar invitation to you and your listener. You don't need a Google account to join — the link works in any modern browser, and your camera is always optional.",
    category: "sessions",
  },
  {
    question: "Are conversations confidential?",
    answer:
      "Yes. Chats are encrypted in transit and at rest, and only you and the listener replying can read them. We never sell data, never train models on your conversations, and never share anything with employers, insurers, or advertisers. Live sessions are not recorded. Notes are written only if you ask for them, and you can delete any note — or your whole account and history — at any time.",
    category: "privacy",
  },
];

/**
 * Derived from the real team rather than invented, so the marketing numbers can
 * never contradict the team behind them.
 */
const totalSessions = listeners.reduce((sum, l) => sum + l.sessions, 0);
const totalReviews = listeners.reduce((sum, l) => sum + l.reviews, 0);
const averageRating =
  listeners.reduce((sum, l) => sum + l.rating * l.reviews, 0) / totalReviews;

function roundDown(value: number, step: number) {
  return Math.floor(value / step) * step;
}

export const trustStats = [
  {
    value: `${roundDown(totalSessions, 100).toLocaleString()}+`,
    label: "Conversations held",
  },
  { value: `${listeners.length}`, label: "Listeners, all in-house" },
  { value: `${averageRating.toFixed(1)}/5`, label: "Average session rating" },
  { value: site.requestResponseTime, label: "Typical reply to a request" },
];

export const trustPoints = [
  "Real people, never AI",
  "Chat replies in minutes",
  "End-to-end encrypted",
  "Nothing recorded",
];
