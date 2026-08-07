"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Lock,
  SendHorizonal,
  ShieldCheck,
} from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { listeners } from "@/lib/data/listeners";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  author: "me" | "listener";
  body: string;
  /** Rendered client-side only, so the clock never disagrees with the server. */
  sentAt: Date;
}

/** Whoever is "on shift" — in production this comes from your presence service. */
const onShift = listeners[1];
const alsoOnline = [listeners[0], listeners[3]];

/**
 * Canned replies so the surface feels alive in the prototype. Replace `respond`
 * with your realtime channel — everything else here is production-shaped.
 */
const openers = [
  "Thank you for saying that. Before I respond properly — is there more of it, or is that the whole shape of it?",
  "I'm reading this carefully. What's the part of it you've said out loud the fewest times?",
  "That lands. Take your time — I'm not going anywhere, and there's no version of this you need to tidy up first.",
];

const follow_ups = [
  "Mm. Say more about that last part.",
  "I notice you moved past that quickly. Can we stay there a moment?",
  "That's the second time you've come back to this. What do you make of that?",
  "Nothing you've said so far sounds unreasonable to me.",
];

function timeLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function TypingDots() {
  return (
    <span className="flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function ChatPanel({
  variant = "page",
  className,
  onRequestClose,
}: {
  variant?: "page" | "widget";
  className?: string;
  onRequestClose?: () => void;
}) {
  const { user } = useAuth();
  const [stage, setStage] = React.useState<"intro" | "chatting">("intro");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  const endRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const replyCount = React.useRef(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  React.useEffect(() => {
    if (!user || stage === "chatting") return;
    setName(user.name);
    setEmail(user.email);
    setStage("chatting");
    setMessages([
      {
        id: "greet",
        author: "listener",
        body: `Hi ${user.name.trim().split(" ")[0]} — I'm ${onShift.name.split(" ")[0]}, one of the listeners here. I'm reading as you type, so start wherever you like. There's no wrong opening.`,
        sentAt: new Date(),
      },
    ]);
  }, [user, stage]);

  // Any pending simulated reply must not fire after the panel closes.
  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  function pushListener(body: string) {
    setMessages((current) => [
      ...current,
      { id: `l-${current.length}-${body.length}`, author: "listener", body, sentAt: new Date() },
    ]);
  }

  function respond() {
    setTyping(true);
    const body =
      replyCount.current === 0
        ? openers[Math.floor(Math.random() * openers.length)]
        : follow_ups[replyCount.current % follow_ups.length];
    replyCount.current += 1;

    const timer = window.setTimeout(() => {
      setTyping(false);
      pushListener(body);
    }, 1500 + Math.random() * 900);
    timers.current.push(timer);
  }

  function startChat(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setStage("chatting");
    setMessages([
      {
        id: "greet",
        author: "listener",
        body: `Hi ${name.trim().split(" ")[0]} — I'm ${onShift.name.split(" ")[0]}, one of the listeners here. I'm reading as you type, so start wherever you like. There's no wrong opening.`,
        sentAt: new Date(),
      },
    ]);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  function send() {
    const body = draft.trim();
    if (!body) return;
    setMessages((current) => [
      ...current,
      { id: `m-${current.length}`, author: "me", body, sentAt: new Date() },
    ]);
    setDraft("");
    respond();
  }

  const isWidget = variant === "widget";

  /* --------------------------------- Intro -------------------------------- */

  if (stage === "intro") {
    return (
      <div
        className={cn(
          "flex flex-col",
          isWidget ? "p-5" : "border-border/70 bg-card rounded-3xl border p-7 sm:p-8",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex">
            <ListenerAvatar name={onShift.name} src={onShift.avatar} size={isWidget ? "md" : "lg"} online />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{onShift.name} is on shift</p>
            <p className="text-muted-foreground text-xs">
              {alsoOnline.length + 1} listeners online · replies in a few minutes
            </p>
          </div>
        </div>

        {!isWidget && (
          <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
            This is a real chat with a real person on our team — not a bot and not
            a ticket queue. Tell us who you are and start writing whenever
            you&rsquo;re ready.
          </p>
        )}

        <form onSubmit={startChat} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`chat-name-${variant}`}>What should we call you?</Label>
            <Input
              id={`chat-name-${variant}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="given-name"
              placeholder="First name is plenty"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`chat-email-${variant}`}>
              Email <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Input
              id={`chat-email-${variant}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
            <p className="text-muted-foreground text-xs">
              Only so we can pick this back up if you get disconnected. Nothing
              else is ever sent to it.
            </p>
          </div>

          <Button type="submit" variant="gradient" size="lg" disabled={!name.trim()}>
            Start the chat <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="text-muted-foreground mt-5 flex items-start gap-2 text-xs leading-relaxed">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          Encrypted, never recorded, and never used to train anything. This is not
          therapy or crisis support —{" "}
          <Link href="/#safety" className="underline underline-offset-2">
            see our safety page
          </Link>
          .
        </p>
      </div>
    );
  }

  /* -------------------------------- Chatting ------------------------------- */

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        isWidget ? "h-full" : "border-border/70 bg-card h-[min(38rem,70dvh)] rounded-3xl border",
        className,
      )}
    >
      <header
        className={cn(
          "border-border/70 flex shrink-0 items-center gap-3 border-b px-5 py-3.5",
          isWidget && "px-4",
        )}
      >
        <ListenerAvatar name={onShift.name} src={onShift.avatar} size="sm" online />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{onShift.name}</p>
          <p className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
            <span className="bg-success size-1.5 rounded-full" />
            {typing ? "Typing…" : "Listening"}
          </p>
        </div>
        {onRequestClose && (
          <Button variant="ghost" size="sm" onClick={onRequestClose}>
            Minimise
          </Button>
        )}
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className={cn(
                "flex flex-col gap-1",
                message.author === "me" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  message.author === "me"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md",
                )}
              >
                {message.body}
              </div>
              <span className="text-muted-foreground px-1 text-[0.625rem]">
                {timeLabel(message.sentAt)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <div className="bg-muted flex w-fit items-center gap-2 rounded-2xl rounded-bl-md px-4 py-3">
            <TypingDots />
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className={cn("border-border/70 shrink-0 border-t p-4", isWidget && "p-3")}>
        <div className="border-input bg-background/60 focus-within:border-ring focus-within:ring-ring/30 flex items-end gap-2 rounded-2xl border p-2 transition-[box-shadow,border-color] focus-within:ring-[3px]">
          <Textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Write as much or as little as you like…"
            aria-label="Message"
            className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
          />
          <Button size="icon-sm" onClick={send} disabled={!draft.trim()} aria-label="Send message">
            <SendHorizonal />
          </Button>
        </div>

        <div className="text-muted-foreground mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[0.6875rem]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3" /> Encrypted · never recorded
          </span>
          <Link
            href="/book"
            className="hover:text-foreground inline-flex items-center gap-1 underline underline-offset-2"
          >
            <CalendarClock className="size-3" /> Rather talk out loud?
          </Link>
        </div>
      </div>
    </div>
  );
}
