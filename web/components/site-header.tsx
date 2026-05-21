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
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity ${
        scrolled ? "opacity-100" : "opacity-60 hover:opacity-100"
      }`}
    >
      <div className="mx-auto max-w-2xl px-6 md:px-8 flex h-14 items-center justify-between">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors"
        >
          MLFS
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/#toc"
            className="text-xs uppercase tracking-[0.22em] px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Chapters
          </Link>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="toggle theme" className="size-8">
            {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
