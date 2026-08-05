import Link from "next/link";
import { CalendarClock, Clock3, Lock, MessageSquareText, Users } from "lucide-react";

import { ChatPanel } from "@/components/chat/chat-panel";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { listeners } from "@/lib/data/listeners";
import { ListenerAvatar } from "@/components/brand/listener-avatar";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Chat with a listener",
  description:
    "Open a chat and start writing. A real person on our team reads it and replies in the same thread — no appointment, no bot, no waiting room.",
  path: "/chat",
  keywords: [
    "chat with a listener",
    "someone to talk to online",
    "live chat listening",
    "talk to a real person",
  ],
});

const assurances = [
  {
    icon: Users,
    title: "A person, not a bot",
    body: "Every reply in this chat is typed by someone on our team. We will never put a model in front of you and call it a listener.",
  },
  {
    icon: Clock3,
    title: "No appointment needed",
    body: "Write now, leave, come back tonight. The thread stays exactly where you left it and so do we.",
  },
  {
    icon: Lock,
    title: "Encrypted and unrecorded",
    body: "Chats are encrypted in transit and at rest. Nothing is sold, nothing trains a model, and you can delete the whole thread whenever you like.",
  },
];

export default function ChatPage() {
  const online = listeners.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <span className="bg-success size-1.5 rounded-full" />
            {online.length} listeners online now
          </>
        }
        title="Start talking. We're"
        highlight="already listening"
        description="No form to book, no slot to pick, no queue. Open the chat, write whatever's on your mind, and someone on our team will answer you here."
        className="pb-8"
      />

      <Section className="pt-0">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
            <Reveal>
              <ChatPanel />
            </Reveal>

            <div className="flex flex-col gap-4">
              <Reveal delay={0.1}>
                <div className="border-border/70 bg-card rounded-3xl border p-6">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    On shift right now
                  </p>
                  <div className="mt-5 flex flex-col gap-4">
                    {online.map((listener) => (
                      <div key={listener.id} className="flex items-center gap-3">
                        <ListenerAvatar name={listener.name} src={listener.avatar} size="sm" online />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{listener.name}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {listener.specialties[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground border-border/60 mt-5 border-t pt-4 text-xs leading-relaxed">
                    You don&rsquo;t choose who answers a chat — whoever is free picks
                    it up. For a specific listener,{" "}
                    <Link href="/book" className="text-foreground underline underline-offset-2">
                      request a meeting
                    </Link>{" "}
                    instead.
                  </p>
                </div>
              </Reveal>

              {assurances.map((item, index) => (
                <Reveal key={item.title} delay={0.15 + index * 0.05}>
                  <div className="border-border/70 bg-card flex gap-4 rounded-3xl border p-6">
                    <span className="bg-primary/8 text-primary ring-primary/12 grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset">
                      <item.icon className="size-4.5" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold">{item.title}</h2>
                      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.3}>
                <div className="border-primary/25 bg-primary/[0.04] flex flex-col gap-4 rounded-3xl border p-6">
                  <CalendarClock className="text-primary size-5" />
                  <div>
                    <h2 className="text-sm font-semibold">
                      Want to hear a voice instead?
                    </h2>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      Send us a request with a few times that suit you and
                      we&rsquo;ll confirm a voice or Google Meet session by email.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-fit">
                    <Link href="/book">
                      <MessageSquareText className="size-3.5" /> Request a meeting
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
