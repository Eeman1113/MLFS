import Link from "next/link";
import type { Metadata } from "next";
import { CHAPTERS, PARTS, partLabel } from "@/lib/chapters";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata: Metadata = {
  title: "All Chapters",
  description:
    "Browse all 16 chapters of Machine Learning From Scratch — from flowcharts and linear regression to neural networks, ethics, and LLMs. Free, interactive, 69 pages total.",
  keywords: [
    "MLFS chapters",
    "machine learning chapters",
    "ML curriculum",
    "free ML book chapters",
    "interactive ML lessons",
  ],
  alternates: { canonical: "/chapters/" },
  openGraph: {
    title: "All Chapters · MLFS",
    description: "All 16 chapters of Machine Learning From Scratch.",
    url: "https://mlfs.online/chapters/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Chapters · MLFS",
    description: "All 16 chapters of Machine Learning From Scratch.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://mlfs.online/" },
    { "@type": "ListItem", position: 2, name: "Chapters", item: "https://mlfs.online/chapters/" },
  ],
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MLFS Chapters",
  itemListElement: CHAPTERS.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.title,
    url: `https://mlfs.online/chapters/${c.slug}/`,
  })),
};

export default function ChaptersIndex() {
  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <DocsSidebar />
      <article className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10">
        <p className="text-[14px] leading-5 text-muted-foreground mb-1.5">
          Table of Contents
        </p>
        <h1
          className="font-display"
          style={{ fontSize: 30, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.75px" }}
        >
          Chapters
        </h1>
        <p className="text-muted-foreground mt-3" style={{ fontSize: 16, lineHeight: "24px" }}>
          15 chapters across three parts, plus a bonus deep-dive on LLMs. Read in order, or jump anywhere.
        </p>

        <div className="prose-book max-w-none mt-10">
          {PARTS.map((p) => {
            const chapters = CHAPTERS.filter((c) => c.partNum === p.num);
            return (
              <div key={p.num} className="mt-8 first:mt-0">
                <h2 id={`part-${p.num}`}>{partLabel(p)}</h2>
                <p className="text-sm text-muted-foreground italic !mt-0">{p.subtitle}</p>
                <ol className="!list-none !pl-0 flex flex-col gap-1.5 !mt-4">
                  {chapters.map((c) => (
                    <li key={c.slug} className="!my-0">
                      <Link
                        href={`/chapters/${c.slug}`}
                        className="group grid grid-cols-[2rem_1fr] gap-3 items-baseline py-1 hover:text-foreground"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {String(c.num).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="group-hover:underline underline-offset-4">
                            {c.title}
                          </span>
                          <span className="block text-sm text-muted-foreground">{c.blurb}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>

        <nav className="mt-20 pt-6 border-t flex items-center justify-between text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Introduction
          </Link>
          <Link
            href="/chapters/01-flowcharts"
            className="text-foreground hover:opacity-70 transition-opacity"
          >
            Chapter 1 →
          </Link>
        </nav>
      </article>
    </div>
  );
}
