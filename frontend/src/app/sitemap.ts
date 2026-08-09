import type { MetadataRoute } from "next";

import { site } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/chat", priority: 0.9, changeFrequency: "monthly" },
    { path: "/book", priority: 0.8, changeFrequency: "weekly" },
    { path: "/sign-up", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  // Listener profiles are parked with the /listeners route — restore this block
  // alongside it:
  //   const profiles = listeners.map((l) => ({ path: `/listeners/${l.slug}`, ... }))
  return routes.map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
