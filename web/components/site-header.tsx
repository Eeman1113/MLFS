"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "bg-background/85 backdrop-blur" : "bg-background border-transparent"
      }`}
    >
      <div className="mx-auto max-w-5xl px-6 flex h-14 items-center justify-between">
        <Link href="/" className="font-display font-semibold tracking-tight text-sm">
          MLFS
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/#toc"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Chapters
          </Link>
          <Link
            href="/authors-note"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Author's Note
          </Link>
          <a
            href="https://github.com/Eeman1113/MLFS"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </nav>
      </div>
    </header>
  );
}
