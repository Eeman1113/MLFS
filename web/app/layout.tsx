import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PyodideProvider } from "@/components/pyodide-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MLFS – Machine Learning From Scratch",
  description:
    "A book that's only 69 pages long and tries to seduce you into loving ML. Now an interactive web experience.",
  authors: [{ name: "Eeman Majumder" }],
  openGraph: {
    title: "MLFS – Machine Learning From Scratch",
    description: "For those who have the urge to learn everything.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <PyodideProvider>
            <SiteHeader />
            <main className="relative z-10">{children}</main>
            <SiteFooter />
          </PyodideProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
