import Link from "next/link";
import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata: Metadata = {
  title: "Author's Note",
  description:
    "A personal note from Eeman Majumder about why he wrote Machine Learning From Scratch.",
  keywords: [
    "Eeman Majumder",
    "author's note",
    "MLFS author",
    "why I wrote MLFS",
  ],
  alternates: { canonical: "/authors-note/" },
  openGraph: {
    title: "Author's Note · MLFS",
    description: "A personal note from Eeman Majumder.",
    url: "https://mlfs.online/authors-note/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Author's Note · MLFS",
    description: "A personal note from Eeman Majumder.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://mlfs.online/" },
    { "@type": "ListItem", position: 2, name: "Author's Note", item: "https://mlfs.online/authors-note/" },
  ],
};

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://mlfs.online/authors-note/",
  name: "Author's Note · Eeman Majumder",
  dateCreated: "2025-01-01",
  dateModified: "2026-05-25",
  inLanguage: "en",
  mainEntity: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
    description:
      "Independent author and engineer who wrote Machine Learning From Scratch, a free 69-page interactive ML book.",
    sameAs: [
      "https://github.com/Eeman1113",
      "https://mlfs.online/",
    ],
  },
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://mlfs.online/authors-note/",
  name: "About the Author · MLFS",
  description:
    "A personal note from Eeman Majumder about why he wrote Machine Learning From Scratch — what the book is, who it's for, and what he hopes readers take away from it.",
  inLanguage: "en",
  dateCreated: "2025-01-01",
  dateModified: "2026-05-25",
  isPartOf: {
    "@type": "Book",
    name: "Machine Learning From Scratch",
    url: "https://mlfs.online/",
  },
  about: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
  },
};

export default function AuthorsNotePage() {
  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <DocsSidebar />
      <article className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10">
        <p className="text-[14px] leading-5 text-muted-foreground mb-1.5">Front matter</p>
        <h1
          className="font-display"
          style={{ fontSize: 30, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.75px" }}
        >
          Author's Note
        </h1>

        <div className="prose-book max-w-none mt-10">
          <p>Dear Reader,</p>
          <p>So — this book is for people who haven't quite figured it out yet.</p>
          <p>Like, yeah, you love coding. You've made projects. You've got the GitHub commits.</p>
          <p>But... it still doesn't give you that umph, that passion. You feel like something's missing.</p>
          <p>This book isn't great at teaching you ML —</p>
          <p>It's here to make you interested in ML.</p>
          <p>To make you aroused about ML.</p>
          <p>To make you feel more sure about it.</p>
          <p>You know that topic you always wanted to learn for years?</p>
          <p>The one that lowkey scared you because it felt like such a big, brain-melting undertaking?</p>
          <p>Yeah. This is that book.</p>
          <p>And it's only 69 pages.</p>
          <p>It's here to make you curious.</p>
          <p>To push you.</p>
          <p>To say: "You got this, bro. ML isn't that deep. Yet."</p>
          <p>I hope you have fun reading through the book.</p>
          <p>And most of all — I hope you leave it wanting to explore even more.</p>
          <p>
            I hope this helps you break out of procrastination and gives you a much-needed push
            toward finally saying:
          </p>
          <p>"Screw it. Let's just do this."</p>
          <p>Thank you for being here.</p>
          <p>Now let's build some smart stuff together.</p>
          <p className="mt-12 font-display font-semibold">— Eeman Majumder</p>
        </div>

        <nav className="mt-20 pt-6 border-t flex items-center justify-between text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Home
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
