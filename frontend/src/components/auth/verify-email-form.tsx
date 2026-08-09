"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck, PenLine } from "lucide-react";
import { toast } from "sonner";

import { OtpInput } from "@/components/auth/otp-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/** Matches the server's resend cooldown, so the button lies about nothing. */
const COOLDOWN_SECONDS = 60;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const { user, ready, verifyEmail, resendCode, changeEmail } = useAuth();

  const [code, setCode] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(COOLDOWN_SECONDS);
  const [editingEmail, setEditingEmail] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [savingEmail, setSavingEmail] = React.useState(false);

  // Signed out, or already verified — neither belongs on this screen.
  React.useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/sign-in?next=${encodeURIComponent(next)}`);
    else if (user.isVerified) router.replace(next);
  }, [ready, user, router, next]);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const submit = React.useCallback(
    async (value: string) => {
      setChecking(true);
      setInvalid(false);
      try {
        await verifyEmail(value);
        toast.success("Email verified", { description: "You're all set." });
        router.push(next);
        router.refresh();
      } catch (error) {
        setInvalid(true);
        setCode("");
        toast.error(
          error instanceof ApiError ? error.message : "Couldn't check that code.",
        );
      } finally {
        setChecking(false);
      }
    },
    [verifyEmail, router, next],
  );

  async function resend() {
    try {
      await resendCode();
      setCooldown(COOLDOWN_SECONDS);
      setCode("");
      setInvalid(false);
      toast.success("New code sent", { description: `Check ${user?.email}.` });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't send a new code.");
    }
  }

  async function saveEmail(event: React.FormEvent) {
    event.preventDefault();
    setSavingEmail(true);
    try {
      await changeEmail(newEmail.trim());
      setEditingEmail(false);
      setCode("");
      setInvalid(false);
      setCooldown(COOLDOWN_SECONDS);
      toast.success("Address updated", { description: `Code sent to ${newEmail.trim()}.` });
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update that.");
    } finally {
      setSavingEmail(false);
    }
  }

  if (!ready || !user) {
    return (
      <div className="text-muted-foreground flex justify-center py-20">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
          <MailCheck className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Check your email</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{user.email}</span>. Enter
            it below to finish setting up your account.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <OtpInput
          autoFocus
          value={code}
          onChange={(value) => {
            setCode(value);
            if (invalid) setInvalid(false);
          }}
          onComplete={(value) => void submit(value)}
          disabled={checking}
          invalid={invalid}
        />

        <Button
          variant="gradient"
          className="w-full"
          disabled={code.length !== 6 || checking}
          onClick={() => void submit(code)}
        >
          {checking ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Checking…
            </>
          ) : (
            "Verify email"
          )}
        </Button>
      </div>

      <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm">
        <p>
          Didn&rsquo;t get it?{" "}
          {cooldown > 0 ? (
            <span className="tabular-nums">Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => void resend()}
              className="text-foreground font-medium underline underline-offset-4"
            >
              Send a new code
            </button>
          )}
        </p>

        {/*
          The single most common way somebody gets stuck here is a typo in their
          own address, and without this they'd have no way out but a new account.
        */}
        {editingEmail ? (
          <form onSubmit={saveEmail} className="flex w-full flex-col gap-2 pt-1">
            <Label htmlFor="new-email" className="text-xs">
              Where should we send it instead?
            </Label>
            <div className="flex gap-2">
              <Input
                id="new-email"
                type="email"
                required
                autoFocus
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="you@example.com"
              />
              <Button type="submit" disabled={savingEmail || !newEmail.trim()}>
                {savingEmail ? <Loader2 className="size-4 animate-spin" /> : "Send"}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setEditingEmail(false)}
              className="self-start text-xs underline underline-offset-4"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setNewEmail(user.email);
              setEditingEmail(true);
            }}
            className="hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <PenLine className="size-3" /> Wrong address? Change it
          </button>
        )}

        <p className="text-xs">
          Still stuck? Email{" "}
          <a
            href="mailto:hello@snugtalk.tech"
            className="text-foreground underline underline-offset-4"
          >
            hello@snugtalk.tech
          </a>{" "}
          and a human will sort it out.
        </p>
      </div>
    </div>
  );
}
