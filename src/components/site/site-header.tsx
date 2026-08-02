"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Sparkles } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { mainNav, sessionModes } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);

  // A plain passive listener rather than framer's `useScroll`: it reads the real
  // position on mount and again shortly after, so a page opened part-way down
  // (refresh, scroll restoration, an #anchor link) never leaves a transparent
  // header sitting directly on top of content.
  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    const settle = window.setTimeout(update, 300);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", update);
    };
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      {/* Scrim: fades page content out as it passes beneath the floating pill,
          so nothing is ever left half-visible against the top edge. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180%] transition-opacity duration-300",
          "bg-linear-to-b from-background via-background/85 to-transparent",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="container-page">
        {/* Padding animates in CSS rather than JS — it's a layout property, so
            driving it per-frame from the main thread isn't worth it. */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-2xl px-4 transition-[background,box-shadow,border-color,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-5",
            scrolled ? "glass py-2" : "border border-transparent bg-transparent py-3 shadow-none",
          )}
        >
          <Logo />

          {/* Desktop navigation */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setServicesOpen(false)}
          >
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setServicesOpen(true)}
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  isActive("/services") && "text-primary",
                )}
              >
                Services
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    servicesOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-strong absolute top-[calc(100%+0.75rem)] left-1/2 w-[42rem] -translate-x-1/2 rounded-3xl p-3"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services#${service.slug}`}
                          className="hover:bg-accent group flex items-start gap-3 rounded-2xl p-3 transition-colors"
                        >
                          <span className="bg-primary/8 text-primary ring-primary/12 mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset">
                            <service.icon className="size-4.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium">
                              {service.title}
                            </span>
                            <span className="text-muted-foreground line-clamp-1 block text-xs">
                              {service.summary}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-border/60 mt-2 flex items-center justify-between gap-3 rounded-2xl border-t px-4 pt-3 pb-1">
                      <p className="text-muted-foreground text-xs">
                        Chat instantly, or request a voice or Google Meet session.
                      </p>
                      <Link
                        href="/services"
                        className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
                      >
                        All services <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mainNav
              .filter((item) => item.href !== "/services")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
                    isActive(item.href) && "text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="gradient" size="sm" className="hidden sm:inline-flex">
              <Link href="/chat">
                <span className="bg-success size-1.5 rounded-full" />
                Chat now <ArrowRight className="size-3.5" />
              </Link>
            </Button>

            {/* Mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(23rem,92vw)] overflow-y-auto p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex flex-col gap-6 p-6 pt-7">
                  <Logo />

                  <nav className="flex flex-col gap-1" aria-label="Mobile">
                    {mainNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "hover:bg-accent rounded-xl px-3 py-3 text-[0.95rem] font-medium transition-colors",
                          isActive(item.href) && "text-primary bg-accent/60",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <Separator />

                  <div>
                    <p className="text-muted-foreground mb-2 px-3 text-xs font-medium">
                      Ways to talk
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {sessionModes.map((mode) => (
                        <Link
                          key={mode.id}
                          href={
                            mode.booking === "instant"
                              ? "/chat"
                              : `/book?mode=${mode.id}`
                          }
                          className="border-border/70 hover:border-primary/40 hover:bg-accent/50 flex flex-col gap-1.5 rounded-2xl border p-3 transition-colors"
                        >
                          <mode.icon className="text-primary size-4" />
                          <span className="text-xs font-medium">{mode.short}</span>
                          <span className="text-muted-foreground text-[0.625rem]">
                            {mode.booking === "instant" ? "Instant" : "By request"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2.5">
                    <Button asChild variant="gradient" size="lg">
                      <Link href="/chat">
                        Chat with a listener now <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/book">Request a meeting</Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg">
                      <Link href="/sign-in">Sign in</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3">
                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Sparkles className="size-4" /> Appearance
                    </span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
