"use client";

import {
  BookmarkCheck,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Lightbulb,
  MessagesSquare,
  NotebookPen,
  Settings,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { SidebarUsage } from "@/components/dashboard/app-sidebar";
import { usage } from "@/lib/data/demo";


const sections = [
  {
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Chat with us", href: "/dashboard/messages", icon: MessagesSquare, badge: 2 },
      { label: "Sessions", href: "/dashboard/sessions", icon: CalendarDays, badge: 3 },
    ],
  },
  {
    title: "Your record",
    items: [
      { label: "Notes", href: "/dashboard/notes", icon: NotebookPen },
      { label: "Saved ideas", href: "/dashboard/ideas", icon: Lightbulb },
      { label: "Favourite listeners", href: "/dashboard/listeners", icon: BookmarkCheck },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function MemberShell({
  children,
  /** Computed on the server so the sidebar never disagrees after hydration. */
  renewsInDays,
}: {
  children: React.ReactNode;
  renewsInDays: number;
}) {
  return (
    <AppShell
      sections={sections}
      user={{ name: "Jordan Mercer", caption: "Professional plan", href: "/dashboard/settings" }}
      searchPlaceholder="Search sessions, notes and ideas…"
      primaryAction={{ label: "Request a meeting", href: "/book" }}
      sidebarFooter={
        <SidebarUsage
          used={usage.sessionsUsed}
          included={usage.sessionsIncluded}
          renewsIn={`${renewsInDays} days`}
        />
      }
    >
      {children}
    </AppShell>
  );
}
