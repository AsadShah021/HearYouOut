import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { JoinButton } from "@/components/dashboard/join-button";
import { ModeBadge } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatRelativeDay } from "@/lib/utils";
import type { Appointment } from "@/types";

export function AppointmentRow({
  appointment,
  featured = false,
}: {
  appointment: Appointment;
  featured?: boolean;
}) {
  const startsAt = new Date(appointment.startsAt);

  return (
    <Card className={cn("p-5", featured && "border-primary/25 bg-primary/[0.03]")}>
      <div className="flex flex-wrap items-start gap-4">
        <ListenerAvatar name={appointment.clientName} size={featured ? "lg" : "md"} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{appointment.clientName}</p>
            <ModeBadge mode={appointment.mode} />
            {appointment.isNewClient && (
              <Badge variant="warning">
                <Sparkles className="size-3" /> First session
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            {appointment.topic}
          </p>

          <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              {formatRelativeDay(startsAt)} ·{" "}
              {formatDate(startsAt, { hour: "numeric", minute: "2-digit" })}
            </span>
            <span>{appointment.durationMinutes} min</span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
          <JoinButton
            mode={appointment.mode}
            meetUrl={appointment.meetUrl}
            listenerName={appointment.clientName}
            size={featured ? "default" : "sm"}
          />
          <Button asChild variant="outline" size={featured ? "default" : "sm"}>
            <Link href="/listener/clients">Client notes</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
