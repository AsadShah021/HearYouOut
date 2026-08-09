import { Suspense } from "react";

import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Verify your email",
  description: "Enter the 6-digit code we sent you to finish setting up your SnugTalk account.",
  path: "/verify-email",
  noIndex: true,
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
