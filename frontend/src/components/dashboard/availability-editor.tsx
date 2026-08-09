"use client";

import * as React from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { availability as seed } from "@/lib/data/demo";
import { cn } from "@/lib/utils";
import type { AvailabilityDay } from "@/types";

export function AvailabilityEditor() {
  const [days, setDays] = React.useState<AvailabilityDay[]>(seed);

  const toggleDay = (index: number) =>
    setDays((current) =>
      current.map((day, i) =>
        i === index
          ? {
              ...day,
              enabled: !day.enabled,
              slots: !day.enabled && day.slots.length === 0
                ? [{ from: "09:00", to: "17:00" }]
                : day.slots,
            }
          : day,
      ),
    );

  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    key: "from" | "to",
    value: string,
  ) =>
    setDays((current) =>
      current.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, s) =>
                s === slotIndex ? { ...slot, [key]: value } : slot,
              ),
            }
          : day,
      ),
    );

  const addSlot = (dayIndex: number) =>
    setDays((current) =>
      current.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: [...day.slots, { from: "18:00", to: "20:00" }] }
          : day,
      ),
    );

  const removeSlot = (dayIndex: number, slotIndex: number) =>
    setDays((current) =>
      current.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: day.slots.filter((_, s) => s !== slotIndex) }
          : day,
      ),
    );

  const totalHours = days.reduce((sum, day) => {
    if (!day.enabled) return sum;
    return (
      sum +
      day.slots.reduce((daySum, slot) => {
        const [fromH, fromM] = slot.from.split(":").map(Number);
        const [toH, toM] = slot.to.split(":").map(Number);
        return daySum + Math.max(0, toH * 60 + toM - (fromH * 60 + fromM)) / 60;
      }, 0)
    );
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly hours</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Members see these converted into their own timezone.
            </p>
          </div>
          <span className="text-right">
            <span className="block text-2xl font-semibold tabular-nums">
              {totalHours.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-xs">hours open</span>
          </span>
        </CardHeader>

        <CardContent className="flex flex-col">
          {days.map((day, dayIndex) => (
            <div
              key={day.day}
              className={cn(
                "border-border/50 flex flex-col gap-3 border-b py-4 last:border-b-0 sm:flex-row sm:items-start",
                !day.enabled && "opacity-60",
              )}
            >
              <div className="flex w-40 shrink-0 items-center gap-3">
                <Switch
                  checked={day.enabled}
                  onCheckedChange={() => toggleDay(dayIndex)}
                  aria-label={`${day.day} availability`}
                />
                <span className="text-sm font-medium">{day.day}</span>
              </div>

              <div className="flex flex-1 flex-col gap-2.5">
                {day.enabled && day.slots.length > 0 ? (
                  day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.from}
                        onChange={(event) =>
                          updateSlot(dayIndex, slotIndex, "from", event.target.value)
                        }
                        aria-label={`${day.day} start time`}
                        className="h-10 w-32"
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        type="time"
                        value={slot.to}
                        onChange={(event) =>
                          updateSlot(dayIndex, slotIndex, "to", event.target.value)
                        }
                        aria-label={`${day.day} end time`}
                        className="h-10 w-32"
                      />
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => removeSlot(dayIndex, slotIndex)}
                        aria-label="Remove this block"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-2.5 text-sm">Unavailable</p>
                )}

                {day.enabled && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addSlot(dayIndex)}
                    className="w-fit"
                  >
                    <Plus className="size-3.5" /> Add a block
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="gradient"
          onClick={() => toast.success("Availability published")}
        >
          <Save className="size-4" /> Publish availability
        </Button>
      </div>
    </div>
  );
}
