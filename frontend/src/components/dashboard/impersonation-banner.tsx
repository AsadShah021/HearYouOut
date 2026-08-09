"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/**
 * Loud, fixed, and impossible to miss.
 *
 * Impersonation means reading someone's private conversations. The one failure
 * mode that really matters is an admin forgetting they're inside another
 * person's account — so this sits above everything and never scrolls away.
 */
export function ImpersonationBanner() {
  const { user, impersonatedBy, stopImpersonating } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  if (!impersonatedBy || !user) return null;

  async function stop() {
    setBusy(true);
    try {
      await stopImpersonating();
      toast.success("Back to your own account");
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Couldn't switch back. Sign out and in again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-warning text-warning-foreground sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2 text-sm font-medium">
      <span className="flex items-center gap-2">
        <Eye className="size-4 shrink-0" />
        You are viewing SnugTalk as <strong>{user.name}</strong> ({user.email})
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => void stop()}
        disabled={busy}
        className="border-warning-foreground/30 bg-warning-foreground/10 hover:bg-warning-foreground/20 text-warning-foreground h-7"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
        Stop impersonating
      </Button>
    </div>
  );
}
