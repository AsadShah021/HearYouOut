"use client";

/*
 * PARKED — the full meeting request form, kept for when we reopen the richer
 * flow. Not imported anywhere right now, so it ships no JavaScript; it is still
 * type-checked and linted so it cannot rot.
 *
 * It collects: session format, topic from the services list, free-text context,
 * preferred dates, times of day, urgency, preferred listener, plus feedback
 * mode, anonymous mode and recurring check-in cadence.
 *
 * To restore it, in app/(marketing)/book/page.tsx swap:
 *   import { MeetingRequestForm } from "@/components/booking/meeting-request-form";
 * for:
 *   import { MeetingRequestFormFull as MeetingRequestForm } from "@/components/booking/meeting-request-form.full";
 * and re-enable the parked /services route, which supplies the topic list.
 */

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  CircleAlert,
  Clock3,
  EyeOff,
  MessageSquareQuote,
  Repeat,
  Loader2,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { PreferredDatesCalendar } from "@/components/booking/calendar";
import { BoundaryNotice } from "@/components/shared/boundary-notice";
import { ScopeLimits } from "@/components/shared/scope-limits";
import { toneClasses } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listeners } from "@/lib/data/listeners";
import { lifeServices, serviceMap, workServices } from "@/lib/data/services";
import { requestableModes, site } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/motion";
import { cn, formatIsoDay } from "@/lib/utils";
import type { Cadence, SessionMode, TimeWindow, Urgency } from "@/types";

export interface RequestPrefillFull {
  listener?: string;
  mode?: SessionMode;
  service?: string;
}

const timeWindows: { id: TimeWindow; label: string; hint: string }[] = [
  { id: "early", label: "Early morning", hint: "6–9am" },
  { id: "morning", label: "Morning", hint: "9am–12pm" },
  { id: "afternoon", label: "Afternoon", hint: "12–5pm" },
  { id: "evening", label: "Evening", hint: "5–9pm" },
  { id: "late", label: "Late", hint: "9pm–midnight" },
];

const urgencies: { id: Urgency; label: string; hint: string }[] = [
  { id: "flexible", label: "No rush", hint: "Whenever suits you" },
  { id: "this-week", label: "This week", hint: "Sooner would help" },
  { id: "asap", label: "As soon as possible", hint: "We'll prioritise it" },
];

const timezones = [
  "PDT (UTC−7)",
  "EDT (UTC−4)",
  "BRT (UTC−3)",
  "GMT (UTC+0)",
  "CEST (UTC+2)",
  "IST (UTC+5:30)",
  "SGT (UTC+8)",
  "JST (UTC+9)",
  "AEST (UTC+10)",
];

function Fieldset({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-border/70 bg-card rounded-3xl border p-6 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-start gap-3.5">
        <span className="bg-primary/10 text-primary grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}

export function MeetingRequestFormFull({ prefill = {} }: { prefill?: RequestPrefillFull }) {
  const prefilledMode =
    prefill.mode && prefill.mode !== "text" ? prefill.mode : undefined;

  const [mode, setMode] = React.useState<SessionMode>(
    prefilledMode ?? "meet-video",
  );
  const [listenerId, setListenerId] = React.useState(prefill.listener ?? "any");
  const [topic, setTopic] = React.useState(prefill.service ?? "");
  const [dates, setDates] = React.useState<string[]>([]);
  const [windows, setWindows] = React.useState<TimeWindow[]>([]);
  const [urgency, setUrgency] = React.useState<Urgency>("flexible");
  const [feedbackMode, setFeedbackMode] = React.useState(false);
  const [anonymous, setAnonymous] = React.useState(false);
  const [cadence, setCadence] = React.useState<Cadence | "once">("once");
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">("idle");
  const [reference, setReference] = React.useState("");
  const [errors, setErrors] = React.useState<string[]>([]);

  const selectedService = topic ? serviceMap[topic] : undefined;

  const errorRef = React.useRef<HTMLDivElement>(null);

  // Options that no longer apply must not travel with the request.
  React.useEffect(() => {
    if (!selectedService?.allowsFeedback) setFeedbackMode(false);
    if (!selectedService?.sensitive) setAnonymous(false);
    if (!selectedService?.standing) setCadence("once");
  }, [selectedService]);

  const toggleWindow = (id: TimeWindow) =>
    setWindows((current) =>
      current.includes(id) ? current.filter((w) => w !== id) : [...current, id],
    );

  const toggleDate = (iso: string) =>
    setDates((current) =>
      current.includes(iso) ? current.filter((d) => d !== iso) : [...current, iso],
    );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problems: string[] = [];
    if (dates.length === 0) problems.push("Choose at least one day that could work.");
    if (windows.length === 0) problems.push("Pick at least one time of day.");

    if (problems.length > 0) {
      setErrors(problems);
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors([]);
    setStatus("sending");

    // Front-end only. POST this to your requests endpoint — that handler is what
    // notifies the team and puts the request in the /listener/requests queue.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setReference(`SNG-${8242 + dates.length * 7 + windows.length}`);
    setStatus("sent");
    toast.success("Request sent to the team", {
      description: `We'll confirm a time by email, usually within ${site.requestResponseTime}.`,
    });
  }

  /* ------------------------------ Confirmation ----------------------------- */

  if (status === "sent") {
    const chosenListener =
      listenerId !== "any" ? listeners.find((l) => l.id === listenerId) : undefined;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="mx-auto max-w-2xl"
      >
        <div className="border-border/70 bg-card relative overflow-hidden rounded-3xl border p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="bg-success/10 absolute -top-28 left-1/2 size-72 -translate-x-1/2 rounded-full blur-3xl"
          />

          <div className="relative">
            <span className="bg-success/15 text-success mx-auto mb-6 grid size-16 place-items-center rounded-full">
              <BellRing className="size-8" />
            </span>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              Your request is with us
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
              The team has been notified. A real person reads every request, finds
              the listener who fits, and emails you a confirmed time with a
              calendar invitation — usually within {site.requestResponseTime}.
            </p>

            <div className="border-border/60 bg-muted/35 mt-8 rounded-2xl border p-5 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs">Reference</span>
                <span className="font-mono text-sm font-semibold">{reference}</span>
              </div>

              <dl className="border-border/60 mt-4 grid gap-3 border-t pt-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-xs">Format</dt>
                  <dd className="mt-0.5 font-medium">
                    {requestableModes.find((m) => m.id === mode)?.label}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Listener</dt>
                  <dd className="mt-0.5 font-medium">
                    {chosenListener ? chosenListener.name : "Best available match"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground text-xs">Days you offered</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {dates.map((iso) => (
                      <Badge key={iso} variant="muted">
                        {formatIsoDay(iso)}
                      </Badge>
                    ))}
                  </dd>
                </div>

                {(feedbackMode || anonymous || cadence !== "once") && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground text-xs">
                      What we&rsquo;ve noted
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {cadence !== "once" && (
                        <Badge variant="brand">
                          <Repeat className="size-3" />
                          {cadence === "weekly" ? "Every week" : "Every two weeks"}
                        </Badge>
                      )}
                      {feedbackMode && (
                        <Badge variant="info">
                          <MessageSquareQuote className="size-3" /> Feedback mode on
                        </Badge>
                      )}
                      {anonymous && (
                        <Badge variant="muted">
                          <EyeOff className="size-3" /> Anonymous
                        </Badge>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <ol className="mt-8 flex flex-col gap-3 text-left">
              {[
                { icon: Check, label: "Request received", done: true },
                { icon: Mail, label: "We read it and match a listener", done: false },
                { icon: CalendarCheck, label: "You get a confirmed time and Meet link", done: false },
              ].map((step) => (
                <li
                  key={step.label}
                  className="border-border/60 flex items-center gap-3 rounded-xl border p-3.5"
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full",
                      step.done
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <step.icon className="size-3.5" />
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      step.done ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="gradient">
                <Link href="/chat">
                  <MessageSquareText className="size-4" />
                  Chat with us while you wait
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Go to your dashboard</Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setDates([]);
                setWindows([]);
              }}
              className="text-muted-foreground hover:text-foreground mt-6 text-xs underline underline-offset-4"
            >
              Send another request
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  /* --------------------------------- Form --------------------------------- */

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {errors.length > 0 && (
          <div
            ref={errorRef}
            role="alert"
            className="border-destructive/30 bg-destructive/[0.04] flex gap-3 rounded-2xl border p-4"
          >
            <CircleAlert className="text-destructive mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-destructive text-sm font-medium">
                Just a couple of things missing
              </p>
              <ul className="text-muted-foreground mt-1.5 flex flex-col gap-1 text-sm">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Fieldset
          step={1}
          title="How can we reach you?"
          description="We reply by email with a confirmed time — nothing else is ever sent there."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="req-name">Full name</Label>
              <Input id="req-name" name="name" required autoComplete="name" placeholder="Alex Morgan" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="req-email">Email</Label>
              <Input
                id="req-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="req-phone">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input id="req-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="req-timezone">Your timezone</Label>
              <Select name="timezone" defaultValue="GMT (UTC+0)">
                <SelectTrigger id="req-timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Fieldset>

        <Fieldset
          step={2}
          title="What kind of conversation?"
          description="Chat doesn't need a request — you can start one instantly."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {requestableModes.map((item) => {
              const selected = item.id === mode;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  aria-pressed={selected}
                  className={cn(
                    "focus-visible:ring-ring/50 flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all outline-none focus-visible:ring-[3px]",
                    selected
                      ? "border-primary/45 bg-primary/[0.04] shadow-lift"
                      : "border-border/70 hover:border-primary/25",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl ring-1 ring-inset",
                      toneClasses[item.tone],
                    )}
                  >
                    <item.icon className="size-4.5" />
                  </span>
                  <span className="block text-sm font-semibold">{item.short}</span>
                  <span className="text-muted-foreground block text-xs">
                    {item.duration}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="req-topic">What would you like to talk about?</Label>
            <Select name="topic" value={topic} onValueChange={setTopic}>
              <SelectTrigger id="req-topic">
                <SelectValue placeholder="Choose a starting point (optional)" />
              </SelectTrigger>
              <SelectContent>
                {workServices.map((service) => (
                  <SelectItem key={service.slug} value={service.slug}>
                    {service.title}
                  </SelectItem>
                ))}
                {lifeServices.map((service) => (
                  <SelectItem key={service.slug} value={service.slug}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Standing check-ins repeat, so they need a cadence rather than a one-off slot. */}
          {selectedService?.standing && (
            <div className="border-primary/25 bg-primary/[0.04] flex flex-col gap-3 rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <Repeat className="text-primary size-4" />
                <p className="text-sm font-medium">This one repeats</p>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Check-ins are 15 minutes with the same listener, held at the same
                time each week. The days you pick below become your standing slot
                — we&rsquo;ll confirm the first one and it recurs from there.
              </p>
              <div className="flex flex-wrap gap-2">
                {(["weekly", "fortnightly"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={cadence === option}
                    onClick={() => setCadence(cadence === option ? "once" : option)}
                    className={cn(
                      "focus-visible:ring-ring/50 rounded-xl border px-3.5 py-2 text-xs font-medium capitalize transition-colors outline-none focus-visible:ring-[3px]",
                      cadence === option
                        ? "border-primary/45 bg-primary/[0.08] text-primary"
                        : "border-border/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Every {option === "weekly" ? "week" : "two weeks"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Opt-in only — listening without advising stays the default. */}
          {selectedService?.allowsFeedback && (
            <label className="border-info/30 bg-info/[0.04] flex cursor-pointer items-start gap-3 rounded-2xl p-4">
              <Checkbox
                checked={feedbackMode}
                onChange={(event) => setFeedbackMode(event.target.checked)}
                className="mt-0.5"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <MessageSquareQuote className="size-3.5" />
                  Turn on feedback mode
                </span>
                <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                  Normally we listen without offering opinions — that&rsquo;s the
                  whole service. Tick this and your listener will also tell you
                  what they honestly think, once you&rsquo;ve finished saying
                  everything you came to say.
                </span>
              </span>
            </label>
          )}

          {/* Heavier topics: state the boundary, and offer to drop the name. */}
          {selectedService?.sensitive && (
            <>
              <BoundaryNotice />
              {selectedService.escalation && (
                <ScopeLimits service={selectedService} />
              )}
              <label className="border-border/60 bg-muted/30 flex cursor-pointer items-start gap-3 rounded-2xl border p-4">
                <Checkbox
                  checked={anonymous}
                  onChange={(event) => setAnonymous(event.target.checked)}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <EyeOff className="size-3.5" />
                    Keep this anonymous
                  </span>
                  <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                    Your name is hidden from everyone except the listener taking
                    the session, and it never appears in our queue, notes or
                    reports. We still need your email to send the invitation.
                  </span>
                </span>
              </label>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="req-context">Anything we should know first?</Label>
            <Textarea
              id="req-context"
              name="context"
              rows={4}
              placeholder="A sentence or two is plenty. Plenty of people write 'not sure yet' — that's a perfectly good answer."
            />
            <p className="text-muted-foreground text-xs">
              Only the listener you&rsquo;re matched with reads this.
            </p>
          </div>
        </Fieldset>

        <Fieldset
          step={3}
          title="When are you free?"
          description="Give us a few options and we'll find the overlap with the team's calendar."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border-border/60 rounded-2xl border p-4">
              <PreferredDatesCalendar selected={dates} onToggle={toggleDate} max={3} />
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-3 text-sm font-medium">Times of day that work</p>
                <div className="flex flex-wrap gap-2">
                  {timeWindows.map((window) => {
                    const active = windows.includes(window.id);
                    return (
                      <button
                        key={window.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleWindow(window.id)}
                        className={cn(
                          "focus-visible:ring-ring/50 flex flex-col items-start rounded-xl border px-3.5 py-2 text-left transition-colors outline-none focus-visible:ring-[3px]",
                          active
                            ? "border-primary/45 bg-primary/[0.06] text-primary"
                            : "border-border/70 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span className="text-xs font-medium">{window.label}</span>
                        <span className="text-[0.625rem] opacity-70">{window.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">How soon?</p>
                <div className="flex flex-col gap-2">
                  {urgencies.map((option) => {
                    const active = urgency === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setUrgency(option.id)}
                        className={cn(
                          "focus-visible:ring-ring/50 flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors outline-none focus-visible:ring-[3px]",
                          active
                            ? "border-primary/45 bg-primary/[0.04]"
                            : "border-border/70 hover:border-primary/25",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-4 shrink-0 place-items-center rounded-full border",
                            active ? "border-primary bg-primary" : "border-border",
                          )}
                        >
                          {active && <span className="bg-primary-foreground size-1.5 rounded-full" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{option.label}</span>
                          <span className="text-muted-foreground block text-xs">
                            {option.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Fieldset>

        <Fieldset
          step={4}
          title="Anyone in particular?"
          description="Optional. If you leave this open we'll match you with whoever fits best."
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="req-listener">Preferred listener</Label>
            <Select value={listenerId} onValueChange={setListenerId}>
              <SelectTrigger id="req-listener">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">No preference — match me</SelectItem>
                {listeners
                  .filter((listener) => listener.modes.includes(mode))
                  .map((listener) => (
                    <SelectItem key={listener.id} value={listener.id}>
                      {listener.name} · {listener.specialties[0]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Only listeners who offer{" "}
              {requestableModes.find((m) => m.id === mode)?.short.toLowerCase()} are
              listed.
            </p>
          </div>

          <label className="border-border/60 bg-muted/30 flex cursor-pointer items-start gap-3 rounded-2xl border p-4">
            <Checkbox name="acknowledge" required className="mt-0.5" />
            <span className="text-muted-foreground text-xs leading-relaxed">
              I understand SnugTalk is a listening service and{" "}
              <span className="text-foreground font-medium">
                not therapy, counseling, or crisis support
              </span>
              , and that my listener cannot give clinical advice.
            </span>
          </label>
        </Fieldset>

        <div className="flex flex-col-reverse items-center gap-4 pt-2 sm:flex-row sm:justify-between">
          <p className="text-muted-foreground text-xs leading-relaxed">
            Nothing is booked yet — we&rsquo;ll confirm the time with you first.
          </p>
          <Button
            type="submit"
            size="xl"
            variant="gradient"
            disabled={status === "sending"}
            className="w-full sm:w-auto"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              <>
                <Send className="size-4" /> Send request
              </>
            )}
          </Button>
        </div>
      </form>

      {/* What happens next */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-border/70 bg-card rounded-3xl border p-6">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            What happens next
          </p>

          <ol className="mt-5 flex flex-col gap-5">
            {[
              {
                icon: Send,
                title: "You send this request",
                body: "It lands in our queue immediately and notifies whoever is on shift.",
              },
              {
                icon: Mail,
                title: "A person reads it",
                body: "We match you with the listener who fits the conversation, not just the calendar gap.",
              },
              {
                icon: CalendarCheck,
                title: "We confirm a time",
                body: `You get an email and a calendar invitation — usually within ${site.requestResponseTime}.`,
              },
              {
                icon: Clock3,
                title: "You join from your dashboard",
                body: "One click at the appointed time. Reschedule free up to 4 hours before.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className="bg-primary/10 text-primary grid size-8 shrink-0 place-items-center rounded-full">
                    <step.icon className="size-4" />
                  </span>
                  {index < 3 && <span className="bg-border mt-1 w-px flex-1" />}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-primary/25 bg-primary/[0.04] mt-4 rounded-3xl border p-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {listeners.slice(0, 3).map((listener) => (
                <ListenerAvatar key={listener.id} name={listener.name} src={listener.avatar} size="xs" ring />
              ))}
            </div>
            <p className="text-sm font-medium">Don&rsquo;t want to wait?</p>
          </div>
          <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
            Chat is instant. Open one now and talk to whoever is on shift — no
            request, no confirmation, no calendar.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link href="/chat">
              Start a chat instead <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground mt-4 flex items-start gap-2 px-2 text-xs leading-relaxed">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
          Your request is only visible to our team, and is deleted along with your
          account if you ever close it.
        </p>
      </aside>
    </div>
  );
}
