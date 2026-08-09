"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck,
  Loader2,
  Mail,
  Save,
  Trash2,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { PageHeader } from "@/components/dashboard/app-shell";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  api,
  ApiError,
  type AdminUserDetail,
  type RequestStatus,
  type Role,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn, formatDate, formatRelativeDay } from "@/lib/utils";

const roles: Role[] = ["MEMBER", "LISTENER", "ADMIN"];

const statusTone: Record<RequestStatus, "info" | "warning" | "success" | "muted"> = {
  NEW: "info",
  REVIEWING: "warning",
  SCHEDULED: "success",
  DECLINED: "muted",
};

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user: me } = useAuth();
  const [user, setUser] = React.useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  async function saveDetails(name: string, email: string) {
    if (!user) return;
    setSaving(true);
    try {
      const { user: updated } = await api.patch<{ user: AdminUserDetail }>(
        `/api/admin/users/${user.id}`,
        { name, email },
      );
      setUser((current) =>
        current ? { ...current, name: updated.name, email: updated.email } : current,
      );
      toast.success("Details updated");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Couldn't save that.");
    } finally {
      setSaving(false);
    }
  }

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { user: data } = await api.get<{ user: AdminUserDetail }>(
          `/api/admin/users/${params.id}`,
        );
        if (!cancelled) setUser(data);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError ? error.message : "Couldn't load that user.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function changeRole(role: Role) {
    if (!user || role === user.role) return;
    setSaving(true);
    try {
      const { user: updated } = await api.patch<{ user: AdminUserDetail }>(
        `/api/admin/users/${user.id}`,
        { role },
      );
      setUser((current) => (current ? { ...current, role: updated.role } : current));
      toast.success(`${user.name} is now ${role.toLowerCase()}`);
    } catch (error) {
      // The API refuses to remove the last admin, or your own access.
      toast.error(
        error instanceof ApiError ? error.message : "Couldn't change that role.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 py-16 text-sm">
        <Loader2 className="size-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-medium">User not found</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  const isSelf = me?.id === user.id;

  return (
    <>
      <Link
        href="/admin/users"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" /> All users
      </Link>

      <PageHeader
        title={user.name}
        description={user.email}
        badge={isSelf ? "This is you" : undefined}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="text-muted-foreground size-4" />
                Meeting tickets ({user._count.requests})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {user.requests.length === 0 ? (
                <p className="text-muted-foreground py-4 text-sm">
                  They haven&rsquo;t requested a meeting yet.
                </p>
              ) : (
                user.requests.map((request) => (
                  <div
                    key={request.id}
                    className="border-border/60 flex flex-col gap-2 rounded-2xl border p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium">
                        {request.reference}
                      </span>
                      <Badge variant={statusTone[request.status]}>{request.status}</Badge>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {formatRelativeDay(request.createdAt)}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {request.topic}
                    </p>
                    {request.scheduledFor && (
                      <p className="text-success text-xs font-medium">
                        Confirmed for{" "}
                        {formatDate(request.scheduledFor, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="text-muted-foreground size-4" />
                Conversations ({user._count.conversations})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {user.conversations.length === 0 ? (
                <p className="text-muted-foreground py-4 text-sm">
                  No chat threads yet.
                </p>
              ) : (
                user.conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href="/admin/messages"
                    className="border-border/60 hover:border-primary/25 flex items-center gap-3 rounded-2xl border p-3.5 transition-colors"
                  >
                    <Badge
                      variant={conversation.status === "WAITING" ? "warning" : "success"}
                    >
                      {conversation.status}
                    </Badge>
                    <span className="text-muted-foreground flex-1 text-xs">
                      {conversation._count.messages} messages
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatRelativeDay(conversation.lastMessageAt)}
                    </span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ListenerAvatar name={user.name} size="lg" announce />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground flex items-center gap-1.5 truncate text-xs">
                    <Mail className="size-3" />
                    {user.email}
                  </p>
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  void saveDetails(
                    String(form.get("name") ?? "").trim(),
                    String(form.get("email") ?? "").trim(),
                  );
                }}
                className="border-border/60 flex flex-col gap-3 border-t pt-4"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-name" className="text-xs">Name</Label>
                  <Input id="edit-name" name="name" defaultValue={user.name} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="edit-email" className="text-xs">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={user.email} required />
                </div>
                <Button type="submit" size="sm" variant="outline" disabled={saving}>
                  {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                  Save changes
                </Button>
              </form>

              <dl className="text-muted-foreground border-border/60 flex flex-col gap-2 border-t pt-4 text-xs">
                <div className="flex justify-between gap-3">
                  <dt>Joined</dt>
                  <dd className="text-foreground">
                    {formatDate(user.createdAt, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Messages sent</dt>
                  <dd className="text-foreground">{user._count.messages}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>User ID</dt>
                  <dd className="text-foreground font-mono text-[0.625rem]">{user.id}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-muted-foreground size-4" />
                Role
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                {roles.map((role) => {
                  const active = user.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      disabled={saving || active}
                      onClick={() => void changeRole(role)}
                      className={cn(
                        "focus-visible:ring-ring/50 flex items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-default",
                        active
                          ? "border-primary/45 bg-primary/[0.06] font-medium"
                          : "border-border/70 hover:border-primary/25",
                      )}
                    >
                      <span>
                        {role === "MEMBER" && "Member"}
                        {role === "LISTENER" && "Listener"}
                        {role === "ADMIN" && "Administrator"}
                      </span>
                      {active && <Badge variant="success">Current</Badge>}
                    </button>
                  );
                })}
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed">
                Listeners can answer chats and schedule tickets. Administrators
                can also manage users. You can&rsquo;t remove your own admin
                access, and there must always be at least one admin.
              </p>
            </CardContent>
          </Card>

          {!isSelf && (
            <Card className="border-destructive/25">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Trash2 className="size-4" />
                  Danger zone
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Deleting this account also deletes every conversation and
                  message in it, permanently.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-fit"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-3.5" /> Delete account
                </Button>
              </CardContent>
            </Card>
          )}

          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title={`Delete ${user.name}?`}
            description="This cannot be undone."
            destructive
            detail={
              <>
                Their account, every conversation and all{" "}
                <strong>{user._count.messages}</strong> of their messages are
                deleted permanently.
              </>
            }
            confirmText={user.email}
            confirmLabel="Delete permanently"
            onConfirm={async () => {
              try {
                await api.del(`/api/admin/users/${user.id}`);
                toast.success(`${user.name} deleted`);
                router.push("/admin/users");
              } catch (error) {
                toast.error(
                  error instanceof ApiError ? error.message : "Couldn't delete that user.",
                );
                throw error;
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
