"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Menu, Plus, Search } from "lucide-react";

import {
  AppSidebar,
  type SidebarSection,
} from "@/components/dashboard/app-sidebar";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function AppShell({
  sections,
  user,
  sidebarFooter,
  primaryAction,
  searchPlaceholder = "Search…",
  children,
}: {
  sections: SidebarSection[];
  user: { name: string; caption: string; href: string };
  sidebarFooter?: React.ReactNode;
  primaryAction?: { label: string; href: string };
  searchPlaceholder?: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="bg-muted/30 min-h-dvh lg:grid lg:grid-cols-[16.5rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-dvh border-r lg:block">
        <AppSidebar sections={sections} user={user} footer={sidebarFooter} />
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        {/* Top bar */}
        <header className="glass sticky top-0 z-40 flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[17rem] p-0" showClose={false}>
              <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
              <AppSidebar
                sections={sections}
                user={user}
                footer={sidebarFooter}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="bg-background/60 h-10 pl-10"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4.5" />
              <span className="bg-destructive ring-background absolute top-2 right-2 size-2 rounded-full ring-2" />
            </Button>
            <ThemeToggle />
            {primaryAction && (
              <Button asChild variant="gradient" size="sm" className="ml-1.5">
                <Link href={primaryAction.href}>
                  <Plus className="size-3.5" />
                  <span className="hidden sm:inline">{primaryAction.label}</span>
                </Link>
              </Button>
            )}
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Page title block used at the top of every dashboard route. */
export function PageHeader({
  title,
  description,
  badge,
  actions,
  className,
}: {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-[-0.025em]">{title}</h1>
          {badge && <Badge variant="brand">{badge}</Badge>}
        </div>
        {description && (
          <p className="text-muted-foreground mt-1.5 text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
