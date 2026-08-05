import type { MetadataRoute } from "next";

import { listeners } from "@/lib/data/listeners";
import { site } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
    { path: "/chat", priority: 0.9, changeFrequency: "monthly" },
    { path: "/listeners", priority: 0.8, changeFrequency: "monthly" },
    { path: "/book", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/sign-up", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  // One entry per listener profile — these are the pages people search by name.
  const profiles = listeners.map((listener) => ({
    path: `/listeners/${listener.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...routes, ...profiles].map((route) => ({
    url: `${site.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
