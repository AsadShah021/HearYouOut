import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Reset your password",
  description: "Request a password reset link for your SnugTalk account.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <AuthForm mode="forgot" />
    </Suspense>
  );
}
