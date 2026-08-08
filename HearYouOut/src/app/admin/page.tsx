"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Inbox,
  Loader2,
  MessagesSquare,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { PageHeader } from "@/components/dashboard/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, ApiError, type AdminAttention, type AdminStats } from "@/lib/api";
import { formatRelativeDay } from "@/lib/utils";

const POLL_MS = 15000;

export default function AdminOverviewPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [attention, setAttention] = React.useState<AdminAttention | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [s, a] = await Promise.all([
          api.get<{ stats: AdminStats }>("/api/admin/stats"),
          api.get<AdminAttention>("/api/admin/attention"),
        ]);
        if (cancelled) return;
        setStats(s.stats);
        setAttention(a);
      } catch (error) {
        if (!cancelled && !(error instanceof ApiError && error.isUnauthorized)) {
          toast.error("Couldn't load the overview.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  const openTickets = attention?.requests.length ?? 0;
  const waitingChats = attention?.chats.length ?? 0;
  const clear = openTickets === 0 && waitingChats === 0;

  return (
    <>
      <PageHeader
        title="Admin overview"
        description={
          clear
            ? "Nothing is waiting on you right now."
            : `${openTickets + waitingChats} ${openTickets + waitingChats === 1 ? "item needs" : "items need"} your attention.`
        }
        badge={clear ? "All clear" : "Needs action"}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Open tickets"
          value={`${stats?.requests.open ?? 0}`}
          hint={`${stats?.requests.scheduled ?? 0} scheduled`}
          icon={Inbox}
          tone="brand"
        />
        <StatCard
          label="Chats waiting"
          value={`${stats?.chats.waiting ?? 0}`}
          hint={`${stats?.chats.messages ?? 0} messages total`}
          icon={MessagesSquare}
        />
        <StatCard
          label="Members"
          value={`${stats?.users.members ?? 0}`}
          hint={`${stats?.users.listeners ?? 0} listeners · ${stats?.users.admins ?? 0} admins`}
          icon={Users}
        />
        <StatCard
          label="New this week"
          value={`${stats?.users.newThisWeek ?? 0}`}
          hint="Accounts created"
          icon={UserPlus}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Tickets */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Inbox className="text-muted-foreground size-4" />
              Meeting tickets
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/tickets">
                Open queue <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {attention?.requests.length === 0 ? (
              <p className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
                <CalendarCheck className="text-success size-4" />
                Every ticket has a confirmed time.
              </p>
            ) : (
              attention?.requests.map((request) => (
                <Link
                  key={request.id}
                  href="/admin/tickets"
                  className="border-border/60 hover:border-primary/25 flex items-start gap-3 rounded-2xl border p-3.5 transition-colors"
                >
                  <ListenerAvatar name={request.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{request.name}</p>
                      <Badge variant={request.status === "NEW" ? "info" : "warning"}>
                        {request.status === "NEW" ? "New" : "Reviewing"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                      {request.topic}
                    </p>
                    <p className="text-muted-foreground mt-1.5 font-mono text-[0.625rem]">
                      {request.reference} · {formatRelativeDay(request.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chats */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="text-muted-foreground size-4" />
              Waiting for a reply
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/messages">
                Open inbox <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {attention?.chats.length === 0 ? (
              <p className="text-muted-foreground py-6 text-sm">
                Nobody is waiting on a reply.
              </p>
            ) : (
              attention?.chats.map((chat) => (
                <Link
                  key={chat.id}
                  href="/admin/messages"
                  className="border-warning/30 bg-warning/[0.04] hover:border-warning/50 flex items-start gap-3 rounded-2xl border p-3.5 transition-colors"
                >
                  <ListenerAvatar name={chat.member.name} size="sm" online />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{chat.member.name}</p>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                      {chat.messages[0]?.body ?? "No messages yet"}
                    </p>
                    <p className="text-muted-foreground mt-1.5 text-[0.625rem]">
                      Waiting since {formatRelativeDay(chat.lastMessageAt).toLowerCase()}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
