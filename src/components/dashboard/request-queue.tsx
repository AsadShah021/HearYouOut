"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarClock,
  Check,
  Clock3,
  Loader2,
  EyeOff,
  LifeBuoy,
  Mail,
  MessageSquareQuote,
  MessageSquareText,
  Repeat,
  Phone,
  Send,
  ShieldAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { ModeBadge } from "@/components/shared/mode-badge";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { meetingRequests as seed } from "@/lib/data/demo";
import { listeners, listenerMap } from "@/lib/data/listeners";
import { serviceByTitle } from "@/lib/data/services";
import { easeOutExpo } from "@/lib/motion";
import {
  cn,
  formatDate,
  formatIsoDay,
  formatRelativeDay,
  formatSlot,
} from "@/lib/utils";
import type { MeetingRequest, RequestStatus } from "@/types";

const windowLabels: Record<string, string> = {
  early: "Early morning",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  late: "Late",
};

const urgencyTone: Record<string, "muted" | "warning" | "destructive"> = {
  flexible: "muted",
  "this-week": "warning",
  asap: "destructive",
};

const urgencyLabel: Record<string, string> = {
  flexible: "No rush",
  "this-week": "This week",
  asap: "ASAP",
};

const statusTone: Record<RequestStatus, "info" | "warning" | "success" | "muted"> = {
  new: "info",
  reviewing: "warning",
  scheduled: "success",
  declined: "muted",
};

const slotOptions = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

export function RequestQueue() {
  const [requests, setRequests] = React.useState<MeetingRequest[]>(seed);
  const [scheduling, setScheduling] = React.useState<MeetingRequest | null>(null);
  const [chosenDate, setChosenDate] = React.useState("");
  const [chosenTime, setChosenTime] = React.useState("");
  const [assignee, setAssignee] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [filter, setFilter] = React.useState<"open" | "all">("open");

  const visible = requests.filter((request) =>
    filter === "open" ? request.status === "new" || request.status === "reviewing" : true,
  );
  const openCount = requests.filter(
    (r) => r.status === "new" || r.status === "reviewing",
  ).length;

  function openScheduler(request: MeetingRequest) {
    setScheduling(request);
    setChosenDate(request.preferredDates[0] ?? "");
    setChosenTime("");
    setAssignee(request.preferredListenerId ?? listeners[0].id);
  }

  async function confirmSchedule() {
    if (!scheduling || !chosenDate || !chosenTime) return;
    setSaving(true);

    // Front-end only: this is where you'd create the session, generate the Meet
    // link and send the calendar invitation to both sides.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((current) =>
      current.map((request) =>
        request.id === scheduling.id
          ? {
              ...request,
              status: "scheduled" as const,
              scheduledFor: `${chosenDate}T${chosenTime}:00`,
              preferredListenerId: assignee,
            }
          : request,
      ),
    );
    setSaving(false);
    setScheduling(null);
    toast.success(
      `Confirmed with ${scheduling.anonymous ? "anonymous member" : scheduling.name}`,
      {
        description: "Calendar invitation and Google Meet link sent to both of you.",
      },
    );
  }

  function markReviewing(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id && request.status === "new"
          ? { ...request, status: "reviewing" as const }
          : request,
      ),
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
              {option === "open" ? `Needs action (${openCount})` : `All (${requests.length})`}
            </button>
          ))}
        </div>

        {openCount > 0 && (
          <p className="text-muted-foreground text-xs">
            Oldest has been waiting{" "}
            {formatRelativeDay(
              requests.find((r) => r.status !== "scheduled")?.submittedAt ?? new Date(),
            ).toLowerCase()}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((request) => {
            const preferred = request.preferredListenerId
              ? listenerMap[request.preferredListenerId]
              : undefined;
            // Topics where listening alone may not be enough — the listener
            // needs to know before they open the session, not during it.
            const needsReferralCheck = serviceByTitle[request.topic]?.escalation;

            return (
              <motion.article
                key={request.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
                onMouseEnter={() => markReviewing(request.id)}
                className={cn(
                  "border-border/70 bg-card rounded-2xl border p-5 transition-colors",
                  request.status === "new" && "border-info/35 bg-info/[0.03]",
                )}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <ListenerAvatar
                    name={request.anonymous ? "Anonymous" : request.name}
                    size="md"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">
                        {request.anonymous ? "Anonymous member" : request.name}
                      </p>
                      <ModeBadge mode={request.mode} />
                      <Badge variant={statusTone[request.status]}>
                        {request.status === "new" ? "New" : request.status === "reviewing" ? "Reviewing" : "Scheduled"}
                      </Badge>
                      <Badge variant={urgencyTone[request.urgency]}>
                        {urgencyLabel[request.urgency]}
                      </Badge>
                      {request.isReturning && <Badge variant="muted">Returning</Badge>}
                      {request.cadence && (
                        <Badge variant="brand">
                          <Repeat className="size-3" />
                          {request.cadence === "weekly" ? "Weekly" : "Fortnightly"}
                        </Badge>
                      )}
                      {request.feedbackMode && (
                        <Badge variant="info">
                          <MessageSquareQuote className="size-3" /> Wants feedback
                        </Badge>
                      )}
                      {request.anonymous && (
                        <Badge variant="warning">
                          <EyeOff className="size-3" /> Anonymous
                        </Badge>
                      )}
                      {needsReferralCheck && (
                        <Badge variant="destructive">
                          <ShieldAlert className="size-3" /> Referral check
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mt-1.5 text-xs">
                      <span className="font-mono">{request.reference}</span> ·{" "}
                      {request.topic} · submitted{" "}
                      {formatRelativeDay(request.submittedAt).toLowerCase()} at{" "}
                      {formatDate(request.submittedAt, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>

                    {request.context && (
                      <p className="border-border/60 text-muted-foreground mt-3 border-l-2 pl-3 text-sm leading-relaxed">
                        {request.context}
                      </p>
                    )}

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground text-[0.6875rem]">
                          Days offered
                        </dt>
                        <dd className="mt-1 flex flex-wrap gap-1.5">
                          {request.preferredDates.map((iso) => (
                            <Badge key={iso} variant="outline" className="font-normal">
                              {formatIsoDay(iso)}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground text-[0.6875rem]">
                          Times that work
                        </dt>
                        <dd className="mt-1 flex flex-wrap gap-1.5">
                          {request.preferredWindows.map((window) => (
                            <Badge key={window} variant="outline" className="font-normal">
                              {windowLabels[window]}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    </dl>

                    <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        {request.email}
                      </span>
                      {request.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3.5" />
                          {request.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />
                        {request.timezone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        {preferred ? `Asked for ${preferred.name}` : "No preference"}
                      </span>
                    </div>

                    {request.status === "scheduled" && request.scheduledFor && (
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
                    {request.status !== "scheduled" ? (
                      <>
                        <Button
                          variant="gradient"
                          size="sm"
                          onClick={() => openScheduler(request)}
                        >
                          <CalendarClock className="size-3.5" /> Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquareText className="size-3.5" /> Reply
                        </Button>
                        {needsReferralCheck && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toast.info("Specialist referral list opened", {
                                description:
                                  "Send the organisations for their region alongside the confirmation.",
                              })
                            }
                          >
                            <LifeBuoy className="size-3.5" /> Refer
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        <Check className="size-3.5" /> Scheduled
                      </Button>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>

        {visible.length === 0 && (
          <div className="border-border/70 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-14 text-center">
            <CalendarCheck className="text-success size-6" />
            <p className="text-sm font-medium">Queue is clear</p>
            <p className="text-muted-foreground max-w-xs text-sm">
              Every request has a confirmed time. New ones land here the moment
              someone submits the form.
            </p>
          </div>
        )}
      </div>

      {/* Scheduling dialog */}
      <Dialog open={!!scheduling} onOpenChange={(open) => !open && setScheduling(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm a time</DialogTitle>
            <DialogDescription>
              {scheduling &&
                `${scheduling.anonymous ? "This member" : scheduling.name} offered ${scheduling.preferredDates.length} ${scheduling.preferredDates.length === 1 ? "day" : "days"} in ${scheduling.timezone}.`}
            </DialogDescription>
          </DialogHeader>

          {scheduling && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-date">Day</Label>
                <Select value={chosenDate} onValueChange={setChosenDate}>
                  <SelectTrigger id="sched-date">
                    <SelectValue placeholder="Pick one of their days" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduling.preferredDates.map((iso) => (
                      <SelectItem key={iso} value={iso}>
                        {formatIsoDay(iso, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-time">Time ({scheduling.timezone})</Label>
                <Select value={chosenTime} onValueChange={setChosenTime}>
                  <SelectTrigger id="sched-time">
                    <SelectValue placeholder="Pick a start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {slotOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatSlot(time)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  They asked for{" "}
                  {scheduling.preferredWindows
                    .map((w) => windowLabels[w].toLowerCase())
                    .join(" or ")}
                  .
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-listener">Listener</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger id="sched-listener">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {listeners
                      .filter((l) => l.modes.includes(scheduling.mode))
                      .map((listener) => (
                        <SelectItem key={listener.id} value={listener.id}>
                          {listener.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="sched-note">Note in the confirmation email</Label>
                <Textarea
                  id="sched-note"
                  rows={3}
                  defaultValue={`Looking forward to it — there's nothing you need to prepare.`}
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
              onClick={confirmSchedule}
              disabled={!chosenDate || !chosenTime || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Confirm & send invite
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
