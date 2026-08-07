"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { easeOutExpo } from "@/lib/motion";

/** Inline provider marks — no external requests, and they theme correctly. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.86-.08-1.7-.22-2.5H12v4.73h6.45a5.5 5.5 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.85Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.08.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.12-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.87 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M17.05 12.54c-.03-2.66 2.17-3.94 2.27-4-.24-.36-1.29-1.94-3.24-1.98-1.38-.14-2.7.81-3.4.81-.7 0-1.79-.79-2.94-.77-1.51.02-2.9.88-3.68 2.23-1.57 2.72-.4 6.75 1.12 8.96.74 1.08 1.63 2.29 2.79 2.25 1.12-.05 1.54-.72 2.9-.72s1.74.72 2.93.7c1.21-.02 1.97-1.1 2.71-2.18.85-1.25 1.2-2.46 1.22-2.52-.03-.01-2.34-.9-2.36-3.56-.02-2.22 1.81-3.28 1.89-3.33ZM14.8 4.6c.62-.75 1.03-1.79.92-2.83-.89.04-1.97.59-2.6 1.34-.57.66-1.07 1.72-.94 2.73.99.08 2-.5 2.62-1.24Z" />
    </svg>
  );
}

type Mode = "sign-in" | "sign-up" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp } = useAuth();
  // Where middleware wanted them to land before it bounced them here.
  const next = searchParams.get("next") || "/dashboard";
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();

    setLoading(true);
    // Front-end only: replace with your auth provider's call. Nothing is
    // verified — whatever is typed becomes the session.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);

    if (mode === "forgot") {
      setSent(true);
      toast.success("Reset link sent", {
        description: "Check your inbox — the link is valid for one hour.",
      });
      return;
    }

    const account = { name: name || email.split("@")[0], email };
    if (mode === "sign-up") signUp(account);
    else signIn(account);

    toast.success(mode === "sign-up" ? "Welcome to HearMeOut" : "Welcome back", {
      description: "You can message us or schedule a meeting from your dashboard.",
    });
    router.push(next);
    router.refresh();
  }

  if (mode === "forgot" && sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="flex flex-col gap-5 text-center"
      >
        <h1 className="text-2xl font-semibold tracking-[-0.025em]">Check your inbox</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          If an account exists for that address, we&rsquo;ve sent a reset link.
          It expires in one hour.
        </p>
        <Button asChild variant="outline">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="flex flex-col gap-7"
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
          {mode === "sign-in" && "Welcome back"}
          {mode === "sign-up" && "Start your first conversation"}
          {mode === "forgot" && "Reset your password"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {mode === "sign-in" && "Your listeners, sessions and notes are where you left them."}
          {mode === "sign-up" && "Create an account in under a minute. No card required to start chatting."}
          {mode === "forgot" && "Enter your email and we'll send you a link to set a new password."}
        </p>
      </header>

      {mode !== "forgot" && (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                signIn({ name: "Demo User", email: "demo@example.com" });
                toast.success("Signed in with Google (demo)");
                router.push(next);
                router.refresh();
              }}
            >
              <GoogleMark /> Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                signIn({ name: "Demo User", email: "demo@example.com" });
                toast.success("Signed in with Apple (demo)");
                router.push(next);
                router.refresh();
              }}
            >
              <AppleMark /> Apple
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="bg-background text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs">
              or with email
            </span>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "sign-up" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" placeholder="Alex Morgan" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        {mode !== "forgot" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "sign-in" && (
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                placeholder={mode === "sign-up" ? "At least 8 characters" : "••••••••"}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-lg transition-colors outline-none focus-visible:ring-[3px]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        )}

        <Button type="submit" variant="gradient" size="lg" disabled={loading} className="mt-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              {mode === "sign-in" && "Sign in"}
              {mode === "sign-up" && "Create account"}
              {mode === "forgot" && "Send reset link"}
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      {mode === "sign-up" && (
        <p className="text-muted-foreground text-xs leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="text-foreground underline underline-offset-4">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          . HearMeOut is not therapy or mental health treatment.
        </p>
      )}

      <p className="text-muted-foreground text-center text-sm">
        {mode === "sign-in" ? (
          <>
            New here?{" "}
            <Link href="/sign-up" className="text-foreground font-medium underline underline-offset-4">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground font-medium underline underline-offset-4">
              Sign in
            </Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
