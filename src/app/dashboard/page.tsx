import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock3,
  Lightbulb,
  MessagesSquare,
  NotebookPen,
  Sparkles,
} from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { PageHeader } from "@/components/dashboard/app-shell";
import { SessionCard } from "@/components/dashboard/session-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ModeBadge } from "@/components/shared/mode-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PendingRequestCard } from "@/components/dashboard/pending-request-card";
import {
  conversations,
  ideas,
  meetingRequests,
  notes,
  upcomingSessions,
  usage,
} from "@/lib/data/demo";
import { getListener, listeners } from "@/lib/data/listeners";
import { planMap } from "@/lib/data/plans";
import { formatDate, formatRelativeDay } from "@/lib/utils";

export default function DashboardPage() {
  const [nextSession, ...laterSessions] = upcomingSessions;
  const plan = planMap[usage.planId];
  const remaining =
    usage.sessionsIncluded === "unlimited"
      ? "∞"
      : `${usage.sessionsIncluded - usage.sessionsUsed}`;
  const usagePercent =
    usage.sessionsIncluded === "unlimited"
      ? 100
      : Math.round((usage.sessionsUsed / usage.sessionsIncluded) * 100);
  const renewsInDays = Math.max(
    0,
    Math.ceil((new Date(usage.cycleRenewsAt).getTime() - Date.now()) / 86_400_000),
  );
  const favourites = listeners.filter((listener) => listener.favourite);
  const pendingRequest = meetingRequests.find(
    (request) => request.status === "new" || request.status === "reviewing",
  );

  return (
    <>
      <PageHeader
        title="Good to see you, Jordan"
        description="One session today, two unread messages, and a request still with the team."
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/dashboard/messages">
                <MessagesSquare className="size-4" /> Chat with us
              </Link>
            </Button>
            <Button asChild variant="gradient">
              <Link href="/book">
                Request a meeting <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Next up */}
          <div>
            <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
              Next up
            </h2>
            <SessionCard session={nextSession} featured />
          </div>

          {pendingRequest && (
            <div>
              <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Requested, not yet confirmed
              </h2>
              <PendingRequestCard request={pendingRequest} />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Sessions left this month"
              value={remaining}
              hint={`Renews in ${renewsInDays} days`}
              icon={CalendarCheck}
              tone="brand"
            />
            <StatCard
              label="Minutes talked"
              value={`${usage.minutesTalked}`}
              hint="Across 4 sessions this cycle"
              icon={Clock3}
              trend={{ value: "+18%", direction: "up" }}
            />
          </div>

          {/* Later this week */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Coming up</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/sessions">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {laterSessions.map((session) => {
                const listener = getListener(session.listenerId);
                const startsAt = new Date(session.startsAt);
                return (
                  <div
                    key={session.id}
                    className="border-border/60 hover:border-primary/25 flex items-center gap-3.5 rounded-2xl border p-3.5 transition-colors"
                  >
                    <ListenerAvatar name={listener?.name ?? "Listener"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{listener?.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {session.topic}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-xs font-medium">{formatRelativeDay(startsAt)}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatDate(startsAt, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <ModeBadge mode={session.mode} showLabel={false} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <NotebookPen className="text-muted-foreground size-4" />
                Recent notes
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/notes">All notes</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {notes.slice(0, 2).map((note) => (
                <Link
                  key={note.id}
                  href="/dashboard/notes"
                  className="border-border/60 hover:border-primary/25 flex flex-col gap-2 rounded-2xl border p-4 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={note.author === "listener" ? "brand" : "muted"}>
                      {note.author === "listener" ? "From listener" : "My note"}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatRelativeDay(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
                    {note.excerpt}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{plan.name}</p>
                  <p className="text-muted-foreground text-xs">
                    ${plan.priceMonthly}/month
                  </p>
                </div>
                <Badge variant="brand">
                  <Sparkles className="size-3" /> Active
                </Badge>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Live sessions</span>
                  <span className="font-semibold tabular-nums">
                    {usage.sessionsUsed} / {usage.sessionsIncluded}
                  </span>
                </div>
                <Progress value={usagePercent} />
              </div>

              <dl className="border-border/60 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
                <div>
                  <dt className="text-muted-foreground">Messages sent</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    {usage.messagesUsed}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Renews</dt>
                  <dd className="mt-0.5 font-semibold">
                    {formatDate(usage.cycleRenewsAt, { month: "short", day: "numeric" })}
                  </dd>
                </div>
              </dl>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/subscription">Manage subscription</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="text-muted-foreground size-4" />
                Active chats
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/messages">Open</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {conversations.slice(0, 3).map((conversation) => {
                const listener = getListener(conversation.listenerId);
                return (
                  <Link
                    key={conversation.id}
                    href="/dashboard/messages"
                    className="hover:bg-muted/60 flex items-start gap-3 rounded-xl p-2.5 transition-colors"
                  >
                    <ListenerAvatar name={listener?.name ?? "Listener"} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-medium">{listener?.name}</p>
                        {conversation.unread > 0 && (
                          <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-muted-foreground size-4" />
                Saved ideas
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/ideas">All</Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {ideas.slice(0, 3).map((idea) => (
                <Link
                  key={idea.id}
                  href="/dashboard/ideas"
                  className="border-border/60 hover:border-primary/25 rounded-xl border p-3 transition-colors"
                >
                  <p className="truncate text-xs font-medium">{idea.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={idea.confidence} className="h-1" />
                    <span className="text-muted-foreground shrink-0 text-[0.625rem] tabular-nums">
                      {idea.confidence}%
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favourite listeners</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {favourites.map((listener) => (
                <div key={listener.id} className="flex items-center gap-3">
                  <ListenerAvatar name={listener.name} size="sm" online />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{listener.name}</p>
                    <p className="text-muted-foreground truncate text-[0.6875rem]">
                      {listener.nextAvailable}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="subtle">
                    <Link href={`/book?listener=${listener.id}`}>Request</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
