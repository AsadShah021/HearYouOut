"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCheck, Loader2, Mail, SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError, type ApiConversation, type ApiMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { easeOutExpo } from "@/lib/motion";
import { cn, formatDate, formatRelativeDay } from "@/lib/utils";

const POLL_MS = 6000;

const statusTone = {
  WAITING: "warning",
  ACTIVE: "success",
  CLOSED: "muted",
} as const;

/** Ready-made openers — the point is speed, not putting words in anyone's mouth. */
const quickReplies = [
  "There's a real person here — I'm reading now.",
  "Anything at all is welcome. It doesn't have to be about work.",
  "Take your time. I'm not going anywhere.",
];

type Scope = "mine" | "unassigned" | "all";

export function TeamChatInbox() {
  const { user: me } = useAuth();
  const [scope, setScope] = React.useState<Scope>("all");
  const [conversations, setConversations] = React.useState<ApiConversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ApiMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  // Filtering client-side: the inbox is capped at 100 threads, so this stays
  // instant and avoids a round trip every time they flip tabs.
  const visible = conversations.filter((c) =>
    scope === "mine"
      ? c.assignedListener?.id === me?.id
      : scope === "unassigned"
        ? !c.assignedListener
        : true,
  );

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const mineCount = conversations.filter((c) => c.assignedListener?.id === me?.id).length;

  const loadInbox = React.useCallback(async () => {
    try {
      const { conversations: list } = await api.get<{ conversations: ApiConversation[] }>(
        "/api/conversations",
      );
      setConversations(list);
      setActiveId((current) => current ?? list[0]?.id ?? null);
    } catch (error) {
      if (!(error instanceof ApiError && error.isUnauthorized)) {
        toast.error(
          error instanceof ApiError ? error.message : "Couldn't load the inbox.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadInbox();
    const timer = window.setInterval(() => {
      if (!document.hidden) void loadInbox();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadInbox]);

  // Load the selected thread, and keep it fresh while it's open.
  React.useEffect(() => {
    if (!activeId) return;
    let cancelled = false;

    async function load() {
      try {
        const { messages: list } = await api.get<{ messages: ApiMessage[] }>(
          `/api/conversations/${activeId}/messages`,
        );
        if (!cancelled) setMessages(list);
      } catch {
        // A dropped poll shouldn't clear what's on screen.
      }
    }

    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activeId]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, activeId]);

  async function send(body: string) {
    const text = body.trim();
    if (!text || !activeId || sending) return;

    setSending(true);
    setDraft("");

    try {
      const { message } = await api.post<{ message: ApiMessage }>(
        `/api/conversations/${activeId}/messages`,
        { body: text },
      );
      setMessages((current) => [...current, message]);
      void loadInbox();
    } catch (error) {
      setDraft(text);
      toast.error(
        error instanceof ApiError ? error.message : "Reply didn't send. Try again.",
      );
    } finally {
      setSending(false);
    }
  }

  const waiting = conversations.filter((c) => c.status === "WAITING").length;

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading the inbox…
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="border-border/70 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
        <p className="text-sm font-medium">No conversations yet</p>
        <p className="text-muted-foreground max-w-xs text-sm">
          Threads appear here the moment a member sends their first message.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border/70 bg-card grid h-[calc(100dvh-9.5rem)] overflow-hidden rounded-2xl border md:grid-cols-[20rem_1fr]">
      {/* Queue */}
      <div className="border-border/70 hidden flex-col border-r md:flex">
        <div className="border-border/70 flex flex-col gap-2.5 border-b px-4 py-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Inbox</p>
            {waiting > 0 && <Badge variant="warning">{waiting} waiting</Badge>}
          </div>

          <div className="bg-muted/70 inline-flex rounded-full p-0.5">
            {([
              ["mine", `Mine${mineCount ? ` (${mineCount})` : ""}`],
              ["unassigned", "Unassigned"],
              ["all", "All"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                className={cn(
                  "focus-visible:ring-ring/50 h-7 flex-1 rounded-full px-2.5 text-[0.6875rem] font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  scope === value
                    ? "bg-card text-foreground shadow-[0_1px_2px_rgba(16,16,32,0.06)]"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visible.length === 0 && (
            <p className="text-muted-foreground p-6 text-center text-xs leading-relaxed">
              {scope === "mine"
                ? "Nothing assigned to you yet. An admin can assign members to you from the users page."
                : "No threads here."}
            </p>
          )}

          {visible.map((chat) => {
            const selected = chat.id === activeId;
            const preview = chat.messages?.[0];
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveId(chat.id)}
                className={cn(
                  "border-border/50 flex w-full items-start gap-3 border-b p-4 text-left transition-colors",
                  selected ? "bg-muted/70" : "hover:bg-muted/40",
                  chat.status === "WAITING" && !selected && "bg-warning/[0.04]",
                )}
              >
                <ListenerAvatar
                  name={chat.member.name}
                  size="sm"
                  online={chat.status !== "CLOSED"}
                />
                <span className="min-w-0 flex-1">
                  <span className="truncate text-sm font-medium">{chat.member.name}</span>
                  <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                    {preview?.body ?? "No messages yet"}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={statusTone[chat.status]} className="text-[0.5625rem]">
                      {chat.status === "WAITING"
                        ? "Waiting"
                        : chat.status === "ACTIVE"
                          ? "Active"
                          : "Closed"}
                    </Badge>
                    <span className="text-muted-foreground text-[0.5625rem]">
                      {formatRelativeDay(chat.lastMessageAt)}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-w-0 flex-col">
        <header className="border-border/70 flex flex-wrap items-center gap-3 border-b px-5 py-3.5">
          <ListenerAvatar name={active?.member.name ?? "—"} size="sm" online />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{active?.member.name}</p>
            <p className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
              <Mail className="size-3" />
              {active?.member.email}
            </p>
          </div>
          {active?.assignedListener ? (
            <Badge variant={active.assignedListener.id === me?.id ? "success" : "brand"}>
              {active.assignedListener.id === me?.id
                ? "Yours"
                : active.assignedListener.name.split(" ")[0]}
            </Badge>
          ) : (
            <Badge variant="muted">Unassigned</Badge>
          )}
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((message) => {
            const fromUs = message.sender.role !== "MEMBER";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: easeOutExpo }}
                className={cn("flex flex-col gap-1", fromUs ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap sm:max-w-[70%]",
                    fromUs
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md",
                  )}
                >
                  {message.body}
                </div>
                <span className="text-muted-foreground flex items-center gap-1 px-1 text-[0.625rem]">
                  {fromUs && `${message.sender.name} · `}
                  {formatDate(message.createdAt, { hour: "2-digit", minute: "2-digit" })}
                  {fromUs && <CheckCheck className="size-3" />}
                </span>
              </motion.div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="border-border/70 border-t p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                disabled={sending}
                onClick={() => void send(reply)}
                className="border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40 rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="border-input bg-background/60 focus-within:border-ring focus-within:ring-ring/30 flex items-end gap-2 rounded-2xl border p-2 transition-[box-shadow,border-color] focus-within:ring-[3px]">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              rows={1}
              placeholder={`Reply to ${active?.member.name.split(" ")[0] ?? "them"}…`}
              aria-label="Reply"
              className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon-sm"
              onClick={() => void send(draft)}
              disabled={!draft.trim() || sending}
              aria-label="Send reply"
            >
              {sending ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
            </Button>
          </div>

          <p className="text-muted-foreground mt-2 px-1 text-[0.6875rem]">
            Enter to send · listening, not advising — if they need clinical support, refer them
          </p>
        </div>
      </div>
    </div>
  );
}
