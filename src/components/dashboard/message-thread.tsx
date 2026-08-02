"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Paperclip, Phone, SendHorizonal, Video } from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { conversations, messageThread } from "@/lib/data/demo";
import { getListener } from "@/lib/data/listeners";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

function timeLabel(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function MessageThread() {
  const [activeId, setActiveId] = React.useState(conversations[0].id);
  const [messages, setMessages] = React.useState<Message[]>(messageThread);
  const [draft, setDraft] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;
  const listener = getListener(active.listenerId);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function send() {
    const body = draft.trim();
    if (!body) return;

    setMessages((current) => [
      ...current,
      {
        id: `m-${current.length + 1}`,
        author: "me",
        body,
        sentAt: new Date().toISOString(),
      },
    ]);
    setDraft("");

    // Front-end only: a listener's reply would arrive over your realtime channel.
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `m-${current.length + 1}-reply`,
          author: "listener",
          body: "Got it — I'm reading this properly now. Give me a moment.",
          sentAt: new Date().toISOString(),
        },
      ]);
    }, 1400);
  }

  return (
    <div className="border-border/70 bg-card grid h-[calc(100dvh-9.5rem)] overflow-hidden rounded-2xl border md:grid-cols-[18rem_1fr]">
      {/* Conversation list */}
      <div className="border-border/70 hidden flex-col overflow-y-auto border-r md:flex">
        {conversations.map((conversation) => {
          const person = getListener(conversation.listenerId);
          const selected = conversation.id === activeId;
          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveId(conversation.id)}
              className={cn(
                "border-border/50 flex items-start gap-3 border-b p-4 text-left transition-colors",
                selected ? "bg-muted/70" : "hover:bg-muted/40",
              )}
            >
              <ListenerAvatar name={person?.name ?? "Listener"} size="sm" online={selected} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{person?.name}</span>
                  {conversation.unread > 0 && (
                    <span className="bg-primary text-primary-foreground ml-auto grid size-4 shrink-0 place-items-center rounded-full text-[0.5625rem] font-semibold">
                      {conversation.unread}
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                  {conversation.lastMessage}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Thread */}
      <div className="flex min-w-0 flex-col">
        <header className="border-border/70 flex items-center gap-3 border-b px-5 py-3.5">
          <ListenerAvatar name={listener?.name ?? "Listener"} size="sm" online />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{listener?.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              Usually replies {listener?.responseTime.toLowerCase()}
            </p>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Start voice call"
            onClick={() => toast.success("Ringing your listener…")}
          >
            <Phone />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Start video session"
            onClick={() => toast.info("Video sessions are scheduled — book one from /book.")}
          >
            <Video />
          </Button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
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
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
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
          <div ref={endRef} />
        </div>

        <div className="border-border/70 border-t p-4">
          <div className="border-input bg-background/60 focus-within:border-ring focus-within:ring-ring/30 flex items-end gap-2 rounded-2xl border p-2 transition-[box-shadow,border-color] focus-within:ring-[3px]">
            <Button size="icon-sm" variant="ghost" aria-label="Attach a file">
              <Paperclip />
            </Button>
            <Textarea
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
              className="max-h-32 min-h-9 resize-none border-0 bg-transparent px-1 py-1.5 shadow-none focus-visible:ring-0"
            />
            <Button size="icon-sm" onClick={send} disabled={!draft.trim()} aria-label="Send">
              <SendHorizonal />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 px-1 text-[0.6875rem]">
            Encrypted end to end · Enter to send, Shift + Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
