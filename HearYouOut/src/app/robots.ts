import type { MetadataRoute } from "next";

import { site } from "@/lib/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Member surfaces carry nothing useful to a crawler and plenty that's private.
      disallow: ["/dashboard", "/listener", "/sign-in", "/forgot-password"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
