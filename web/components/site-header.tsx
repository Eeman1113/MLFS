"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { withBase } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const items = [
  { label: "Introduction", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "PDF", href: "https://drive.google.com/file/d/1AKPArWSJqyYRjcUFYKzgzcgQ3A20FA4M/view", external: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    if (href.startsWith("./")) return false;
    return pathname?.startsWith(href);
  };
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto max-w-screen-2xl flex h-14 items-center px-4 md:px-6 gap-4">
        <Link href="/" className="flex items-center gap-2.5 mr-1">
          <Image
            src={withBase("/logo.png")}
            alt="MLFS"
            width={40}
            height={40}
            className="size-10 shrink-0 dark:invert"
            priority
          />
          <span className="font-semibold text-sm tracking-tight">MLFS</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
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
          className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>
    </header>
  );
}
