import { BellRing, CalendarClock, Clock3, Inbox } from "lucide-react";

import { PageHeader } from "@/components/dashboard/app-shell";
import { RequestQueue } from "@/components/dashboard/request-queue";
import { StatCard } from "@/components/dashboard/stat-card";
import { meetingRequests } from "@/lib/data/demo";
import { site } from "@/lib/data/site";

export default function RequestsPage() {
  const open = meetingRequests.filter(
    (request) => request.status === "new" || request.status === "reviewing",
  ).length;
  const urgent = meetingRequests.filter(
    (request) => request.urgency === "asap" && request.status !== "scheduled",
  ).length;

  return (
    <>
      <PageHeader
        title="Meeting requests"
        description="Every voice and Google Meet session starts here. Read it, pick a time from what they offered, and the invitation goes out."
        badge={open > 0 ? `${open} waiting` : "All clear"}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Waiting on us"
          value={`${open}`}
          hint={urgent > 0 ? `${urgent} marked as urgent` : "Nothing urgent"}
          icon={Inbox}
          tone="brand"
        />
        <StatCard
          label="Scheduled this week"
          value="11"
          icon={CalendarClock}
          trend={{ value: "+3", direction: "up" }}
        />
        <StatCard
          label="Median reply time"
          value="1h 12m"
          hint={`We promise ${site.requestResponseTime}`}
          icon={Clock3}
        />
        <StatCard
          label="Requests this month"
          value="47"
          hint="94% scheduled within promise"
          icon={BellRing}
        />
      </div>

      <RequestQueue />
    </>
  );
}
