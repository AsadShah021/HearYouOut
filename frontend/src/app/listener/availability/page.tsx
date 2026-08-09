import { CalendarOff, Globe2 } from "lucide-react";

import { PageHeader } from "@/components/dashboard/app-shell";
import { AvailabilityEditor } from "@/components/dashboard/availability-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AvailabilityPage() {
  return (
    <>
      <PageHeader
        title="Availability"
        description="Set the hours you're open. Nobody can book outside them, and nobody will chase you to open more."
        actions={
          <Button variant="outline">
            <CalendarOff className="size-4" /> Add time off
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AvailabilityEditor />

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="text-muted-foreground size-4" />
                Your timezone
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm font-medium">WEST · Lisbon (UTC+1)</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Members always see your availability converted into their local
                time, and daylight saving shifts are handled automatically.
              </p>
              <Button variant="outline" size="sm" className="w-fit">
                Change timezone
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking rules</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5 text-sm">
              {[
                { label: "Minimum notice", value: "4 hours" },
                { label: "Buffer between sessions", value: "15 minutes" },
                { label: "Maximum per day", value: "5 sessions" },
                { label: "Booking horizon", value: "8 weeks" },
              ].map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-muted-foreground">{rule.label}</span>
                  <span className="font-medium">{rule.value}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Edit rules
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/40">
            <CardContent className="p-5">
              <p className="text-sm font-medium">Capping your load is encouraged</p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Listening well is tiring. Listeners who cap at five sessions a day
                keep their ratings higher and stay with us far longer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
