import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Sign in",
  description: "Sign in to SnugTalk to reach your listeners, sessions and notes.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <AuthForm mode="sign-in" />
    </Suspense>
  );
}
