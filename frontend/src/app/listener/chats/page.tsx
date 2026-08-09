import { PageHeader } from "@/components/dashboard/app-shell";
import { TeamChatInbox } from "@/components/dashboard/team-chat-inbox";

export default function TeamChatsPage() {
  return (
    <>
      <PageHeader
        title="Live chats"
        description="Every member thread in one queue. Whoever is free picks it up."
      />
      <TeamChatInbox />
    </>
  );
}
