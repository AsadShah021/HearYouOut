"use client";

import {
  CalendarDays,
  LayoutDashboard,
  MessagesSquare,
  Settings,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { useAuth } from "@/lib/auth";

/*
 * Testing-phase member navigation: the two things an account can actually do,
 * plus settings. Notes, saved ideas, favourite listeners and subscription are
 * parked with the features they belong to — their pages still exist and are
 * still routable, they're just not linked. See TESTING-SCOPE.md.
 */
const sections = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Messages", href: "/chat", icon: MessagesSquare },
      { label: "Meetings", href: "/dashboard/sessions", icon: CalendarDays },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export function MemberShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <AppShell
      sections={sections}
      user={{
        name: user?.name ?? "Your account",
        caption: user?.email ?? "Signed in",
        href: "/dashboard/settings",
      }}
      searchPlaceholder="Search your messages and meetings…"
      primaryAction={{ label: "Schedule a meeting", href: "/book" }}
    >
      {children}
    </AppShell>
  );
}
