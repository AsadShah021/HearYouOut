"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { isStaff, useAuth } from "@/lib/auth";

/**
 * Keeps members out of the team dashboards.
 *
 * The API is the real boundary — every staff endpoint checks the role server
 * side and returns 403 regardless of what the browser does. This only stops a
 * member from seeing a shell they have no data for, since middleware can only
 * check that *a* session exists, not which role it belongs to.
 */
export function StaffOnly({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const allowed = isStaff(user);

  React.useEffect(() => {
    if (ready && !allowed) router.replace("/dashboard");
  }, [ready, allowed, router]);

  if (!ready || !allowed) {
    return (
      <div className="text-muted-foreground flex min-h-dvh items-center justify-center gap-2 text-sm">
        <Loader2 className="size-4 animate-spin" /> Checking your access…
      </div>
    );
  }

  return <>{children}</>;
}
