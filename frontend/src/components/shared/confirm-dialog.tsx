"use client";

import * as React from "react";
import { Loader2, TriangleAlert } from "lucide-react";

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

/**
 * One dialog for every action that can't be undone.
 *
 * `confirmText` adds a type-to-confirm step. Reserve it for things that destroy
 * data — a muscle-memory click shouldn't be able to delete somebody's
 * conversations, and pausing to type a name is the cheapest way to prevent it.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  detail,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  confirmText,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  /** Extra consequences worth spelling out before they commit. */
  detail?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /** When set, the confirm button stays disabled until this is typed exactly. */
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
}) {
  const [typed, setTyped] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  // Never carry a half-typed confirmation into the next thing they open.
  React.useEffect(() => {
    if (!open) {
      setTyped("");
      setBusy(false);
    }
  }, [open]);

  const ready = !confirmText || typed.trim() === confirmText;

  async function run() {
    if (!ready || busy) return;
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            {destructive && <TriangleAlert className="text-destructive size-4.5 shrink-0" />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {detail && (
          <div className="border-destructive/25 bg-destructive/[0.04] text-muted-foreground rounded-2xl border p-4 text-sm leading-relaxed">
            {detail}
          </div>
        )}

        {confirmText && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-text">
              Type <span className="text-foreground font-mono font-medium">{confirmText}</span> to
              confirm
            </Label>
            <Input
              id="confirm-text"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              placeholder={confirmText}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "gradient"}
            onClick={() => void run()}
            disabled={!ready || busy}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Working…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
