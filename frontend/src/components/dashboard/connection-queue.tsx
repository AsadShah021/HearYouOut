"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Mail, MessagesSquare, UserRoundCheck, X } from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  api,
  ApiError,
  type ConnectionRequest,
  type ConnectionStatus,
} from "@/lib/api";
import { easeOutExpo } from "@/lib/motion";
import { cn, formatRelativeDay } from "@/lib/utils";

const POLL_MS = 20000;

const statusTone: Record<ConnectionStatus, "warning" | "success" | "muted"> = {
  PENDING: "warning",
  ACCEPTED: "success",
  DECLINED: "muted",
};

/**
 * Members asking this listener to be theirs.
 *
 * Declining is presented as a normal, unremarkable choice — a listener at
 * capacity saying no is a better outcome than one who accepts and can't show up.
 */
export function ConnectionQueue() {
  const [requests, setRequests] = React.useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [declining, setDeclining] = React.useState<ConnectionRequest | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const { requests: list } = await api.get<{ requests: ConnectionRequest[] }>(
        "/api/connections",
      );
      setRequests(list);
    } catch (error) {
      if (!(error instanceof ApiError && error.isUnauthorized)) {
        toast.error("Couldn't load your requests.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  async function respond(request: ConnectionRequest, status: "ACCEPTED" | "DECLINED") {
    setBusyId(request.id);
    try {
      const { request: updated } = await api.patch<{ request: ConnectionRequest }>(
        `/api/connections/${request.id}`,
        { status },
      );
      setRequests((current) => current.map((r) => (r.id === updated.id ? updated : r)));

      toast.success(
        status === "ACCEPTED"
          ? `You're now ${request.member.name}'s listener`
          : `Declined — ${request.member.name} has been told`,
        status === "ACCEPTED"
          ? { description: "Their chat is assigned to you and appears under Mine." }
          : undefined,
      );
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save that.");
      throw error;
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading requests…
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const answered = requests.filter((r) => r.status !== "PENDING");

  return (
    <>
      {pending.length === 0 && answered.length === 0 ? (
        <div className="border-border/70 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
          <UserRoundCheck className="text-muted-foreground size-6" />
          <p className="text-sm font-medium">No requests yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            When a member picks you from the listeners page, their request lands
            here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Waiting on you ({pending.length})
              </h2>
              <div className="flex flex-col gap-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {pending.map((request) => (
                    <motion.article
                      key={request.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className="border-warning/35 bg-warning/[0.03] rounded-2xl border p-5"
                    >
                      <div className="flex flex-wrap items-start gap-4">
                        <ListenerAvatar name={request.member.name} size="md" />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold">{request.member.name}</p>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                          <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                            <Mail className="size-3" />
                            {request.member.email} · asked{" "}
                            {formatRelativeDay(request.createdAt).toLowerCase()}
                          </p>

                          {request.message && (
                            <p className="border-border/60 text-muted-foreground mt-3 border-l-2 pl-3 text-sm leading-relaxed whitespace-pre-wrap">
                              {request.message}
                            </p>
                          )}
                        </div>

                        <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:flex-col">
                          <Button
                            variant="gradient"
                            size="sm"
                            disabled={busyId === request.id}
                            onClick={() => void respond(request, "ACCEPTED")}
                          >
                            {busyId === request.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyId === request.id}
                            onClick={() => setDeclining(request)}
                          >
                            <X className="size-3.5" /> Decline
                          </Button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {answered.length > 0 && (
            <section>
              <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
                Answered
              </h2>
              <div className="flex flex-col gap-2.5">
                {answered.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "border-border/70 bg-card flex flex-wrap items-center gap-3 rounded-2xl border p-4",
                      request.status === "ACCEPTED" && "border-success/30",
                    )}
                  >
                    <ListenerAvatar name={request.member.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{request.member.name}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {request.respondedAt
                          ? formatRelativeDay(request.respondedAt)
                          : "—"}
                      </p>
                    </div>
                    <Badge variant={statusTone[request.status]}>
                      {request.status === "ACCEPTED" ? "Accepted" : "Declined"}
                    </Badge>
                    {request.status === "ACCEPTED" && (
                      <Button asChild size="sm" variant="ghost">
                        <a href="/listener/chats">
                          <MessagesSquare className="size-3.5" /> Open chat
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!declining}
        onOpenChange={(open) => !open && setDeclining(null)}
        title={`Decline ${declining?.member.name}?`}
        description="They'll be told you're not available, and can ask someone else or keep messaging the shared team."
        detail={
          <>
            Declining is a perfectly good answer. A listener at capacity saying no
            is better for the person than one who accepts and can&rsquo;t be
            there.
          </>
        }
        confirmLabel="Decline request"
        onConfirm={async () => {
          if (declining) await respond(declining, "DECLINED");
        }}
      />
    </>
  );
}
