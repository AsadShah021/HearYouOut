import { CtaSection } from "@/components/marketing/cta-section";
import { ListenerDirectory } from "@/components/marketing/listener-directory";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/shared/section";
import { publicAssetExists } from "@/lib/assets";
import { listeners } from "@/lib/data/listeners";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Meet the team",
  description:
    "The whole SnugTalk team — in-house, named, and trained. Filter by focus area, language and conversation format, then chat now or request a session with them.",
  path: "/listeners",
});

export default function ListenersPage() {
  const videoSlugs = listeners
    .filter((listener) => publicAssetExists(listener.introVideo))
    .map((listener) => listener.slug);

  return (
    <>
      <PageHero
        eyebrow={`${listeners.length} listeners, all in-house`}
        title="This is the whole team you'd"
        highlight="be talking to"
        description="We're not a marketplace and we don't hire freelancers — everyone here is part of the team, writes their own introduction, and can be asked for by name."
      />

      <Section className="pt-0">
        <div className="container-page">
          <ListenerDirectory videoSlugs={videoSlugs} />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
