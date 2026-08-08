"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarClock,
  Check,
  Clock3,
  Loader2,
  Mail,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  api,
  ApiError,
  type ApiMeetingRequest,
  type RequestStatus,
} from "@/lib/api";
import { easeOutExpo } from "@/lib/motion";
import { cn, formatDate, formatRelativeDay } from "@/lib/utils";

const statusTone: Record<RequestStatus, "info" | "warning" | "success" | "muted"> = {
  NEW: "info",
  REVIEWING: "warning",
  SCHEDULED: "success",
  DECLINED: "muted",
};

const statusLabel: Record<RequestStatus, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SCHEDULED: "Scheduled",
  DECLINED: "Declined",
};

/** `datetime-local` wants `YYYY-MM-DDTHH:mm` in local time. */
function defaultSlot() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function RequestQueue() {
  const [requests, setRequests] = React.useState<ApiMeetingRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"open" | "all">("open");

  const [scheduling, setScheduling] = React.useState<ApiMeetingRequest | null>(null);
  const [slot, setSlot] = React.useState(defaultSlot);
  const [meetUrl, setMeetUrl] = React.useState("https://meet.google.com/");
  const [note, setNote] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const { requests: list } = await api.get<{ requests: ApiMeetingRequest[] }>(
        "/api/requests",
      );
      setRequests(list);
    } catch (error) {
      if (!(error instanceof ApiError && error.isUnauthorized)) {
        toast.error(
          error instanceof ApiError ? error.message : "Couldn't load the queue.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const visible = requests.filter((r) =>
    filter === "open" ? r.status === "NEW" || r.status === "REVIEWING" : true,
  );
  const openCount = requests.filter(
    (r) => r.status === "NEW" || r.status === "REVIEWING",
  ).length;

  function openScheduler(request: ApiMeetingRequest) {
    setScheduling(request);
    setSlot(defaultSlot());
    setMeetUrl("https://meet.google.com/");
    setNote("");
  }

  async function patch(id: string, data: Record<string, unknown>, success: string) {
    setSaving(true);
    try {
      const { request } = await api.patch<{ request: ApiMeetingRequest }>(
        `/api/requests/${id}`,
        data,
      );
      setRequests((current) => current.map((r) => (r.id === id ? request : r)));
      setScheduling(null);
      toast.success(success);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Couldn't save that. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading the queue…
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="bg-muted/70 inline-flex rounded-full p-1">
          {(["open", "all"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "focus-visible:ring-ring/50 h-8 rounded-full px-4 text-xs font-medium transition-colors outline-none focus-visible:ring-[3px]",
                filter === option
                  ? "bg-card text-foreground shadow-[0_1px_2px_rgba(16,16,32,0.06)]"
                  : "text-muted-foreground",
              )}
            >
              {option === "open"
                ? `Needs action (${openCount})`
                : `All (${requests.length})`}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((request) => (
            <motion.article
              key={request.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className={cn(
                "border-border/70 bg-card rounded-2xl border p-5 transition-colors",
                request.status === "NEW" && "border-info/35 bg-info/[0.03]",
              )}
            >
              <div className="flex flex-wrap items-start gap-4">
                <ListenerAvatar name={request.name} size="md" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{request.name}</p>
                    <Badge variant={statusTone[request.status]}>
                      {statusLabel[request.status]}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mt-1.5 text-xs">
                    <span className="font-mono">{request.reference}</span> · submitted{" "}
                    {formatRelativeDay(request.createdAt).toLowerCase()} at{" "}
                    {formatDate(request.createdAt, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="border-border/60 text-muted-foreground mt-3 border-l-2 pl-3 text-sm leading-relaxed whitespace-pre-wrap">
                    {request.topic}
                  </p>

                  <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {request.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" />
                      {request.assignedListener
                        ? request.assignedListener.name
                        : "Unassigned"}
                    </span>
                  </div>

                  {request.status === "SCHEDULED" && request.scheduledFor && (
                    <p className="border-success/25 bg-success/[0.05] text-success mt-4 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium">
                      <CalendarCheck className="size-3.5" />
                      Confirmed for{" "}
                      {formatDate(request.scheduledFor, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:flex-col">
                  {request.status !== "SCHEDULED" ? (
                    <>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => openScheduler(request)}
                      >
                        <CalendarClock className="size-3.5" /> Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={saving}
                        onClick={() =>
                          void patch(request.id, { status: "DECLINED" }, "Request declined")
                        }
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Check className="size-3.5" /> Scheduled
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="border-border/70 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
            <CalendarCheck className="text-success size-6" />
            <p className="text-sm font-medium">Queue is clear</p>
            <p className="text-muted-foreground max-w-xs text-sm">
              New requests land here the moment someone submits the form.
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!scheduling} onOpenChange={(open) => !open && setScheduling(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm a time</DialogTitle>
            <DialogDescription>
              {scheduling && `We'll email ${scheduling.name} at ${scheduling.email}.`}
            </DialogDescription>
          </DialogHeader>

          {scheduling && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-when">Date and time</Label>
                <Input
                  id="sched-when"
                  type="datetime-local"
                  value={slot}
                  onChange={(event) => setSlot(event.target.value)}
                />
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Clock3 className="size-3" /> In your local timezone.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-url">Google Meet link</Label>
                <Input
                  id="sched-url"
                  type="url"
                  value={meetUrl}
                  onChange={(event) => setMeetUrl(event.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-note">Internal note (optional)</Label>
                <Textarea
                  id="sched-note"
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Anything the listener should know before the call."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setScheduling(null)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              disabled={!slot || saving}
              onClick={() =>
                scheduling &&
                void patch(
                  scheduling.id,
                  {
                    status: "SCHEDULED",
                    scheduledFor: new Date(slot).toISOString(),
                    ...(meetUrl && meetUrl !== "https://meet.google.com/"
                      ? { meetUrl }
                      : {}),
                    ...(note ? { internalNote: note } : {}),
                  },
                  `Confirmed with ${scheduling.name}`,
                )
              }
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
