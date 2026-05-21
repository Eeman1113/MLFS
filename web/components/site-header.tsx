"use client";
import Link from "next/link";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CHAPTERS, PARTS } from "@/lib/chapters";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const onChapter = pathname?.startsWith("/chapters/");
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-2xl flex h-14 items-center px-4 md:px-6 gap-3">
        <Link href="/" className="flex items-center gap-2 mr-2">
          <div className="size-6 rounded-md bg-foreground text-background font-bold text-xs grid place-items-center">
            M
          </div>
          <span className="font-semibold text-sm tracking-tight">MLFS</span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
              !onChapter ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Docs
          </Link>
          <Link
            href="/#toc"
            className="px-2.5 py-1.5 rounded-md font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Chapters
          </Link>
          <Link
            href="/authors-note"
            className="px-2.5 py-1.5 rounded-md font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Author's Note
          </Link>
          <a
            href="./MLFS.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-md font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            PDF
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
            <a href="https://github.com/Eeman1113/MLFS" target="_blank" rel="noreferrer">
              <Github className="size-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="toggle theme" className="size-8">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

export { CHAPTERS, PARTS };
