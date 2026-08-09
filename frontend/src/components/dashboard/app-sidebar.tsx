"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, LogOut, Settings2 } from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  exact?: boolean;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export function AppSidebar({
  sections,
  user,
  footer,
  onNavigate,
}: {
  sections: SidebarSection[];
  user: { name: string; caption: string; href: string };
  footer?: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [confirmSignOut, setConfirmSignOut] = React.useState(false);

  const isActive = (item: SidebarItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />

      <nav className="flex flex-1 flex-col gap-6" aria-label="Dashboard">
        {sections.map((section, index) => (
          <div key={section.title ?? index} className="flex flex-col gap-1">
            {section.title && (
              <p className="text-muted-foreground mb-1.5 px-3 text-[0.6875rem] font-semibold tracking-wide uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={{ duration: 0.3, ease: easeOutExpo }}
                      className="bg-sidebar-accent absolute inset-0 -z-10 rounded-xl"
                    />
                  )}
                  <item.icon
                    className={cn("size-4.5 shrink-0", active && "text-primary")}
                  />
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <Badge
                      variant={active ? "default" : "muted"}
                      className="ml-auto px-1.5 py-0 text-[0.625rem]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {footer}

      <div className="border-sidebar-border flex items-center gap-3 border-t pt-4">
        <ListenerAvatar name={user.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user.caption}</p>
        </div>
        <Button asChild size="icon-sm" variant="ghost" aria-label="Settings">
          <Link href={user.href}>
            <Settings2 />
          </Link>
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Sign out"
          onClick={() => setConfirmSignOut(true)}
        >
          <LogOut />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out?"
        description="You'll need to sign in again to reach your messages and meetings."
        confirmLabel="Sign out"
        onConfirm={async () => {
          await signOut();
          router.push("/");
          router.refresh();
        }}
      />
    </div>
  );
}

/** Usage meter that sits above the account row in the member sidebar. */
export function SidebarUsage({
  used,
  included,
  renewsIn,
}: {
  used: number;
  included: number | "unlimited";
  renewsIn: string;
}) {
  const unlimited = included === "unlimited";
  const percent = unlimited ? 100 : Math.min(100, Math.round((used / included) * 100));

  return (
    <div className="border-sidebar-border bg-sidebar-accent/50 rounded-2xl border p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-medium">Sessions this month</span>
        <span className="text-xs font-semibold tabular-nums">
          {unlimited ? "∞" : `${used}/${included}`}
        </span>
      </div>
      <Progress value={percent} className="h-1.5" />
      <p className="text-muted-foreground mt-2.5 text-[0.6875rem]">
        Resets in {renewsIn}
      </p>
      <Button asChild size="sm" variant="outline" className="mt-3 w-full">
        <Link href="/dashboard/subscription">
          Manage plan <ArrowUpRight className="size-3" />
        </Link>
      </Button>
    </div>
  );
}
