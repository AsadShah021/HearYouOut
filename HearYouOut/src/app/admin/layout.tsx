import { AdminShell } from "@/components/dashboard/admin-shell";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin",
  description: "Tickets, messages and user management.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
