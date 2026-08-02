import {
  MeetingRequestForm,
  type RequestPrefill,
} from "@/components/booking/meeting-request-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/shared/section";
import { sessionModeMap, site } from "@/lib/data/site";
import { createMetadata } from "@/lib/seo";
import type { SessionMode } from "@/types";

export const metadata = createMetadata({
  title: "Request a meeting",
  description:
    "Tell us the format you'd like, when you're free and what's on your mind. A real person reads every request and confirms a time by email, usually within 4 hours.",
  path: "/book",
});

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mode = first(params.mode);

  const prefill: RequestPrefill = {
    listener: first(params.listener),
    mode: mode && mode in sessionModeMap ? (mode as SessionMode) : undefined,
    service: first(params.service),
  };

  return (
    <>
      <PageHero
        eyebrow={`A person replies within ${site.requestResponseTime}`}
        title="Tell us when you're free and"
        highlight="we'll set it up"
        description="We don't hand you a calendar of open slots. Send us the details, one of us reads it properly, and we come back with a confirmed time and an invitation."
        className="pb-10"
      />

      <Section className="pt-0">
        <div className="container-page">
          <MeetingRequestForm prefill={prefill} />
        </div>
      </Section>
    </>
  );
}
