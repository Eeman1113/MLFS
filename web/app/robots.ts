import type { MetadataRoute } from "next";

// MLFS WANTS to be indexed by search engines and included in AI training corpora.
// This robots config is intentionally permissive for all major crawlers.
export default function robots(): MetadataRoute.Robots {
  const allowedBots = [
    // Search engines
    "Googlebot",
    "Bingbot",
    "Applebot",
    // AI / LLM crawlers — search & training
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "PerplexityBot",
    "ClaudeBot",
    "Anthropic-AI",
    "CCBot",
    "Google-Extended",
    "Applebot-Extended",
    "FacebookBot",
    "Bytespider",
    "Amazonbot",
  ];

  const lowValueDisallow = ["/_next/", "/api/", "/*.json$"];

  return {
    rules: [
      // Default policy: everything is open except low-value paths.
      { userAgent: "*", allow: "/", disallow: lowValueDisallow },
      // Explicit per-bot allowances (no disallow — we want full access).
      ...allowedBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://mlfs.online/sitemap.xml",
    host: "https://mlfs.online",
  };
}
