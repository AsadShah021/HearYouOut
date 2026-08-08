"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Listener } from "@/types";

/**
 * A listener's 30–60s self-introduction.
 *
 * Nothing loads until the visitor asks for it (`preload="none"`, poster only),
 * so a page with a video on it costs the same as one without until it's played.
 * Renders nothing at all when the listener has no video, which is how the other
 * eight profiles behave until their files exist.
 */
export function IntroVideo({
  listener,
  className,
}: {
  listener: Listener;
  className?: string;
}) {
  const [started, setStarted] = React.useState(false);
  const [unavailable, setUnavailable] = React.useState(false);
  const [transcriptOpen, setTranscriptOpen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  if (!listener.introVideo || unavailable) return null;

  const firstName = listener.name.split(" ")[0];
  const captions = listener.introVideo.replace(/\.mp4$/, ".vtt");

  function play() {
    setStarted(true);
    // The element mounts with the poster; kick playback once React has it.
    window.setTimeout(() => videoRef.current?.play().catch(() => {}), 0);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="border-border/70 bg-muted relative aspect-4/5 overflow-hidden rounded-3xl border">
        <video
          ref={videoRef}
          src={listener.introVideo}
          poster={listener.introPoster}
          preload="none"
          controls={started}
          playsInline
          onError={() => setUnavailable(true)}
          className="size-full object-cover"
          aria-label={`${firstName} introduces themselves`}
        >
          <track kind="captions" srcLang="en" label="English" src={captions} default />
        </video>

        {!started && (
          <motion.button
            type="button"
            onClick={play}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="group absolute inset-0 grid place-items-center bg-black/25 transition-colors hover:bg-black/35 focus-visible:ring-[3px] focus-visible:ring-white/60 focus-visible:outline-none"
            aria-label={`Play ${firstName}'s introduction`}
          >
            <span className="grid size-16 place-items-center rounded-full bg-white/95 text-black shadow-lg transition-transform group-hover:scale-105 group-active:scale-95">
              <Play className="ml-0.5 size-6 fill-current" />
            </span>

            <span className="absolute bottom-4 left-4 flex items-center gap-2">
              <Badge variant="brand">Hear from {firstName}</Badge>
              <span className="rounded-full bg-black/55 px-2 py-1 text-[0.625rem] font-medium text-white">
                About a minute
              </span>
            </span>
          </motion.button>
        )}
      </div>

      {listener.introTranscript && (
        <div className="border-border/60 rounded-2xl border">
          <button
            type="button"
            onClick={() => setTranscriptOpen((open) => !open)}
            aria-expanded={transcriptOpen}
            className="hover:text-foreground text-muted-foreground focus-visible:ring-ring/40 flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-xs font-medium transition-colors outline-none focus-visible:ring-[3px]"
          >
            Read the transcript instead
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                transcriptOpen && "rotate-180",
              )}
            />
          </button>
          {transcriptOpen && (
            <p className="text-muted-foreground border-border/60 border-t px-4 py-3.5 text-sm leading-relaxed">
              {listener.introTranscript}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
