"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCheck,
  Globe2,
  Mail,
  SendHorizonal,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { teamChats } from "@/lib/data/demo";
import { listenerMap } from "@/lib/data/listeners";
import { easeOutExpo } from "@/lib/motion";
import { cn, formatDate } from "@/lib/utils";
import type { ChatConversation, ChatStatus } from "@/types";

interface Reply {
  id: string;
  author: "them" | "us";
  body: string;
  at: string;
}

/** Opening messages per conversation so switching threads shows real content. */
const threads: Record<string, Reply[]> = {
  "tc-1": [
    {
      id: "t1-1",
      author: "them",
      body: "Hi — I'm not really sure how this works. Can I just talk about something that's bothering me, or does it have to be a business thing?",
      at: "09:41",
    },
  ],
  "tc-2": [
    { id: "t2-1", author: "us", body: "Morning. How did the customer calls go yesterday?", at: "08:40" },
    {
      id: "t2-2",
      author: "them",
      body: "Three of five said they'd pay. The other two got confused about what we actually do, which is the part that's bugging me.",
      at: "08:52",
    },
    { id: "t2-3", author: "us", body: "What did you say to the two who got confused? Word for word, if you remember.", at: "08:55" },
    {
      id: "t2-4",
      author: "them",
      body: "Something like 'a platform for operations teams to coordinate'. Which now that I type it out means nothing.",
      at: "09:03",
    },
  ],
  "tc-3": [
    { id: "t3-1", author: "them", body: "is there an actual person reading this or is it a bot", at: "08:58" },
  ],
  "tc-4": [
    {
      id: "t4-1",
      author: "them",
      body: "I keep drafting the message to my co-founder and deleting it.",
      at: "19:04",
    },
    { id: "t4-2", author: "us", body: "What's in the version you keep deleting?", at: "19:11" },
    { id: "t4-3", author: "them", body: "That's helpful. I'll sit with it and message you tomorrow.", at: "19:22" },
  ],
  "tc-5": [
    { id: "t5-1", author: "them", body: "Thank you. Genuinely.", at: "11:04" },
  ],
};

/** Ready-made openers — the point is speed, not putting words in anyone's mouth. */
const quickReplies = [
  "There's a real person here — I'm reading now.",
  "Anything at all is welcome. It doesn't have to be about work.",
  "Take your time. I'm not going anywhere.",
];

const statusTone: Record<ChatStatus, "warning" | "success" | "muted"> = {
  waiting: "warning",
  active: "success",
  closed: "muted",
};

export function TeamChatInbox() {
  const [chats, setChats] = React.useState<ChatConversation[]>(teamChats);
  const [activeId, setActiveId] = React.useState(teamChats[0].id);
  const [messages, setMessages] = React.useState<Record<string, Reply[]>>(threads);
  const [draft, setDraft] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  const active = chats.find((chat) => chat.id === activeId)!;
  const activeMessages = messages[activeId] ?? [];
  const assigned = active.assignedTo ? listenerMap[active.assignedTo] : undefined;

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeMessages.length, activeId]);

  function selectChat(id: string) {
    setActiveId(id);
    setChats((current) =>
      current.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat)),
    );
  }

  function send(body: string) {
    const text = body.trim();
    if (!text) return;

    const now = new Date();
    const stamp = formatDate(now, { hour: "2-digit", minute: "2-digit" });

    setMessages((current) => ({
      ...current,
      [activeId]: [
        ...(current[activeId] ?? []),
        { id: `r-${Date.now()}`, author: "us", body: text, at: stamp },
      ],
    }));
    setChats((current) =>
      current.map((chat) =>
        chat.id === activeId
          ? { ...chat, status: "active", lastMessage: text, unread: 0, waitingFor: undefined }
          : chat,
      ),
    );
    setDraft("");
  }

  const waiting = chats.filter((chat) => chat.status === "waiting").length;

  return (
    <div className="border-border/70 bg-card grid h-[calc(100dvh-9.5rem)] overflow-hidden rounded-2xl border md:grid-cols-[20rem_1fr]">
      {/* Queue */}
      <div className="border-border/70 hidden flex-col border-r md:flex">
        <div className="border-border/70 flex items-center justify-between gap-2 border-b px-4 py-3.5">
          <p className="text-sm font-semibold">Inbox</p>
          {waiting > 0 && (
            <Badge variant="warning">{waiting} waiting</Badge>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const selected = chat.id === activeId;
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => selectChat(chat.id)}
                className={cn(
                  "border-border/50 flex w-full items-start gap-3 border-b p-4 text-left transition-colors",
                  selected ? "bg-muted/70" : "hover:bg-muted/40",
                  chat.status === "waiting" && !selected && "bg-warning/[0.04]",
                )}
              >
                <ListenerAvatar
                  name={chat.personName}
                  size="sm"
                  online={chat.status !== "closed"}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {chat.personName}
                    </span>
                    {chat.unread > 0 && (
                      <span className="bg-primary text-primary-foreground ml-auto grid size-4 shrink-0 place-items-center rounded-full text-[0.5625rem] font-semibold">
                        {chat.unread}
                      </span>
                    )}
                  </span>
                  <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                    {chat.lastMessage}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={statusTone[chat.status]} className="text-[0.5625rem]">
                      {chat.status === "waiting"
                        ? `Waiting ${chat.waitingFor}`
                        : chat.status === "active"
                          ? "Active"
                          : "Closed"}
                    </Badge>
                    <Badge variant="muted" className="text-[0.5625rem]">
                      {chat.source === "visitor" ? "Visitor" : "Member"}
                    </Badge>
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
          <ListenerAvatar name={active.personName} size="sm" online={active.status !== "closed"} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{active.personName}</p>
            <p className="text-muted-foreground flex items-center gap-2 truncate text-xs">
              {active.personEmail ? (
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />
                  {active.personEmail}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Globe2 className="size-3" />
                  Anonymous visitor
                </span>
              )}
              {active.topic && <span>· {active.topic}</span>}
            </p>
          </div>

          {assigned ? (
            <Badge variant="brand">
              <Sparkles className="size-3" /> {assigned.name.split(" ")[0]}
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setChats((current) =>
                  current.map((chat) =>
                    chat.id === activeId ? { ...chat, assignedTo: "l-amara" } : chat,
                  ),
                );
                toast.success("Assigned to you");
              }}
            >
              <UserPlus className="size-3.5" /> Take it
            </Button>
          )}

          <Button size="sm" variant="ghost" asChild>
            <a href="/listener/requests">
              <CalendarClock className="size-3.5" />
              <span className="hidden lg:inline">Offer a meeting</span>
            </a>
          </Button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {activeMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
              className={cn(
                "flex flex-col gap-1",
                message.author === "us" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
                  message.author === "us"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md",
                )}
              >
                {message.body}
              </div>
              <span className="text-muted-foreground flex items-center gap-1 px-1 text-[0.625rem]">
                {message.at}
                {message.author === "us" && <CheckCheck className="size-3" />}
              </span>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-border/70 border-t p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => send(reply)}
                className="border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40 rounded-full border px-3 py-1.5 text-xs transition-colors"
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
                  send(draft);
                }
              }}
              rows={1}
              placeholder={`Reply to ${active.personName.split(" ")[0]}…`}
              aria-label="Reply"
              className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon-sm"
              onClick={() => send(draft)}
              disabled={!draft.trim()}
              aria-label="Send reply"
            >
              <SendHorizonal />
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
