import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Ear,
  GraduationCap,
  HeartHandshake,
  LifeBuoy,
  Lock,
  Scale,
  Users,
} from "lucide-react";

import { CtaSection } from "@/components/marketing/cta-section";
import { NotTherapy } from "@/components/marketing/not-therapy";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal, Stagger, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { trustStats } from "@/lib/data/marketing";
import { disclaimer } from "@/lib/data/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "Why HearMeOut exists, how listeners are selected and trained, the standards they're held to, and what we do and don't do.",
  path: "/about",
});

const principles = [
  {
    icon: Ear,
    title: "Listening is the product",
    body: "Not advice, not frameworks, not a plan. If you leave a session with someone else's answer, we did it wrong.",
  },
  {
    icon: Scale,
    title: "Honest about what we're not",
    body: "We say 'this isn't therapy' on the homepage, in the footer, and during onboarding. Being clear costs us signups. We'd rather pay that.",
  },
  {
    icon: Lock,
    title: "Privacy without caveats",
    body: "No recording, no data sales, no model training on your conversations. The business model is subscriptions, and that's the whole business model.",
  },
  {
    icon: HeartHandshake,
    title: "A small team, on purpose",
    body: "We don't recruit, and we don't scale by adding strangers. Staying small is what lets us cap everyone's daily sessions and still remember what you said last month.",
  },
];

const standards = [
  {
    icon: Users,
    step: "A small, named team",
    body: "We are not a marketplace and we don't take on freelance listeners. Everyone here is part of the in-house team, introduced by name on our team page, and accountable for their own work.",
  },
  {
    icon: GraduationCap,
    step: "Trained, then kept training",
    body: "Every listener completed 30 hours of training in active listening, boundaries, confidentiality and cultural humility before their first session — and continues with monthly peer review.",
  },
  {
    icon: Ear,
    step: "Listening, not fixing",
    body: "The discipline we practise hardest is restraint: staying with your thought instead of reaching for a solution, and being comfortable with a long silence.",
  },
  {
    icon: BadgeCheck,
    step: "Knowing where the line is",
    body: "We are trained to recognise when someone needs professional support and to say so kindly and directly. Making that referral is a good session, not a failed one.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About HearMeOut"
        title="We built the thing we kept"
        highlight="wishing existed"
        description="Not a therapist. Not a coach. Not a chatbot. Just a trained, attentive human with forty-five minutes and no agenda of their own."
      />

      <Section className="pt-4">
        <div className="container-page">
          <Reveal>
            <div className="border-border/70 bg-card relative mx-auto max-w-3xl overflow-hidden rounded-3xl border p-8 sm:p-12">
              <div
                aria-hidden
                className="bg-brand-violet/8 absolute -top-24 -right-20 size-72 rounded-full blur-3xl"
              />
              <div className="relative flex flex-col gap-5 text-[1.0625rem] leading-relaxed">
                <p>
                  HearMeOut started with an observation that turned out to be
                  almost universal: people carry ideas and decisions around for
                  months without ever saying them out loud to someone who
                  isn&rsquo;t invested in the outcome.
                </p>
                <p className="text-muted-foreground">
                  Friends are too close. Colleagues have a stake. Partners get
                  the exhausted version at 11pm. Therapists are for something
                  else entirely — and treating an unformed business idea as a
                  clinical matter helps nobody.
                </p>
                <p className="text-muted-foreground">
                  What was missing was ordinary: a competent, warm, trained
                  person whose entire job for the next forty-five minutes is to
                  pay attention to you. That&rsquo;s what we built, and
                  it&rsquo;s deliberately all we built.
                </p>
                <p className="text-foreground font-medium">
                  Every conversation on HearMeOut is with a real human being. We
                  have no plans to change that.
                </p>
              </div>
            </div>
          </Reveal>

          <Stagger className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-4 lg:grid-cols-4">
            {trustStats.map((stat) => (
              <RevealItem key={stat.label}>
                <div className="border-border/70 bg-card/60 flex flex-col items-center gap-1 rounded-2xl border p-5 text-center">
                  <span className="text-xl font-semibold tracking-[-0.03em]">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-xs">{stat.label}</span>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section className="bg-muted/25">
        <div className="container-page">
          <SectionHeading
            eyebrow="What we believe"
            title="Four principles we don't trade away"
            description="These have cost us revenue at least once each. They're still here."
          />

          <Stagger className="mt-14 grid gap-4 sm:grid-cols-2">
            {principles.map((principle) => (
              <RevealItem key={principle.title}>
                <div className="border-border/70 bg-card flex h-full gap-5 rounded-3xl border p-7">
                  <span className="bg-primary/8 text-primary ring-primary/12 grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ring-inset">
                    <principle.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{principle.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {principle.body}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <Section id="standards" className="scroll-mt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we listen"
            title="What you can expect from us"
            description="We're a small in-house team rather than a directory of strangers — here's the standard we hold ourselves to."
          />

          <Stagger className="mt-14 grid gap-4 lg:grid-cols-4">
            {standards.map((standard, index) => (
              <RevealItem key={standard.step}>
                <div className="border-border/70 bg-card relative flex h-full flex-col gap-4 rounded-3xl border p-6">
                  <span className="text-muted-foreground/40 absolute top-5 right-6 text-3xl font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <span className="bg-brand-teal/12 text-brand-teal ring-brand-teal/20 grid size-11 place-items-center rounded-2xl ring-1 ring-inset">
                    <standard.icon className="size-5" />
                  </span>
                  <h3 className="text-[0.975rem] font-semibold">{standard.step}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {standard.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>

          <Reveal delay={0.15} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="gradient" size="lg">
              <Link href="/chat">
                Chat with one of us now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/listeners">Meet the team</Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      <NotTherapy />

      <Section id="safety" className="scroll-mt-24 pt-0">
        <div className="container-page">
          <Reveal>
            <div className="border-destructive/20 bg-destructive/[0.035] mx-auto max-w-3xl rounded-3xl border p-8 sm:p-10">
              <span className="bg-destructive/10 text-destructive mb-6 grid size-12 place-items-center rounded-2xl">
                <LifeBuoy className="size-6" />
              </span>
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                Safety and crisis resources
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {disclaimer}
              </p>

              <div className="border-border/60 mt-8 grid gap-4 border-t pt-8 sm:grid-cols-2">
                {[
                  {
                    region: "United States",
                    line: "988 Suicide & Crisis Lifeline — call or text 988",
                  },
                  {
                    region: "United Kingdom",
                    line: "Samaritans — call 116 123, free, 24/7",
                  },
                  {
                    region: "Australia",
                    line: "Lifeline — call 13 11 14",
                  },
                  {
                    region: "Elsewhere",
                    line: "findahelpline.com lists services in 130+ countries",
                  },
                ].map((resource) => (
                  <div key={resource.region}>
                    <p className="text-sm font-semibold">{resource.region}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{resource.line}</p>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
                Our listeners are trained to recognise when someone needs
                professional support and to say so kindly and directly. That
                referral is a success, not a failure of the session.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
