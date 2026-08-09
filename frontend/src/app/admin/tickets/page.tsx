import { PageHeader } from "@/components/dashboard/app-shell";
import { RequestQueue } from "@/components/dashboard/request-queue";

export default function AdminTicketsPage() {
  return (
    <>
      <PageHeader
        title="Meeting tickets"
        description="Every meeting request arrives here as a ticket. Read it, approve it with a time, and the member is notified."
      />
      <RequestQueue />
    </>
  );
}
