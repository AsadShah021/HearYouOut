"use client";

import * as React from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const preferences = [
  {
    id: "reminders",
    label: "Session reminders",
    hint: "Email and push, 24 hours and 15 minutes before.",
    defaultChecked: true,
  },
  {
    id: "notes",
    label: "Listener notes after sessions",
    hint: "Your listener writes a short summary you can keep or delete.",
    defaultChecked: true,
  },
  {
    id: "messages",
    label: "New message notifications",
    hint: "Only for messages, never for marketing.",
    defaultChecked: true,
  },
  {
    id: "digest",
    label: "Monthly reflection digest",
    hint: "A quiet summary of what you talked about. Off by default for a reason.",
    defaultChecked: false,
  },
  {
    id: "product",
    label: "Product updates",
    hint: "Occasional notes when something meaningful changes.",
    defaultChecked: false,
  },
];

export function SettingsForm() {
  const [saving, setSaving] = React.useState(false);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    toast.success("Settings saved");
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Jordan Mercer" autoComplete="name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="jordan@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="europe-london">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-los-angeles">Pacific — Los Angeles</SelectItem>
                  <SelectItem value="america-new-york">Eastern — New York</SelectItem>
                  <SelectItem value="europe-london">GMT — London</SelectItem>
                  <SelectItem value="europe-berlin">CET — Berlin</SelectItem>
                  <SelectItem value="asia-singapore">SGT — Singapore</SelectItem>
                  <SelectItem value="australia-sydney">AEST — Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="format">Preferred conversation format</Label>
              <Select defaultValue="meet-video">
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Secure text chat</SelectItem>
                  <SelectItem value="voice">Voice call</SelectItem>
                  <SelectItem value="meet-audio">Google Meet audio</SelectItem>
                  <SelectItem value="meet-video">Google Meet video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="intro">What your listeners see before a session</Label>
            <Textarea
              id="intro"
              rows={3}
              defaultValue="Building an ops company. I think best when I'm not interrupted for the first ten minutes."
            />
            <p className="text-muted-foreground text-xs">
              Optional. Shared only with listeners you book.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {preferences.map((preference, index) => (
            <div key={preference.id}>
              {index > 0 && <Separator className="my-1" />}
              <div className="flex items-start justify-between gap-6 py-3.5">
                <div>
                  <Label htmlFor={preference.id} className="text-sm">
                    {preference.label}
                  </Label>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {preference.hint}
                  </p>
                </div>
                <Switch id={preference.id} defaultChecked={preference.defaultChecked} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Label htmlFor="history" className="text-sm">
                Keep conversation history
              </Label>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                When off, message threads are purged 30 days after a conversation
                ends. Sessions are never recorded either way.
              </p>
            </div>
            <Switch id="history" defaultChecked />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="outline" size="sm">
              Export all my data
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="size-3.5" /> Delete account
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-background/80 sticky bottom-0 -mx-1 flex justify-end gap-2.5 py-4 backdrop-blur-sm">
        <Button type="button" variant="ghost">
          Discard
        </Button>
        <Button type="submit" variant="gradient" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="size-4" /> Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
