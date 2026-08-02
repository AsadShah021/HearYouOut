import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Sign in",
  description: "Sign in to HearMeOut to reach your listeners, sessions and notes.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
