import { PageHeader } from "@/components/dashboard/app-shell";
import { ConnectionQueue } from "@/components/dashboard/connection-queue";

export default function AdminConnectionRequestsPage() {
  return (
    <>
      <PageHeader
        title="Connection requests"
        description="Members who have asked for you by name."
      />
      <ConnectionQueue />
    </>
  );
}
