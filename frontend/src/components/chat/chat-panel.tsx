"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Loader2, SendHorizonal, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError, type ApiConversation, type ApiMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How often to check for replies. Cheap enough at this scale; swap for
 *  websockets when concurrent threads make polling wasteful. */
const POLL_MS = 5000;

function timeLabel(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
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
  const [conversation, setConversation] = React.useState<ApiConversation | null>(null);
  const [messages, setMessages] = React.useState<ApiMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);

  const endRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const isWidget = variant === "widget";

  // Load the member's thread, creating it server-side on first visit.
  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.get<{ conversation: ApiConversation; messages: ApiMessage[] }>(
          "/api/conversations/mine",
        );
        if (cancelled) return;
        setConversation(data.conversation);
        setMessages(data.messages);
      } catch (error) {
        if (!cancelled && !(error instanceof ApiError && error.isUnauthorized)) {
          toast.error("Couldn't load your messages.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Poll for replies. Only merges in messages we don't already have, so a
  // slow poll can never duplicate or reorder what's on screen.
  React.useEffect(() => {
    if (!conversation) return;

    const timer = window.setInterval(async () => {
      if (document.hidden) return;
      try {
        const { messages: latest } = await api.get<{ messages: ApiMessage[] }>(
          `/api/conversations/${conversation.id}/messages`,
        );
        setMessages((current) =>
          latest.length === current.length ? current : latest,
        );
      } catch {
        // A dropped poll is not worth interrupting the person for.
      }
    }, POLL_MS);

    return () => window.clearInterval(timer);
  }, [conversation]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function send() {
    const body = draft.trim();
    if (!body || !conversation || sending) return;

    setSending(true);
    setDraft("");

    try {
      const { message } = await api.post<{ message: ApiMessage }>(
        `/api/conversations/${conversation.id}/messages`,
        { body },
      );
      setMessages((current) => [...current, message]);
      inputRef.current?.focus();
    } catch (error) {
      setDraft(body); // Give them their words back rather than losing them.
      toast.error(
        error instanceof ApiError ? error.message : "Message didn't send. Try again.",
      );
    } finally {
      setSending(false);
    }
  }

  const waitingOnUs =
    messages.length > 0 && messages[messages.length - 1]!.sender.role === "MEMBER";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        isWidget
          ? "h-full"
          : "border-border/70 bg-card h-[min(38rem,70dvh)] rounded-3xl border",
        className,
      )}
    >
      <header
        className={cn(
          "border-border/70 flex shrink-0 items-center gap-3 border-b px-5 py-3.5",
          isWidget && "px-4",
        )}
      >
        <ListenerAvatar name="SnugTalk" size="sm" online />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {conversation?.assignedListener?.name ?? "SnugTalk"}
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
            <span className="bg-success size-1.5 rounded-full" />
            {waitingOnUs ? "We've got your message" : "Listening"}
          </p>
        </div>
        {onRequestClose && (
          <Button variant="ghost" size="sm" onClick={onRequestClose}>
            Minimise
          </Button>
        )}
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
        {loading ? (
          <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" /> Loading your messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
            <p className="text-foreground font-medium">
              Hi {user?.name?.split(" ")[0] ?? "there"} — this is a real chat.
            </p>
            <p className="leading-relaxed">
              Write whatever&rsquo;s on your mind. Someone on our team reads it
              and replies here. There&rsquo;s no wrong opening.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const mine = message.sender.role === "MEMBER";
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: easeOutExpo }}
                  className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                      mine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md",
                    )}
                  >
                    {message.body}
                  </div>
                  <span className="text-muted-foreground px-1 text-[0.625rem]">
                    {mine ? "" : `${message.sender.name} · `}
                    {timeLabel(message.createdAt)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {sending && (
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
                void send();
              }
            }}
            rows={1}
            disabled={loading || !conversation}
            placeholder="Write as much or as little as you like…"
            aria-label="Message"
            className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
          />
          <Button
            size="icon-sm"
            onClick={() => void send()}
            disabled={!draft.trim() || sending || !conversation}
            aria-label="Send message"
          >
            {sending ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
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
