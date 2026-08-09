"use client";

import Link from "next/link";
import {
  CalendarClock,
  CalendarRange,
  History,
  Inbox,
  LayoutDashboard,
  MessagesSquare,
  NotebookPen,
  Star,
  Wallet,
} from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const sections = [
  {
    title: "Needs you",
    items: [
      { label: "Overview", href: "/listener", icon: LayoutDashboard, exact: true },
      { label: "Live chats", href: "/listener/chats", icon: MessagesSquare, badge: 2 },
      { label: "Meeting requests", href: "/listener/requests", icon: Inbox, badge: 2 },
    ],
  },
  {
    title: "Scheduled",
    items: [
      { label: "Appointments", href: "/listener/appointments", icon: CalendarClock, badge: 4 },
      { label: "Client notes", href: "/listener/clients", icon: NotebookPen },
      { label: "Availability", href: "/listener/availability", icon: CalendarRange },
    ],
  },
  {
    title: "Your practice",
    items: [
      { label: "Earnings", href: "/listener/earnings", icon: Wallet },
      { label: "Ratings & reviews", href: "/listener/reviews", icon: Star },
      { label: "Session history", href: "/listener/history", icon: History },
    ],
  },
];

export function ListenerShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      sections={sections}
      user={{
        name: "Amara Okonkwo",
        caption: "Senior listener · 6 yrs",
        href: "/listener/availability",
      }}
      searchPlaceholder="Search chats, requests, clients and notes…"
      primaryAction={{ label: "Open requests", href: "/listener/requests" }}
      sidebarFooter={
        <div className="border-sidebar-border bg-sidebar-accent/50 rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium">Accepting new clients</p>
              <p className="text-muted-foreground mt-0.5 text-[0.6875rem]">
                Shown in the directory
              </p>
            </div>
            <Switch defaultChecked aria-label="Accepting new clients" />
          </div>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full">
            <Link href="/">View the public site</Link>
          </Button>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
