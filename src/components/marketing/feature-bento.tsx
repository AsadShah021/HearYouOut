import {
  BookmarkCheck,
  CalendarRange,
  History,
  LayoutDashboard,
  Lock,
  NotebookPen,
  Repeat,
  Star,
  UserRound,
  Video,
} from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { listeners } from "@/lib/data/listeners";
import { Stagger, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const smallFeatures = [
  { icon: UserRound, title: "Real human listeners", body: "Our own in-house team, named and trained. Never a model pretending." },
  { icon: Video, title: "Google Meet face-to-face", body: "Scheduled video sessions with the camera always optional." },
  { icon: CalendarRange, title: "Scheduling that fits you", body: "Offer us the days that suit; we work around them, in your timezone." },
  { icon: Repeat, title: "Subscription access", body: "A predictable monthly allowance. Cancel in one click." },
  { icon: NotebookPen, title: "Save notes & ideas", body: "Everything worth keeping, captured and searchable." },
  { icon: Star, title: "Highly rated listeners", body: "Ratings from real sessions only — no incentives, no editing." },
];

/** The three shown in the favourites illustration. */
const favouriteShowcase = listeners.slice(0, 3);

export function FeatureBento() {
  return (
    <Section id="features" className="relative overflow-hidden">
      <div className="container-page">
        <SectionHeading
          eyebrow="Everything included"
          title="Built to make being heard effortless"
          description="The product disappears when it's working. Here's what's holding it up."
        />

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Privacy — the load-bearing promise, so it gets the most space */}
          <RevealItem className="lg:col-span-2">
            <div className="border-border/70 bg-card relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-3xl border p-7 sm:p-8">
              <div
                aria-hidden
                className="bg-brand-teal/10 absolute -top-24 -right-16 size-72 rounded-full blur-3xl"
              />
              <div className="relative max-w-md">
                <span className="bg-brand-teal/12 text-brand-teal ring-brand-teal/20 mb-5 grid size-11 place-items-center rounded-2xl ring-1 ring-inset">
                  <Lock className="size-5" />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  Secure, private conversations
                </h3>
                <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                  Text is encrypted in transit and at rest. Sessions are never
                  recorded. We don&rsquo;t sell your data, we don&rsquo;t train
                  models on it, and nothing is ever shared with employers or
                  insurers.
                </p>
              </div>

              <div className="relative flex flex-wrap gap-2">
                {[
                  "AES-256 at rest",
                  "TLS 1.3 in transit",
                  "No session recording",
                  "Delete anything, anytime",
                  "SOC 2 aligned",
                ].map((item) => (
                  <Badge key={item} variant="outline" className="bg-background/60 font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* Dashboard preview */}
          <RevealItem>
            <div className="border-border/70 bg-card flex h-full flex-col gap-5 rounded-3xl border p-7">
              <span className="bg-primary/8 text-primary ring-primary/12 grid size-11 place-items-center rounded-2xl ring-1 ring-inset">
                <LayoutDashboard className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">Personalised dashboard</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Upcoming sessions, live threads and your remaining allowance in
                  one place.
                </p>
              </div>

              <div className="border-border/60 bg-muted/40 mt-auto rounded-2xl border p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Sessions this month</span>
                  <span className="font-semibold tabular-nums">4 / 6</span>
                </div>
                <Progress value={66} />
                <p className="text-muted-foreground mt-2.5 text-[0.6875rem]">
                  Resets in 18 days · 2 remaining
                </p>
              </div>
            </div>
          </RevealItem>

          {/* Conversation history */}
          <RevealItem>
            <div className="border-border/70 bg-card flex h-full flex-col gap-5 rounded-3xl border p-7">
              <span className="bg-brand-amber/14 text-brand-amber ring-brand-amber/20 grid size-11 place-items-center rounded-2xl ring-1 ring-inset">
                <History className="size-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">Conversation history</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Your listener remembers. So does your dashboard.
                </p>
              </div>
              <ul className="mt-auto flex flex-col gap-2.5">
                {[
                  { label: "Positioning session", when: "3 days ago" },
                  { label: "Untangling the roadmap", when: "1 week ago" },
                  { label: "Hard week, no agenda", when: "2 weeks ago" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="border-border/60 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-xs"
                  >
                    <span className="truncate font-medium">{item.label}</span>
                    <span className="text-muted-foreground shrink-0">{item.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          {/* Favourite listeners */}
          <RevealItem className="lg:col-span-2">
            <div className="border-border/70 bg-card flex h-full flex-col gap-6 rounded-3xl border p-7 sm:flex-row sm:items-center sm:p-8">
              <div className="flex-1">
                <span className="bg-brand-rose/12 text-brand-rose ring-brand-rose/20 mb-5 grid size-11 place-items-center rounded-2xl ring-1 ring-inset">
                  <BookmarkCheck className="size-5" />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  Keep the same listener
                </h3>
                <p className="text-muted-foreground mt-2.5 max-w-md text-sm leading-relaxed">
                  Favourite anyone and their availability surfaces first. On
                  Premium, nominate a dedicated listener who holds recurring slots
                  and already knows the whole story.
                </p>
              </div>

              <div className="flex shrink-0 gap-3 sm:flex-col">
                {favouriteShowcase.map((person, i) => (
                  <div
                    key={person.slug}
                    className={cn(
                      "border-border/60 bg-background/60 flex items-center gap-3 rounded-2xl border p-2.5 pr-4",
                      i === 0 && "border-primary/30 shadow-lift",
                    )}
                  >
                    <ListenerAvatar name={person.name} src={person.avatar} size="sm" />
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium">{person.name}</p>
                      <p className="text-muted-foreground text-[0.625rem]">
                        {i === 0 ? "Preferred listener" : "Favourite"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealItem>

          {smallFeatures.map((feature) => (
            <RevealItem key={feature.title}>
              <div className="border-border/70 bg-card hover:border-primary/25 flex h-full items-start gap-4 rounded-3xl border p-6 transition-colors">
                <span className="bg-muted text-foreground grid size-10 shrink-0 place-items-center rounded-xl">
                  <feature.icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {feature.body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
