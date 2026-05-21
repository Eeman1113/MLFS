import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PyodideProvider } from "@/components/pyodide-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "MLFS – Machine Learning From Scratch",
  description:
    "A book that's only 69 pages long and tries to seduce you into loving ML. Now an interactive web experience.",
  authors: [{ name: "Eeman Majumder" }],
  icons: {
    icon: [
      { url: "/icon-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/icon-light.png",
  },
  openGraph: {
    title: "MLFS – Machine Learning From Scratch",
    description: "For those who have the urge to learn everything.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
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
