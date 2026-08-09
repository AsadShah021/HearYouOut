"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { ListenerCard } from "@/components/marketing/listener-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listeners, specialties } from "@/lib/data/listeners";
import { sessionModes } from "@/lib/data/site";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SessionMode } from "@/types";

type SortKey = "recommended" | "rating" | "experience" | "soonest";

export function ListenerDirectory({
  videoSlugs = [],
}: {
  /** Slugs whose intro video file exists, resolved server-side. */
  videoSlugs?: string[];
}) {
  const [query, setQuery] = React.useState("");
  const [specialty, setSpecialty] = React.useState<string>("all");
  const [modes, setModes] = React.useState<SessionMode[]>([]);
  const [sort, setSort] = React.useState<SortKey>("recommended");

  const toggleMode = (mode: SessionMode) =>
    setModes((current) =>
      current.includes(mode) ? current.filter((m) => m !== mode) : [...current, mode],
    );

  const results = React.useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = listeners.filter((listener) => {
      const matchesQuery =
        !needle ||
        listener.name.toLowerCase().includes(needle) ||
        listener.headline.toLowerCase().includes(needle) ||
        listener.specialties.some((s) => s.toLowerCase().includes(needle)) ||
        listener.languages.some((l) => l.toLowerCase().includes(needle));

      const matchesSpecialty =
        specialty === "all" || listener.specialties.includes(specialty);

      const matchesModes =
        modes.length === 0 || modes.every((mode) => listener.modes.includes(mode));

      return matchesQuery && matchesSpecialty && matchesModes;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating || b.reviews - a.reviews;
        case "experience":
          return b.yearsListening - a.yearsListening;
        case "soonest":
          // "Today" beats "Tomorrow"; otherwise keep the natural order
          return Number(b.nextAvailable.startsWith("Today")) -
            Number(a.nextAvailable.startsWith("Today"));
        default:
          return Number(b.featured ?? false) - Number(a.featured ?? false);
      }
    });
  }, [query, specialty, modes, sort]);

  const hasFilters = query || specialty !== "all" || modes.length > 0;

  return (
    <div>
      <div className="glass sticky top-20 z-30 flex flex-col gap-4 rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, focus or language…"
              aria-label="Search listeners"
              className="bg-background/70 pl-10"
            />
          </div>

          <div className="flex gap-3">
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-background/70 w-full lg:w-56" aria-label="Filter by focus">
                <SelectValue placeholder="All focus areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All focus areas</SelectItem>
                {specialties.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
              <SelectTrigger className="bg-background/70 w-full lg:w-44" aria-label="Sort listeners">
                <SlidersHorizontal className="text-muted-foreground size-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="experience">Most experienced</SelectItem>
                <SelectItem value="soonest">Available soonest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground mr-1 text-xs">Available over</span>
          {sessionModes.map((mode) => {
            const active = modes.includes(mode.id);
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleMode(mode.id)}
                className={cn(
                  "focus-visible:ring-ring/50 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-[3px]",
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-background/60 text-muted-foreground hover:text-foreground",
                )}
              >
                <mode.icon className="size-3.5" />
                {mode.short}
              </button>
            );
          })}

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setSpecialty("all");
                setModes([]);
              }}
              className="ml-auto h-8"
            >
              <X className="size-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">{results.length}</span>{" "}
          {results.length === 1 ? "listener" : "listeners"} available
        </p>
        {modes.length > 0 && (
          <Badge variant="brand">{modes.length} format filter{modes.length > 1 && "s"}</Badge>
        )}
      </div>

      <motion.div layout className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((listener) => (
            <motion.div
              key={listener.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
            >
              <ListenerCard
                listener={listener}
                hasVideo={videoSlugs.includes(listener.slug)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <div className="border-border/70 mt-5 flex flex-col items-center gap-3 rounded-3xl border border-dashed p-14 text-center">
          <p className="font-medium">No listeners match those filters</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Try widening the format filters — most listeners support at least
            text and voice.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setSpecialty("all");
              setModes([]);
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
