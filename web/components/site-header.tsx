"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, BookOpen } from "lucide-react";
import { CHAPTERS, PARTS } from "@/lib/chapters";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-full bg-foreground text-background grid place-items-center font-display font-black">
            M
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-sm tracking-tight">MLFS</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Machine Learning From Scratch
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/#parts" className="px-3 py-2 text-sm hover:underline underline-offset-4">
            Parts
          </Link>
          <Link href="/#toc" className="px-3 py-2 text-sm hover:underline underline-offset-4">
            Chapters
          </Link>
          <Link href="/authors-note" className="px-3 py-2 text-sm hover:underline underline-offset-4">
            Author's Note
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Menu className="size-4" />
                <span className="hidden sm:inline">Index</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
              <h2 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
                <BookOpen className="size-5" /> Table of Contents
              </h2>
              <div className="grid gap-5 mt-4">
                {PARTS.map((p) => (
                  <div key={p.num}>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Part {p.num} · {p.subtitle}
                    </div>
                    <div className="font-display font-semibold text-lg mb-2">{p.title}</div>
                    <ul className="space-y-1">
                      {CHAPTERS.filter((c) => c.partNum === p.num).map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/chapters/${c.slug}`}
                            className="flex items-center gap-3 text-sm py-1.5 px-2 -mx-2 rounded-md hover:bg-muted"
                          >
                            <span className="text-muted-foreground text-xs font-mono w-6">
                              {String(c.num).padStart(2, "0")}
                            </span>
                            <span className="truncate">{c.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
