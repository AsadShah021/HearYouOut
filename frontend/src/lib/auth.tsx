"use client";

import * as React from "react";

import { api, ApiError, type ApiUser } from "@/lib/api";

/**
 * Session state, backed by the API.
 *
 * The session itself lives in an httpOnly cookie that JavaScript cannot read —
 * so there is no token here and nothing in localStorage. On mount we ask the
 * server who we are; that answer is the single source of truth.
 */
export type SessionUser = ApiUser;

interface AuthValue {
  user: SessionUser | null;
  /** Admin id, set only while impersonating someone. */
  impersonatedBy: string | null;
  stopImpersonating: () => Promise<void>;
  /** False until the first `/me` check resolves, so UI can avoid flicker. */
  ready: boolean;
  signIn: (email: string, password: string) => Promise<SessionUser>;
  signUp: (name: string, email: string, password: string) => Promise<SessionUser>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [impersonatedBy, setImpersonatedBy] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      const { user: me, impersonatedBy: by } = await api.get<{
        user: SessionUser;
        impersonatedBy: string | null;
      }>("/api/auth/me");
      setUser(me);
      setImpersonatedBy(by ?? null);
    } catch (error) {
      // 401 just means signed out. Anything else (API down) also leaves us
      // signed out, but is worth surfacing in the console during development.
      if (!(error instanceof ApiError) || !error.isUnauthorized) {
        console.warn("[auth] could not load session:", error);
      }
      setUser(null);
      setImpersonatedBy(null);
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const signIn = React.useCallback(async (email: string, password: string) => {
    const { user: me } = await api.post<{ user: SessionUser }>("/api/auth/login", {
      email,
      password,
    });
    setUser(me);
    return me;
  }, []);

  const signUp = React.useCallback(
    async (name: string, email: string, password: string) => {
      const { user: me } = await api.post<{ user: SessionUser }>("/api/auth/register", {
        name,
        email,
        password,
      });
      setUser(me);
      return me;
    },
    [],
  );

  const signOut = React.useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      // Clear locally even if the call failed, so the UI can't get stuck.
      setUser(null);
      setImpersonatedBy(null);
    }
  }, []);

  /** Hand the session back to the admin who started impersonating. */
  const stopImpersonating = React.useCallback(async () => {
    const { user: admin } = await api.post<{ user: SessionUser }>(
      "/api/auth/stop-impersonating",
    );
    setUser(admin);
    setImpersonatedBy(null);
  }, []);

  const value = React.useMemo<AuthValue>(
    () => ({ user, impersonatedBy, ready, signIn, signUp, signOut, refresh, stopImpersonating }),
    [user, impersonatedBy, ready, signIn, signUp, signOut, refresh, stopImpersonating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/** First name, for greetings. Falls back to the part before the @. */
export function firstName(user: SessionUser | null) {
  if (!user) return "there";
  return user.name?.trim().split(/\s+/)[0] || user.email.split("@")[0];
}

/** Staff can see the team dashboards; members cannot. */
export function isStaff(user: SessionUser | null) {
  return user?.role === "LISTENER" || user?.role === "ADMIN";
}
