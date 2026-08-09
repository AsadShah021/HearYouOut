import Link from "next/link";
import {
  Clock3,
  Globe2,
  Heart,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { ModeBadge } from "@/components/shared/mode-badge";
import { Rating } from "@/components/shared/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listener } from "@/types";

export function ListenerCard({
  listener,
  className,
  compact = false,
  hasVideo = false,
}: {
  listener: Listener;
  className?: string;
  compact?: boolean;
  /**
   * Whether the intro video file actually exists. Resolved by a server
   * component — this card renders inside client components too, so it can't
   * touch the filesystem itself.
   */
  hasVideo?: boolean;
}) {
  return (
    <article
      className={cn(
        "group border-border/70 bg-card hover:border-primary/30 relative flex h-full flex-col gap-5 rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <ListenerAvatar name={listener.name} src={listener.avatar} size="lg" online />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[0.975rem] font-semibold">
              <Link
                href="/book"
                className="after:absolute after:inset-0 hover:underline underline-offset-4"
              >
                {listener.name}
              </Link>
            </h3>
            {listener.verified && (
              <ShieldCheck className="text-success size-3.5 shrink-0" aria-label="Verified listener" />
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
            {listener.headline}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Rating value={listener.rating} count={listener.reviews} />
            {hasVideo && (
              <span className="text-primary inline-flex items-center gap-1 text-[0.625rem] font-medium">
                <PlayCircle className="size-3" /> Intro video
              </span>
            )}
          </div>
        </div>
        {listener.favourite && (
          <Heart className="fill-brand-rose text-brand-rose size-4 shrink-0" aria-label="Favourite" />
        )}
      </div>

      {!compact && (
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {listener.bio}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {listener.specialties.slice(0, 3).map((specialty) => (
          <Badge key={specialty} variant="muted" className="font-normal">
            {specialty}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {listener.modes.map((mode) => (
          <ModeBadge key={mode} mode={mode} showLabel={false} />
        ))}
      </div>

      <dl className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Globe2 className="size-3.5" />
          <dd className="truncate">{listener.timezone}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageCircle className="size-3.5" />
          <dd className="truncate">{listener.responseTime}</dd>
        </div>
      </dl>

      <div className="border-border/60 mt-auto flex items-center justify-between gap-3 border-t pt-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Clock3 className="text-success size-3.5" />
          {listener.nextAvailable}
        </span>
        <Button asChild size="sm" variant="subtle" className="relative z-10">
          <Link href="/book">Request a meeting</Link>
        </Button>
      </div>
    </article>
  );
}
