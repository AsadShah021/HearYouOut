"use client";

import * as React from "react";
import { Loader2, UserRoundCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, ApiError, type AdminListener } from "@/lib/api";

const UNASSIGNED = "__none__";

/**
 * Give a member a named listener.
 *
 * Assigning creates the member's conversation if they've never opened chat, so
 * continuity can be set up before their first message rather than after.
 */
export function AssignListener({
  memberId,
  memberName,
  currentListenerId,
  onAssigned,
}: {
  memberId: string;
  memberName: string;
  currentListenerId: string | null;
  onAssigned: (listener: { id: string; name: string } | null) => void;
}) {
  const [listeners, setListeners] = React.useState<AdminListener[]>([]);
  const [selected, setSelected] = React.useState(currentListenerId ?? UNASSIGNED);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const { listeners: list } = await api.get<{ listeners: AdminListener[] }>(
          "/api/admin/listeners",
        );
        setListeners(list);
      } catch {
        // The select just stays empty; the page is still usable.
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const { conversation } = await api.patch<{
        conversation: { assignedListener: { id: string; name: string } | null };
      }>(`/api/admin/users/${memberId}/listener`, {
        listenerId: selected === UNASSIGNED ? null : selected,
      });

      onAssigned(conversation.assignedListener);
      toast.success(
        conversation.assignedListener
          ? `${conversation.assignedListener.name} is now ${memberName}'s listener`
          : `${memberName} is back in the shared queue`,
      );
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save that.");
    } finally {
      setSaving(false);
    }
  }

  const changed = selected !== (currentListenerId ?? UNASSIGNED);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRoundCheck className="text-muted-foreground size-4" />
          Assigned listener
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="assign-listener" className="sr-only">
            Listener
          </Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger id="assign-listener">
              <SelectValue placeholder="Nobody assigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Nobody — shared queue</SelectItem>
              {listeners.map((listener) => (
                <SelectItem key={listener.id} value={listener.id}>
                  {listener.name}
                  {listener.role === "ADMIN" ? " (admin)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button size="sm" variant="outline" disabled={!changed || saving} onClick={() => void save()}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : null}
          Save assignment
        </Button>

        <p className="text-muted-foreground text-xs leading-relaxed">
          The member sees this person&rsquo;s name at the top of their chat, and
          replies come from them. Unassigned threads stay in the shared queue for
          whoever is free — which is what you want for a first message, and not
          what you want for someone who&rsquo;s been talking to you for weeks.
        </p>
      </CardContent>
    </Card>
  );
}
