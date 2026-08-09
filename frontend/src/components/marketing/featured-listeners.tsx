import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ListenerCard } from "@/components/marketing/listener-card";
import { Stagger, RevealItem } from "@/components/motion/reveal";
import { Section, SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { featuredListeners } from "@/lib/data/listeners";

export function FeaturedListeners() {
  return (
    <Section id="listeners">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Meet the team"
            title="This is everyone. There's no bench."
            description="We're a small in-house team, not a marketplace — we don't take freelance listeners and we're not recruiting. The people below are the people you'll actually talk to."
            className="lg:max-w-2xl"
          />
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/listeners">
              Meet the whole team <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredListeners.map((listener) => (
            <RevealItem key={listener.id}>
              <ListenerCard listener={listener} compact />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
