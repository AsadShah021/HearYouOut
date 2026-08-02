"use client";

import { Loader2, MessageSquareText, Mic, Video } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SessionMode } from "@/types";

/**
 * Joining differs by format: Meet sessions open the invite link, in-app formats
 * hand off to the conversation surface. Front-end only for now.
 */
export function JoinButton({
  mode,
  meetUrl,
  listenerName,
  size = "sm",
}: {
  mode: SessionMode;
  meetUrl?: string;
  listenerName: string;
  size?: "sm" | "default";
}) {
  const [joining, setJoining] = React.useState(false);

  const isMeet = mode === "meet-audio" || mode === "meet-video";
  const Icon = mode === "text" ? MessageSquareText : isMeet ? Video : Mic;
  const label = isMeet ? "Join Google Meet" : mode === "text" ? "Open chat" : "Join call";

  async function join() {
    if (isMeet && meetUrl) {
      window.open(meetUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setJoining(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setJoining(false);
    toast.success(`Connecting you to ${listenerName}`, {
      description: "Your room is ready — audio starts muted.",
    });
  }

  return (
    <Button variant="gradient" size={size} onClick={join} disabled={joining}>
      {joining ? <Loader2 className="size-3.5 animate-spin" /> : <Icon className="size-3.5" />}
      {label}
    </Button>
  );
}
