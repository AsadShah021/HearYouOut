"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

/**
 * Keeps unverified accounts out of the signed-in area.
 *
 * This is convenience, not security. The middleware can't do it — it has no
 * database access and the session token deliberately doesn't carry a
 * verification flag, since a token minted at signup would keep claiming
 * "unverified" long after the person had entered their code. The real
 * enforcement is `requireVerified` on the API, which every gated endpoint
 * runs; this only saves someone from staring at a dashboard where nothing
 * works.
 */
const PROTECTED = ["/dashboard", "/listener", "/admin", "/chat", "/book"];

export function VerificationGuard() {
  const { user, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!ready || !user || user.isVerified) return;
    if (!PROTECTED.some((route) => pathname.startsWith(route))) return;

    router.replace(`/verify-email?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, pathname, router]);

  return null;
}
