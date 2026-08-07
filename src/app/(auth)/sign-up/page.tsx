import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create your account",
  description:
    "Create a HearMeOut account and start your first conversation with a trained human listener.",
  path: "/sign-up",
});

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <AuthForm mode="sign-up" />
    </Suspense>
  );
}
