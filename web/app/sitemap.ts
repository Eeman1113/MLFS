import type { MetadataRoute } from "next";
import { CHAPTERS } from "@/lib/chapters";

const SITE_URL = "https://mlfs.online";

// Next.js's MetadataRoute.Sitemap supports an `images` field at runtime
// (sitemap image extension), but the installed TS types for Next 14.2 don't
// expose it. We extend the type locally so the runtime feature is preserved
// without a TypeScript error.
type SitemapEntry = MetadataRoute.Sitemap[number] & { images?: string[] };

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable lastmod is more trustworthy to crawlers than always-now.
  const lastModified = new Date("2026-05-25");

  const ogImage = `${SITE_URL}/opengraph-image`;

  const staticEntries: SitemapEntry[] = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
      images: [ogImage],
    },
    {
      url: `${SITE_URL}/chapters/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      images: [ogImage],
    },
    {
      url: `${SITE_URL}/authors-note/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
      images: [ogImage],
    },
    {
      url: `${SITE_URL}/feed.xml`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Downloadable book — exposed so Google's file indexing can pick it up.
    {
      url: `${SITE_URL}/MLFS.pdf`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    // AI-friendly summaries — help LLM crawlers discover the canonical summary.
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const chapterEntries: SitemapEntry[] = CHAPTERS.map((chapter) => ({
    url: `${SITE_URL}/chapters/${chapter.slug}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${SITE_URL}/chapters/${chapter.slug}/opengraph-image`],
  }));

  return [...staticEntries, ...chapterEntries] as MetadataRoute.Sitemap;
}
