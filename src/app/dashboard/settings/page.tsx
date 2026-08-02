import { PageHeader } from "@/components/dashboard/app-shell";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Your profile, what listeners see, and how much we're allowed to keep."
      />
      <div className="max-w-3xl">
        <SettingsForm />
      </div>
    </>
  );
}
