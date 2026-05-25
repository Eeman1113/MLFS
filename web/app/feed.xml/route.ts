import { CHAPTERS } from "@/lib/chapters";

// Static export compatibility: this route must be pre-rendered at build time.
export const dynamic = "force-static";

const SITE_URL = "https://mlfs.online";
const AUTHOR = "Eeman Majumder";
const AUTHOR_HANDLE = "eeman@mlfs.online (Eeman Majumder)";
const LONG_DESCRIPTION =
  "MLFS – Machine Learning From Scratch. A 69-page interactive book that gets you addicted to machine learning. Sixteen chapters covering everything from flowcharts and the math you can't ignore through linear regression, classification, decision trees, KNN, naive Bayes, clustering, neural networks, an end-to-end ML project, and a bonus deep dive on LLMs — all explained without the gatekeeping, written by Eeman Majumder.";

// Escape characters that are illegal inside XML text / attributes.
function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Compute a sequential pubDate so each chapter has a stable, monotonic publication time.
function pubDateFor(index: number): string {
  // Start on 2025-01-01 UTC, add 7 days per chapter.
  const base = Date.UTC(2025, 0, 1, 12, 0, 0);
  const millis = base + index * 7 * 24 * 60 * 60 * 1000;
  return new Date(millis).toUTCString();
}

function buildRss(): string {
  const lastBuildDate = new Date("2026-05-25T12:00:00Z").toUTCString();

  const items = CHAPTERS.map((chapter, i) => {
    const link = `${SITE_URL}/chapters/${chapter.slug}/`;
    return `    <item>
      <title>${escapeXml(chapter.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(chapter.blurb)}</description>
      <pubDate>${pubDateFor(i)}</pubDate>
      <category>${escapeXml(chapter.part)}</category>
      <author>${escapeXml(AUTHOR_HANDLE)}</author>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("MLFS – Machine Learning From Scratch")}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(LONG_DESCRIPTION)}</description>
    <language>en-us</language>
    <copyright>${escapeXml(`Copyright ${new Date("2026-05-25").getUTCFullYear()} ${AUTHOR}`)}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js</generator>
    <managingEditor>${escapeXml(AUTHOR_HANDLE)}</managingEditor>
    <webMaster>${escapeXml(AUTHOR_HANDLE)}</webMaster>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>${escapeXml("MLFS – Machine Learning From Scratch")}</title>
      <link>${SITE_URL}/</link>
    </image>
${items}
  </channel>
</rss>
`;
}

export async function GET(): Promise<Response> {
  const body = buildRss();
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
