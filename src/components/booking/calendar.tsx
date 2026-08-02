"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, isoDay } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Multi-select day picker for "when are you free?". We deliberately don't show
 * live availability — a person reads every request and confirms the time, so
 * showing open slots here would promise a self-serve booking we don't do.
 */
export function PreferredDatesCalendar({
  selected,
  onToggle,
  max = 3,
  className,
}: {
  selected: string[];
  onToggle: (iso: string) => void;
  max?: number;
  className?: string;
}) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = React.useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const maxDate = React.useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 56);
    return d;
  }, [today]);

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(cursor);

  // Monday-first offset for the 1st of the month
  const firstWeekday = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

  const canGoBack =
    cursor.getFullYear() > today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() && cursor.getMonth() > today.getMonth());
  const canGoForward =
    cursor.getFullYear() < maxDate.getFullYear() ||
    (cursor.getFullYear() === maxDate.getFullYear() && cursor.getMonth() < maxDate.getMonth());

  const shift = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const atLimit = selected.length >= max;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">{monthLabel}</p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => shift(-1)}
            disabled={!canGoBack}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => shift(1)}
            disabled={!canGoForward}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-muted-foreground grid h-8 place-items-center text-[0.6875rem] font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(cursor.getFullYear(), cursor.getMonth(), i + 1);
          const iso = isoDay(date);
          const past = date <= today;
          const beyond = date > maxDate;
          const isSelected = selected.includes(iso);
          const disabled = past || beyond || (atLimit && !isSelected);

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(iso)}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              className={cn(
                "focus-visible:ring-ring/50 relative grid h-11 place-items-center rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-[3px]",
                !disabled && !isSelected && "hover:bg-accent text-foreground",
                disabled && !isSelected && "text-muted-foreground/35 cursor-not-allowed",
                isSelected &&
                  "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_var(--primary)]",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        {selected.length === 0
          ? `Pick up to ${max} days that could work.`
          : atLimit
            ? `${max} days chosen — tap one to swap it out.`
            : `${selected.length} of ${max} chosen.`}
      </p>
    </div>
  );
}
