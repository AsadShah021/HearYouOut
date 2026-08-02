import type { Metadata } from "next";

import { site } from "@/lib/data/site";

/** Builds page metadata with sane OG/Twitter defaults. */
export function createMetadata({
  title,
  description,
  path = "/",
  keywords,
  noIndex,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = `${site.url}${path}`;

  return {
    title,
    description,
    keywords: keywords ?? [...site.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title,
      description,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      site: site.twitter,
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Organisation + service structured data for the landing page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    sameAs: [`https://twitter.com/${site.twitter.replace("@", "")}`],
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Human listening and conversation service",
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: "Worldwide",
    description: site.description,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: 39,
      highPrice: 179,
      offerCount: 3,
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from our own constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
