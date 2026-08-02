import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

import { PageHeader } from "@/components/dashboard/app-shell";
import { ListenerCard } from "@/components/marketing/listener-card";
import { Button } from "@/components/ui/button";
import { listeners } from "@/lib/data/listeners";

export default function FavouriteListenersPage() {
  const favourites = listeners.filter((listener) => listener.favourite);
  const recentlySeen = listeners.filter((listener) => !listener.favourite).slice(0, 3);

  return (
    <>
      <PageHeader
        title="Favourite listeners"
        description="We'll try these listeners first when you request a meeting."
        badge={`${favourites.length} saved`}
        actions={
          <Button asChild variant="outline">
            <Link href="/listeners">
              Meet the team <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {favourites.map((listener) => (
          <ListenerCard key={listener.id} listener={listener} />
        ))}
      </div>

      <div className="border-border/70 bg-card mt-6 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        <Heart className="text-brand-rose size-5 shrink-0" />
        <p className="text-muted-foreground text-sm leading-relaxed">
          <span className="text-foreground font-medium">On Premium</span> you can
          nominate one dedicated listener who holds recurring slots for you and
          keeps the thread of everything you&rsquo;ve discussed.
        </p>
        <Button asChild variant="outline" size="sm" className="shrink-0 sm:ml-auto">
          <Link href="/dashboard/subscription">Compare plans</Link>
        </Button>
      </div>

      <h2 className="mt-10 mb-4 text-sm font-semibold">Recently viewed</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recentlySeen.map((listener) => (
          <ListenerCard key={listener.id} listener={listener} compact />
        ))}
      </div>
    </>
  );
}
