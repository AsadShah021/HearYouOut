import Link from "next/link";
import { CalendarClock, MoreHorizontal, Video } from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { JoinButton } from "@/components/dashboard/join-button";
import { ModeBadge } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getListener } from "@/lib/data/listeners";
import { cn, formatDate, formatRelativeDay } from "@/lib/utils";
import type { Session } from "@/types";

export function SessionCard({
  session,
  featured = false,
  className,
}: {
  session: Session;
  /** The next session gets a larger, warmer treatment. */
  featured?: boolean;
  className?: string;
}) {
  const listener = getListener(session.listenerId);
  const startsAt = new Date(session.startsAt);
  const time = formatDate(startsAt, { hour: "numeric", minute: "2-digit" });
  const day = formatRelativeDay(startsAt);
  const isToday = day === "Today";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-5",
        featured && "border-primary/25 bg-primary/[0.03]",
        className,
      )}
    >
      {featured && (
        <div
          aria-hidden
          className="bg-primary/10 pointer-events-none absolute -top-20 -right-14 size-56 rounded-full blur-3xl"
        />
      )}

      <div className="relative flex items-start gap-4">
        <ListenerAvatar name={listener?.name ?? "Listener"} size={featured ? "lg" : "md"} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">{listener?.name}</p>
            <ModeBadge mode={session.mode} />
            {isToday && session.status === "upcoming" && (
              <Badge variant="success">Today</Badge>
            )}
          </div>

          <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
            {session.topic}
          </p>

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              {day} · {time}
            </span>
            <span>{session.durationMinutes} min</span>
            {listener && <span className="truncate">{listener.timezone}</span>}
          </div>
        </div>

        <Button size="icon-sm" variant="ghost" aria-label="Session options" className="shrink-0">
          <MoreHorizontal />
        </Button>
      </div>

      {session.status === "upcoming" && (
        <div className="relative mt-5 flex flex-wrap gap-2">
          <JoinButton
            mode={session.mode}
            meetUrl={session.meetUrl}
            listenerName={listener?.name ?? "your listener"}
            size={featured ? "default" : "sm"}
          />
          <Button variant="outline" size={featured ? "default" : "sm"} asChild>
            <Link href="/book">Reschedule</Link>
          </Button>
          {session.meetUrl && (
            <Button variant="ghost" size={featured ? "default" : "sm"} asChild>
              <Link href={session.meetUrl} target="_blank" rel="noopener noreferrer">
                <Video className="size-3.5" />
                Meet link
              </Link>
            </Button>
          )}
        </div>
      )}

      {session.status === "completed" && session.notes && (
        <div className="border-border/60 bg-muted/40 relative mt-4 rounded-xl border p-3.5">
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-medium">Session note · </span>
            {session.notes}
          </p>
        </div>
      )}
    </Card>
  );
}
