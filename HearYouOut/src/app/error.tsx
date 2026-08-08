"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Wire this to your error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <span className="bg-destructive/10 text-destructive mb-7 grid size-14 place-items-center rounded-2xl">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
        Something went wrong on our side
      </h1>
      <p className="text-muted-foreground mt-3.5 max-w-md leading-relaxed">
        Nothing you did caused this. Try again — and if it keeps happening, your
        sessions and messages are safe while we sort it out.
      </p>
      {error.digest && (
        <p className="text-muted-foreground/70 mt-3 font-mono text-xs">
          Reference: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" variant="gradient" onClick={reset}>
          <RotateCw className="size-4" /> Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
