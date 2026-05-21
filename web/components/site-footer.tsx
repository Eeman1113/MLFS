import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Eeman Majumder · MIT</div>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/authors-note" className="hover:text-foreground transition-colors">Author's Note</Link>
          <Link href="/#toc" className="hover:text-foreground transition-colors">Chapters</Link>
          <a href="https://tinyurl.com/mlfs-study" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">PDF</a>
          <a href="./backup_index.html" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Flipbook</a>
          <a href="https://github.com/Eeman1113/MLFS" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>
      </div>
    </footer>
  );
}
