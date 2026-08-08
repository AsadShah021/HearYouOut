"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText, X } from "lucide-react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Routes that already have a better chat surface of their own. */
const hiddenOn = ["/chat", "/dashboard", "/listener", "/sign-in", "/sign-up", "/forgot-password"];

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [teased, setTeased] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // `usePathname` isn't dependable during prerender, so the launcher is mounted
  // client-side only — otherwise it ships in the static HTML of routes that
  // exclude it and gets torn out again on hydration.
  React.useEffect(() => setMounted(true), []);

  // A single, quiet nudge after the visitor has had time to read something.
  React.useEffect(() => {
    const timer = window.setTimeout(() => setTeased(true), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!mounted) return null;
  if (hiddenOn.some((route) => pathname.startsWith(route))) return null;

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
            className="glass-strong fixed right-4 bottom-24 z-50 flex h-[min(32rem,72dvh)] w-[min(23rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl sm:right-6"
          >
            <ChatPanel variant="widget" onRequestClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed right-4 bottom-5 z-50 flex items-center gap-3 sm:right-6 sm:bottom-6">
        <AnimatePresence>
          {teased && !open && (
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="glass hidden max-w-[15rem] rounded-2xl px-4 py-2.5 text-xs leading-relaxed sm:block"
            >
              Someone&rsquo;s here right now if you want to talk.
            </motion.p>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Chat with a listener"}
          className={cn(
            "focus-visible:ring-ring/50 relative grid size-14 place-items-center rounded-full text-white shadow-[0_12px_36px_-10px_var(--brand-violet)] transition-transform outline-none focus-visible:ring-[3px] active:scale-95",
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
              {open ? (
                <X className="size-5.5" />
              ) : (
                <MessageSquareText className="size-5.5" />
              )}
            </motion.span>
          </AnimatePresence>

          {!open && (
            <>
              <span className="bg-success ring-background absolute top-1 right-1 size-3 rounded-full ring-2" />
              <span className="border-primary/40 animate-pulse-ring absolute inset-0 rounded-full border" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
