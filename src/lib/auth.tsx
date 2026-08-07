"use client";

import * as React from "react";

import { SESSION_COOKIE } from "@/lib/session";

/**
 * Front-end-only session.
 *
 * There is no backend yet, so "signing in" writes a cookie and a localStorage
 * record and nothing is verified. The cookie exists so `middleware.ts` can
 * redirect on the server before a protected page renders — a localStorage-only
 * guard would flash the protected UI before bouncing.
 *
 * NOT SECURITY. Anyone can set this cookie by hand. When the backend lands,
 * replace `signIn`/`signUp` with real calls and have the server set an
 * httpOnly cookie; the rest of the app can stay exactly as it is.
 */
const STORAGE_KEY = "hearmeout:user";

export interface SessionUser {
  name: string;
  email: string;
}

interface AuthValue {
  user: SessionUser | null;
  /** False until the stored session has been read, so UI can avoid flicker. */
  ready: boolean;
  signIn: (user: SessionUser) => void;
  signUp: (user: SessionUser) => void;
  signOut: () => void;
}

const AuthContext = React.createContext<AuthValue | null>(null);

function writeCookie(value: string) {
  // Session-length cookie; `SameSite=Lax` so it survives normal navigation.
  document.cookie = `${SESSION_COOKIE}=${value}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
}

function clearCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; SameSite=Lax; max-age=0`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionUser;
        if (parsed?.email) {
          setUser(parsed);
          // Re-assert the cookie in case it expired before localStorage did.
          writeCookie("1");
        }
      }
    } catch {
      // Corrupt storage shouldn't take the app down — start signed out.
    }
    setReady(true);
  }, []);

  const persist = React.useCallback((next: SessionUser) => {
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private browsing can refuse writes; the cookie still carries the session.
    }
    writeCookie("1");
  }, []);

  const signOut = React.useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clean up */
    }
    clearCookie();
  }, []);

  const value = React.useMemo<AuthValue>(
    () => ({ user, ready, signIn: persist, signUp: persist, signOut }),
    [user, ready, persist, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

/** First name, for greetings. Falls back to the part before the @. */
export function firstName(user: SessionUser | null) {
  if (!user) return "there";
  const fromName = user.name?.trim().split(/\s+/)[0];
  return fromName || user.email.split("@")[0];
}
