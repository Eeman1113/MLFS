"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { withBase } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { DocsNav } from "./docs-sidebar";

const items = [
  { label: "Introduction", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "PDF", href: "https://drive.google.com/file/d/1AKPArWSJqyYRjcUFYKzgzcgQ3A20FA4M/view", external: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => setNavOpen(false), [pathname]);
  useEffect(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navOpen]);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    if (href.startsWith("./")) return false;
    return pathname?.startsWith(href);
  };
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-transparent">
      <div className="mx-auto max-w-screen-2xl flex h-14 items-center px-4 sm:px-5 md:px-6 gap-2 sm:gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          className="md:hidden inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors -ml-1"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 sm:mr-1 min-w-0">
          <Image
            src={withBase("/logo.png")}
            alt="MLFS"
            width={40}
            height={40}
            className="size-9 sm:size-10 shrink-0 dark:invert"
            priority
          />
          <span className="font-semibold text-sm tracking-tight">MLFS</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {items.map((it) =>
            it.external ? (
              <a
                key={it.href}
                href={it.href}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-md font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {it.label}
              </a>
            ) : (
              <Link
                key={it.href}
                href={it.href}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  isActive(it.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {it.label}
              </Link>
            )
          )}
        </nav>
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors -mr-1"
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>

      {navOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[82%] max-w-xs bg-background border-r shadow-xl flex flex-col">
            <div className="flex items-center justify-between h-14 px-4 border-b shrink-0">
              <Link
                href="/"
                onClick={() => setNavOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src={withBase("/logo.png")}
                  alt="MLFS"
                  width={32}
                  height={32}
                  className="size-8 shrink-0 dark:invert"
                />
                <span className="font-semibold text-sm tracking-tight">MLFS</span>
              </Link>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors -mr-1"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <DocsNav onNavigate={() => setNavOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
