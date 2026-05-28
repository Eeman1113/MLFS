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
  name: SITE_TITLE,
  alternateName: "MLFS",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
  },
  publisher: {
    "@type": "Person",
    name: "Eeman Majumder",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Eeman Majumder",
  url: "https://github.com/Eeman1113",
  sameAs: [
    "https://github.com/Eeman1113",
    "https://github.com/Eeman1113/MLFS",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
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
