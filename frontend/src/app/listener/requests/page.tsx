import { PageHeader } from "@/components/dashboard/app-shell";
import { RequestQueue } from "@/components/dashboard/request-queue";

export default function RequestsPage() {
  return (
    <>
      <PageHeader
        title="Meeting requests"
        description="Every request lands here. Read it, confirm a time, and the member gets an email."
      />
      <RequestQueue />
    </>
  );
}
