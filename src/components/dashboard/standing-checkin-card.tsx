import Link from "next/link";
import { Flame, Repeat, Video } from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getListener } from "@/lib/data/listeners";
import { cn, formatDate } from "@/lib/utils";

/**
 * The recurring 15-minute accountability slot. Deliberately shows the streak as
 * a count of weeks *attended* rather than a chain that "breaks" — the service
 * promise is that missing a week costs you nothing.
 */
export function StandingCheckinCard({
  listenerId,
  nextAt,
  weeksHeld,
  className,
}: {
  listenerId: string;
  nextAt: string;
  weeksHeld: number;
  className?: string;
}) {
  const listener = getListener(listenerId);

  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div
        aria-hidden
        className="bg-brand-amber/10 pointer-events-none absolute -top-16 -right-10 size-44 rounded-full blur-3xl"
      />

      <div className="relative flex flex-wrap items-start gap-4">
        <ListenerAvatar
          name={listener?.name ?? "Listener"}
          src={listener?.avatar}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">Standing check-in</p>
            <Badge variant="brand">
              <Repeat className="size-3" /> Every week
            </Badge>
            <Badge variant="muted">15 min</Badge>
          </div>

          <p className="text-muted-foreground mt-1.5 text-sm">
            With {listener?.name} ·{" "}
            {formatDate(nextAt, {
              weekday: "long",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>

          <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
            <Flame className="text-brand-amber size-3.5" />
            {weeksHeld} weeks held so far — missing one costs you nothing.
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Button size="sm" variant="outline">
            <Video className="size-3.5" /> Join
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/sessions">Manage</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
