import Link from "next/link";
import { ArrowLeft, Quote, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { AuroraBackdrop } from "@/components/motion/aurora-backdrop";
import { trustPoints } from "@/lib/data/marketing";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="bg-muted/30 relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <AuroraBackdrop intensity="bold" />
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 opacity-30"
        />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative max-w-md">
          <Quote className="text-primary/30 mb-6 size-9" aria-hidden />
          <blockquote className="text-2xl leading-[1.35] font-semibold tracking-[-0.025em]">
            &ldquo;I&rsquo;d pitched the same idea to eight friends and they all
            said it was great. Forty minutes with a listener and I finally heard
            the part I&rsquo;d been skipping over.&rdquo;
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3">
            <ListenerAvatar name="Dara Osei" size="md" />
            <div>
              <p className="text-sm font-medium">Dara Osei</p>
              <p className="text-muted-foreground text-xs">
                Founder · Professional plan
              </p>
            </div>
          </figcaption>
        </div>

        <ul className="text-muted-foreground relative flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-1.5">
              <ShieldCheck className="text-success size-3.5" />
              {point}
            </li>
          ))}
        </ul>
      </aside>

      {/* Form panel */}
      <main
        id="main"
        className="relative flex min-h-dvh flex-col px-5 py-8 sm:px-8 lg:px-12"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="lg:hidden">
              <Logo showWordmark={false} />
            </span>
            <span className="hidden lg:inline">Back to site</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </main>
    </div>
  );
}
