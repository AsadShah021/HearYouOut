import Link from "next/link";
import { Clock3, Mail, MessageSquareText } from "lucide-react";

import { ModeBadge } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/lib/data/site";
import { formatIsoDay } from "@/lib/utils";
import type { MeetingRequest } from "@/types";

/** The member's view of a request that's with the team but not yet confirmed. */
export function PendingRequestCard({ request }: { request: MeetingRequest }) {
  return (
    <Card className="border-warning/30 bg-warning/[0.035] relative overflow-hidden p-5">
      <div
        aria-hidden
        className="bg-warning/10 pointer-events-none absolute -top-20 -right-14 size-52 rounded-full blur-3xl"
      />

      <div className="relative flex flex-wrap items-start gap-4">
        <span className="bg-warning/15 text-warning grid size-11 shrink-0 place-items-center rounded-xl">
          <Clock3 className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">Waiting for us to confirm a time</p>
            <ModeBadge mode={request.mode} />
            <Badge variant="warning">Pending</Badge>
          </div>

          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            {request.topic} · you offered{" "}
            {request.preferredDates.map((iso) => formatIsoDay(iso)).join(", ")}
          </p>

          <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
            <Mail className="size-3.5" />
            Reference <span className="font-mono">{request.reference}</span> · we
            reply within {site.requestResponseTime}
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/messages">
              <MessageSquareText className="size-3.5" /> Chat meanwhile
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
