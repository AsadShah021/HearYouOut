"use client";

import {
  CalendarDays,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { isStaff, useAuth } from "@/lib/auth";

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

  // Staff get a link across to the tools their role unlocks.
  const navigation = isStaff(user)
    ? [
        ...sections,
        {
          title: "Staff",
          items: [
            user?.role === "ADMIN"
              ? { label: "Admin panel", href: "/admin", icon: ShieldCheck }
              : { label: "Team dashboard", href: "/listener", icon: ShieldCheck },
          ],
        },
      ]
    : sections;

  return (
    <AppShell
      sections={navigation}
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
