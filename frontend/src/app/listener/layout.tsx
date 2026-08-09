import { ListenerShell } from "@/components/dashboard/listener-shell";
import { StaffOnly } from "@/components/dashboard/staff-only";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Listener dashboard",
  description: "Your appointments, clients, availability, earnings and reviews.",
  path: "/listener",
  noIndex: true,
});

export default function ListenerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StaffOnly>
      <ListenerShell>{children}</ListenerShell>
    </StaffOnly>
  );
}
