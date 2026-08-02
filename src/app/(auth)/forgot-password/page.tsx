import { AuthForm } from "@/components/auth/auth-form";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Reset your password",
  description: "Request a password reset link for your HearMeOut account.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
