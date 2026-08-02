import { PageHeader } from "@/components/dashboard/app-shell";
import { TeamChatInbox } from "@/components/dashboard/team-chat-inbox";
import { teamChats } from "@/lib/data/demo";

export default function TeamChatsPage() {
  const waiting = teamChats.filter((chat) => chat.status === "waiting").length;

  return (
    <>
      <PageHeader
        title="Live chats"
        description="Visitors and members land in the same queue. Whoever is free picks it up."
        badge={waiting > 0 ? `${waiting} waiting for a reply` : "Nobody waiting"}
      />
      <TeamChatInbox />
    </>
  );
}
