import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PyodideProvider } from "@/components/pyodide-provider";
import { SiteHeader } from "@/components/site-header";
import { withBase } from "@/lib/utils";

const GA_MEASUREMENT_ID = "G-SM4SHNW88M";

const SITE_URL = "https://mlfs.online";
const SITE_NAME = "MLFS";
const SITE_TITLE = "MLFS – Machine Learning From Scratch";
const SITE_DESCRIPTION =
  "Machine Learning From Scratch (MLFS) by Eeman Majumder is a hands-on, no-fluff introduction to ML in just 69 pages. Interactive demos for linear regression, decision trees, KNN, naive Bayes, clustering, neural networks, ethics, end-to-end projects, and LLMs. Free, online, irreverent.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · MLFS",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "machine learning",
    "ml from scratch",
    "python machine learning",
    "learn ML",
    "neural networks",
    "deep learning",
    "linear regression",
    "decision trees",
    "KNN",
    "naive bayes",
    "clustering",
    "ethics in AI",
    "LLMs",
    "ML book",
    "free ml book",
    "beginner machine learning",
    "interactive ML",
    "MLFS",
  ],
  authors: [{ name: "Eeman Majumder", url: "https://github.com/Eeman1113" }],
  creator: "Eeman Majumder",
  publisher: "Eeman Majumder",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "MLFS RSS Feed" }],
    },
  },
  icons: {
    icon: [
      { url: withBase("/icon-light.png"), type: "image/png" },
      { url: withBase("/icon-light.png"), type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: withBase("/icon-dark.png"), type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: withBase("/icon-light.png"),
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "MLFS – Machine Learning From Scratch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "education",
  // Placeholders for Bing/Yandex/etc. — Google is already verified via the
  // meta tag added directly through Search Console. To add another engine,
  // fill in the corresponding key below. Keys map to standard meta tags.
  // verification: {
  //   google: "PASTE_GOOGLE_VERIFICATION_HERE",
  //   yandex: "PASTE_YANDEX_VERIFICATION_HERE",
  //   yahoo: "PASTE_YAHOO_VERIFICATION_HERE",
  //   other: {
  //     "msvalidate.01": "PASTE_BING_WEBMASTER_HERE",
  //     "facebook-domain-verification": "PASTE_FB_DOMAIN_HERE",
  //     "p:domain_verify": "PASTE_PINTEREST_HERE",
  //   },
  // },
  other: {
    // Explicit author + identity claims that some crawlers still read.
    "author": "Eeman Majumder",
    "designer": "Eeman Majumder",
    "reply-to": "eemanwithai@gmail.com",
    "rating": "general",
    "distribution": "global",
    "revisit-after": "7 days",
    // Rich-result hints for Google Discover.
    "referrer": "origin-when-cross-origin",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_TITLE,
  alternateName: ["MLFS", "Machine Learning From Scratch"],
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  copyrightYear: 2025,
  copyrightHolder: { "@id": `${SITE_URL}/#person` },
  author: { "@id": `${SITE_URL}/#person` },
  publisher: { "@id": `${SITE_URL}/#person` },
  // Voice-search / assistant hint — read the h1 and h2s aloud.
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Eeman Majumder",
  alternateName: "Eeman",
  url: "https://github.com/Eeman1113",
  image: `${SITE_URL}/logo.png`,
  jobTitle: "Independent Author & Machine Learning Engineer",
  description:
    "Independent author and engineer. Wrote Machine Learning From Scratch (MLFS), a free 69-page interactive ML book at mlfs.online.",
  nationality: "Indian",
  knowsAbout: [
    "Machine Learning",
    "Deep Learning",
    "Neural Networks",
    "Large Language Models",
    "Python",
    "NumPy",
    "scikit-learn",
    "Data Science",
    "AI Ethics",
    "Educational Content Design",
  ],
  knowsLanguage: ["en", "hi", "bn"],
  sameAs: [
    "https://github.com/Eeman1113",
    "https://github.com/Eeman1113/MLFS",
    "https://mlfs.online/",
  ],
  worksFor: { "@id": `${SITE_URL}/#organization` },
};

// Organization schema so search engines can treat MLFS as a brand entity
// (Knowledge Panel eligibility, "About this result" enrichment).
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "EducationalOrganization"],
  "@id": `${SITE_URL}/#organization`,
  name: "MLFS – Machine Learning From Scratch",
  alternateName: "MLFS",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
    caption: "MLFS logo",
  },
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  founder: { "@id": `${SITE_URL}/#person` },
  foundingDate: "2025-01-01",
  slogan: "Get addicted to ML.",
  sameAs: [
    "https://github.com/Eeman1113/MLFS",
    "https://github.com/Eeman1113",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Speed up GA handshake — CWV feeds ranking. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Identity claims (rel=me) for verified authorship + rel=author. */}
        <link rel="me" href="https://github.com/Eeman1113" />
        <link rel="author" href="https://github.com/Eeman1113" />
      </head>
      <body className="font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ThemeProvider>
          <PyodideProvider>
            <SiteHeader />
            <main className="relative z-10">{children}</main>
          </PyodideProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
