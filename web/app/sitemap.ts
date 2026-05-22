import type { MetadataRoute } from "next";
import { CHAPTERS } from "@/lib/chapters";

const SITE_URL = "https://mlfs.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/chapters/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/authors-note/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const chapterEntries: MetadataRoute.Sitemap = CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/chapters/${chapter.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...chapterEntries];
}
