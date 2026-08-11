"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText, X } from "lucide-react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** How often to check for new messages while the widget is closed. */
const POLL_MS = 15000;

/**
 * Routes with a better chat surface of their own — the full page, and the
 * staff inbox. A floating bubble on top of either would just be in the way.
 */
const hiddenOn = ["/chat", "/admin", "/listener"];

/**
 * Floating chat, bottom-right.
 *
 * Closed, it shows how many messages are waiting. Opening it marks them read
 * server-side, so the count is per-account rather than per-device — someone
 * who reads a reply on their phone shouldn't still see a badge on their laptop.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  // `usePathname` isn't dependable during prerender, so the launcher is
  // client-only — otherwise it ships in static HTML for routes that exclude it.
  React.useEffect(() => setMounted(true), []);

  const hidden = hiddenOn.some((route) => pathname.startsWith(route));
  const active = mounted && ready && !!user && !hidden;

  // Poll only while closed. Once open, ChatPanel is polling the thread itself.
  React.useEffect(() => {
    if (!active || open) return;

    const check = async () => {
      if (document.hidden) return;
      try {
        const { count } = await api.get<{ count: number }>(
          "/api/conversations/unread-count",
        );
        setUnread(count);
      } catch {
        // A dropped poll shouldn't surface anything to the person.
      }
    };

    void check();
    const timer = window.setInterval(check, POLL_MS);
    return () => window.clearInterval(timer);
  }, [active, open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);

    if (!next) return;

    // Opening is the read receipt. Clear locally first so the badge doesn't
    // linger while the request is in flight.
    setUnread(0);
    try {
      const { conversation } = await api.get<{ conversation: { id: string } }>(
        "/api/conversations/mine",
      );
      await api.post(`/api/conversations/${conversation.id}/read`);
    } catch {
      // Not worth interrupting them — the next poll corrects the count.
    }
  }

  if (!active) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: easeOutExpo }}
            role="dialog"
            aria-label="Chat with a listener"
            className="border-border/70 bg-card fixed right-4 bottom-24 z-50 flex h-[min(34rem,72dvh)] w-[min(23rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border shadow-2xl sm:right-6"
          >
            <ChatPanel variant="widget" onRequestClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => void toggle()}
        aria-expanded={open}
        aria-label={
          open
            ? "Close chat"
            : unread > 0
              ? `Open chat — ${unread} unread ${unread === 1 ? "message" : "messages"}`
              : "Open chat"
        }
        className={cn(
          "focus-visible:ring-ring/50 fixed right-4 bottom-5 z-50 grid size-14 place-items-center rounded-full text-white shadow-[0_12px_36px_-10px_var(--brand-violet)] transition-transform outline-none focus-visible:ring-[3px] active:scale-95 sm:right-6 sm:bottom-6",
          "bg-[linear-gradient(130deg,var(--brand-violet),color-mix(in_oklab,var(--brand-violet)_60%,var(--brand-rose))_60%,var(--brand-amber))]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 grid place-items-center"
          >
            {open ? <X className="size-5.5" /> : <MessageSquareText className="size-5.5" />}
          </motion.span>
        </AnimatePresence>

        {!open && unread > 0 && (
          <span
            aria-hidden
            className="bg-destructive ring-background absolute -top-0.5 -right-0.5 grid min-w-5.5 place-items-center rounded-full px-1.5 text-[0.6875rem] font-semibold text-white ring-2 tabular-nums"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </>
  );
}
