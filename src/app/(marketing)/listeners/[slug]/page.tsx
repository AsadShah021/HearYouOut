import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { IntroVideo } from "@/components/listeners/intro-video";
import { Reveal } from "@/components/motion/reveal";
import { ModeBadge } from "@/components/shared/mode-badge";
import { Rating } from "@/components/shared/rating";
import { Section } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { publicAssetExists } from "@/lib/assets";
import { listeners, listenerReviews } from "@/lib/data/listeners";
import { sessionModeMap, site } from "@/lib/data/site";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return listeners.map((listener) => ({ slug: listener.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listener = listeners.find((l) => l.slug === slug);
  if (!listener) return createMetadata({ title: "Listener not found", description: "" });

  return createMetadata({
    title: `${listener.name} — ${listener.headline}`,
    description: listener.bio.slice(0, 155),
    path: `/listeners/${listener.slug}`,
    keywords: [listener.name, ...listener.specialties, "listener", "someone to talk to"],
  });
}

export default async function ListenerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listener = listeners.find((l) => l.slug === slug);
  if (!listener) notFound();

  const reviews = listenerReviews.slice(0, 3);

  return (
    <Section className="pt-28 sm:pt-32">
      <div className="container-page">
        <Reveal>
          <Link
            href="/listeners"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to the team
          </Link>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-14">
          {/* Left rail — face, video, the practical facts */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              {/* The player only appears once the video file is actually there,
                  so a wired-up-but-missing video never renders as an empty box. */}
              {publicAssetExists(listener.introVideo) ? (
                <IntroVideo listener={listener} />
              ) : (
                <div className="border-border/70 bg-muted relative aspect-4/5 overflow-hidden rounded-3xl border">
                  <ListenerAvatar
                    name={listener.name}
                    src={listener.avatar}
                    size="2xl"
                    announce
                    className="absolute inset-0 grid size-full place-items-center [&>*]:size-full [&>*]:rounded-3xl [&>*]:text-5xl"
                  />
                </div>
              )}
            </Reveal>

            <Reveal delay={0.05}>
              <div className="border-border/70 bg-card flex flex-col gap-4 rounded-3xl border p-6">
                <div className="flex items-center gap-3">
                  <Rating value={listener.rating} />
                  <span className="text-muted-foreground text-xs">
                    {listener.reviews} reviews
                  </span>
                </div>

                <dl className="text-muted-foreground flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="size-3.5 shrink-0" />
                    <dd>{listener.location}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock3 className="size-3.5 shrink-0" />
                    <dd>{listener.timezone}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe2 className="size-3.5 shrink-0" />
                    <dd>{listener.languages.join(", ")}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="size-3.5 shrink-0" />
                    <dd>
                      {listener.sessions.toLocaleString()} conversations ·{" "}
                      {listener.yearsListening} years
                    </dd>
                  </div>
                </dl>

                <div className="border-border/60 flex flex-col gap-2.5 border-t pt-4">
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/chat">
                      <MessageSquareText className="size-4" /> Chat with us now
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/book?listener=${listener.id}`}>
                      <CalendarClock className="size-4" /> Request {listener.name.split(" ")[0]}
                    </Link>
                  </Button>
                  <p className="text-muted-foreground text-center text-xs leading-relaxed">
                    Chat is answered by whoever is on shift. To speak with{" "}
                    {listener.name.split(" ")[0]} specifically, send a request —
                    we reply within {site.requestResponseTime}.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — who they are */}
          <div className="flex flex-col gap-10">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5">
                {listener.verified && (
                  <Badge variant="success">
                    <BadgeCheck className="size-3" /> In-house team
                  </Badge>
                )}
                {listener.favourite && (
                  <Badge variant="brand">
                    <Heart className="size-3" /> One of your favourites
                  </Badge>
                )}
                <Badge variant="muted">Replies {listener.responseTime.toLowerCase()}</Badge>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {listener.name}
              </h1>
              <p className="text-muted-foreground mt-2.5 text-lg">{listener.headline}</p>

              <p className="mt-7 text-base leading-relaxed">{listener.bio}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-muted-foreground mb-3.5 text-xs font-semibold tracking-wide uppercase">
                What people talk to {listener.name.split(" ")[0]} about
              </h2>
              <div className="flex flex-wrap gap-2">
                {listener.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="border-border/70 bg-card rounded-full border px-3.5 py-1.5 text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-muted-foreground mb-3.5 text-xs font-semibold tracking-wide uppercase">
                Available for
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {listener.modes.map((mode) => {
                  const meta = sessionModeMap[mode];
                  return (
                    <Link
                      key={mode}
                      href={meta.booking === "instant" ? "/chat" : `/book?mode=${mode}&listener=${listener.id}`}
                      className="border-border/70 hover:border-primary/35 flex items-start gap-3.5 rounded-2xl border p-4 transition-colors"
                    >
                      <meta.icon className="text-primary mt-0.5 size-4.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{meta.short}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {meta.booking === "instant"
                            ? "Start instantly"
                            : `${meta.duration} · by request`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <h2 className="text-muted-foreground mb-3.5 text-xs font-semibold tracking-wide uppercase">
                What people said afterwards
              </h2>
              <div className="flex flex-col gap-3">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="border-border/70 bg-card rounded-2xl border p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <ListenerAvatar name={review.author} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{review.author}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(review.date, { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <ModeBadge mode={review.mode} />
                      <Rating value={review.rating} size="sm" />
                    </div>
                    <p className="text-muted-foreground mt-3.5 text-sm leading-relaxed">
                      {review.body}
                    </p>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
