"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Docs", href: "/" },
  { label: "Chapters", href: "/#toc" },
  { label: "Author's Note", href: "/authors-note" },
  { label: "PDF", href: "https://tinyurl.com/mlfs-study", external: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    if (href.startsWith("./")) return false;
    return pathname?.startsWith(href);
  };
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto max-w-screen-2xl flex h-14 items-center px-4 md:px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 mr-1">
          <div className="size-6 rounded-md bg-foreground text-background grid place-items-center font-bold text-xs">
            M
          </div>
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
      </div>
    </header>
  );
}
