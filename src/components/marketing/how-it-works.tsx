import {
  CalendarDays,
  MessagesSquare,
  Sparkles,
  UserSearch,
  Waves,
} from "lucide-react";

import { Reveal, Stagger, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { sessionModes } from "@/lib/data/site";

const steps = [
  {
    icon: MessagesSquare,
    title: "Open a chat, or send a request",
    body: "Chat needs nothing but an opening sentence. For a voice or Google Meet session, send us a short request — your name, your email, and what you'd like to talk about.",
    aside: "Chat starts instantly",
  },
  {
    icon: UserSearch,
    title: "A person reads it",
    body: "Not a queue and not an algorithm. Someone on our in-house team picks up your chat, or reads your request and finds the right listener for it.",
    aside: "A person, every time",
  },
  {
    icon: CalendarDays,
    title: "We confirm the time",
    body: "For meetings we email you to agree a time that suits you, then send the calendar invitation and Google Meet link.",
    aside: "Usually within 4 hours",
  },
  {
    icon: Waves,
    title: "Connect and talk",
    body: "Join from your dashboard in one click. No agenda required — your listener follows you rather than steering.",
    aside: "45 minutes, uninterrupted",
  },
  {
    icon: Sparkles,
    title: "Leave with more clarity",
    body: "Session notes, saved ideas and the thread of everything you've talked about are waiting for you afterwards.",
    aside: "Yours to keep or delete",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-brand-violet/6 absolute top-1/4 -left-40 size-96 rounded-full blur-3xl"
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="How it works"
          title="Five steps, and none of them are hard"
          description="From your first sentence to walking away with the thing you couldn't quite name — here's the whole path."
        />

        <div className="relative mt-16">
          {/* Spine that the step markers sit on */}
          <div
            aria-hidden
            className="via-border absolute top-0 bottom-0 left-[27px] w-px bg-linear-to-b from-transparent to-transparent lg:hidden"
          />

          <Stagger stagger={0.09} className="grid gap-4 lg:grid-cols-5 lg:gap-5">
            {steps.map((step, index) => (
              <RevealItem key={step.title} className="relative lg:flex">
                <div className="border-border/70 bg-card/70 hover:border-primary/30 relative flex w-full gap-5 rounded-3xl border p-6 backdrop-blur-sm transition-colors lg:flex-col lg:gap-4">
                  <div className="relative shrink-0">
                    <span className="bg-primary/8 text-primary ring-primary/12 grid size-12 place-items-center rounded-2xl ring-1 ring-inset">
                      <step.icon className="size-5.5" />
                    </span>
                    <span className="bg-foreground text-background absolute -top-2 -right-2 grid size-6 place-items-center rounded-full text-[0.6875rem] font-semibold">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-[0.975rem] font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.body}
                    </p>
                    <p className="text-primary mt-4 text-xs font-medium">{step.aside}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-10">
          <div className="border-border/70 bg-muted/35 flex flex-col items-center gap-4 rounded-3xl border p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-muted-foreground text-sm">
              Step one, in practice — one of these starts now, three are by request:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {sessionModes.map((mode) => (
                <span
                  key={mode.id}
                  className="border-border/70 bg-card inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                >
                  <mode.icon className="text-primary size-3.5" />
                  {mode.short}
                  <span className="text-muted-foreground font-normal">
                    {mode.booking === "instant" ? "now" : "by request"}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
