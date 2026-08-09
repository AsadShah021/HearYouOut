"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  Clock3,
  Globe2,
  Loader2,
  MessagesSquare,
  Send,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { PageHeader } from "@/components/dashboard/app-shell";
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
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError, type ConnectionStatus, type ListenerCard } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusCopy: Record<ConnectionStatus, { label: string; tone: "warning" | "success" | "muted" }> = {
  PENDING: { label: "Request sent", tone: "warning" },
  ACCEPTED: { label: "Your listener", tone: "success" },
  DECLINED: { label: "Not available", tone: "muted" },
};

export default function ChooseListenerPage() {
  const [listeners, setListeners] = React.useState<ListenerCard[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [asking, setAsking] = React.useState<ListenerCard | null>(null);
  const [note, setNote] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const { listeners: list } = await api.get<{ listeners: ListenerCard[] }>(
        "/api/connections/listeners",
      );
      setListeners(list);
    } catch (error) {
      if (!(error instanceof ApiError && error.isUnauthorized)) {
        toast.error("Couldn't load the listeners.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function send() {
    if (!asking) return;
    setSending(true);
    try {
      await api.post("/api/connections", {
        listenerId: asking.id,
        message: note.trim() || undefined,
      });
      toast.success(`Request sent to ${asking.name}`, {
        description: "They'll let you know shortly. You can still chat with the team meanwhile.",
      });
      setAsking(null);
      setNote("");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't send that request.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading listeners…
      </div>
    );
  }

  const accepted = listeners.find((l) => l.requestStatus === "ACCEPTED");

  return (
    <>
      <PageHeader
        title="Choose a listener"
        description="Ask someone specific to be yours. They'll see your request and reply — until then, you can still message the team."
        badge={accepted ? `Your listener: ${accepted.name}` : undefined}
      />

      {listeners.length === 0 ? (
        <div className="border-border/70 rounded-2xl border border-dashed p-14 text-center">
          <p className="text-sm font-medium">No listeners yet</p>
          <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">
            Nobody has been set up as a listener. In the meantime,{" "}
            <Link href="/chat" className="text-foreground underline underline-offset-4">
              message the team
            </Link>{" "}
            — someone will answer.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listeners.map((listener) => {
            const profile = listener.listenerProfile;
            const status = listener.requestStatus;

            return (
              <article
                key={listener.id}
                className={cn(
                  "border-border/70 bg-card flex h-full flex-col gap-4 rounded-3xl border p-6 transition-colors",
                  status === "ACCEPTED" && "border-success/40 bg-success/[0.03]",
                )}
              >
                <div className="flex items-start gap-3.5">
                  <ListenerAvatar
                    name={listener.name}
                    size="lg"
                    online={profile?.isOnShift}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{listener.name}</p>
                    {profile?.headline && (
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
                        {profile.headline}
                      </p>
                    )}
                  </div>
                  {status && (
                    <Badge variant={statusCopy[status].tone}>{statusCopy[status].label}</Badge>
                  )}
                </div>

                {profile?.bio && (
                  <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {profile && (profile.specialties?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="muted" className="font-normal">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                {profile && (
                  <dl className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                    {profile.timezone && (
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />
                        <dd>{profile.timezone}</dd>
                      </div>
                    )}
                    {(profile.languages?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Globe2 className="size-3.5" />
                        <dd>{profile.languages.join(", ")}</dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="mt-auto pt-1">
                  {status === "ACCEPTED" ? (
                    <Button asChild variant="gradient" size="sm" className="w-full">
                      <Link href="/chat">
                        <MessagesSquare className="size-3.5" /> Message {listener.name.split(" ")[0]}
                      </Link>
                    </Button>
                  ) : status === "PENDING" ? (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Check className="size-3.5" /> Waiting for a reply
                    </Button>
                  ) : (
                    <Button
                      variant={status === "DECLINED" ? "outline" : "gradient"}
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setAsking(listener);
                        setNote("");
                      }}
                    >
                      <UserRoundCheck className="size-3.5" />
                      {status === "DECLINED" ? "Ask again" : "Ask to connect"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={!!asking} onOpenChange={(open) => !open && setAsking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ask {asking?.name} to be your listener</DialogTitle>
            <DialogDescription>
              They&rsquo;ll see your request and either accept or let you know
              they&rsquo;re at capacity. Either way you&rsquo;ll hear back.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="connect-note">
              Anything you&rsquo;d like to say?{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="connect-note"
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What you'd like to talk about, or why you picked them. A sentence is plenty."
            />
            <p className="text-muted-foreground text-xs">Only they will read this.</p>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setAsking(null)} disabled={sending}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={() => void send()} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" /> Send request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
