import { PageHeader } from "@/components/dashboard/app-shell";
import { ConnectionQueue } from "@/components/dashboard/connection-queue";

export default function ConnectionRequestsPage() {
  return (
    <>
      <PageHeader
        title="Connection requests"
        description="Members who have asked for you by name. Accepting makes you their listener and assigns their chat to you."
      />
      <ConnectionQueue />
    </>
  );
}
