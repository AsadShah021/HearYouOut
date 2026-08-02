import { MemberShell } from "@/components/dashboard/member-shell";
import { usage } from "@/lib/data/demo";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "Your sessions, conversations, notes and saved ideas.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const renewsInDays = Math.max(
    0,
    Math.ceil((new Date(usage.cycleRenewsAt).getTime() - Date.now()) / 86_400_000),
  );

  return <MemberShell renewsInDays={renewsInDays}>{children}</MemberShell>;
}
