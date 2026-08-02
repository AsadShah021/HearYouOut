import { ConversationModes } from "@/components/marketing/conversation-modes";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureBento } from "@/components/marketing/feature-bento";
import { FeaturedListeners } from "@/components/marketing/featured-listeners";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { NotTherapy } from "@/components/marketing/not-therapy";
import { PricingSection } from "@/components/marketing/pricing-section";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustBar } from "@/components/marketing/trust-bar";
import { faqs } from "@/lib/data/marketing";
import {
  faqJsonLd,
  JsonLd,
  organizationJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={serviceJsonLd()} />
      <JsonLd data={faqJsonLd(faqs)} />

      <Hero />
      <TrustBar />
      <ConversationModes />
      <HowItWorks />
      <ServicesGrid limit={4} />
      <FeaturedListeners />
      <NotTherapy />
      <FeatureBento />
      <Testimonials />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
