import Link from "next/link";
import { Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t">
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-display font-bold text-lg tracking-tight">MLFS</div>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              A 69-page seduction into machine learning, by Eeman Majumder. Now an
              interactive, runnable book.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Read
            </div>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/authors-note" className="hover:underline">Author's Note</Link></li>
              <li><Link href="/#toc" className="hover:underline">Chapters</Link></li>
              <li><a href="./MLFS.pdf" className="hover:underline" target="_blank" rel="noreferrer">PDF (69 pages)</a></li>
              <li><a href="./backup_index.html" className="hover:underline" target="_blank" rel="noreferrer">Original flipbook</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Source
            </div>
            <a
              href="https://github.com/Eeman1113/MLFS"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
            >
              <Github className="size-4" /> github.com/Eeman1113/MLFS
            </a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Eeman Majumder · MIT</div>
          <div>
            "Screw it. Let's just do this."
          </div>
        </div>
      </div>
    </footer>
  );
}
