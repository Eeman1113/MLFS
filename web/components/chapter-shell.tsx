import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getChapter, getNext, getPrev } from "@/lib/chapters";
import { Button } from "./ui/button";
import { DocsSidebar } from "./docs-sidebar";
import { OnThisPage } from "./on-this-page";

export function ChapterShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const meta = getChapter(slug);
  const next = getNext(slug);
  const prev = getPrev(slug);
  if (!meta) return null;

  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8">
        <article className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground mb-1">
                Part {meta.partNum} · Chapter {String(meta.num).padStart(2, "0")}
              </p>
              <h1 className="font-display font-bold tracking-tight text-3xl md:text-[2rem] leading-[1.18]">
                {meta.title}
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              {prev ? (
                <Button asChild variant="outline" size="icon" aria-label="Previous chapter">
                  <Link href={`/chapters/${prev.slug}`}>
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="icon" disabled aria-label="Previous chapter">
                  <ArrowLeft className="size-4" />
                </Button>
              )}
              {next ? (
                <Button asChild variant="outline" size="icon" aria-label="Next chapter">
                  <Link href={`/chapters/${next.slug}`}>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="icon" disabled aria-label="Next chapter">
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">{meta.blurb}</p>

          <div className="prose-book max-w-none mt-10">{children}</div>

          <nav className="mt-20 pt-6 border-t flex items-center justify-between text-sm">
            {prev ? (
              <Link
                href={`/chapters/${prev.slug}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>{prev.title}</span>
              </Link>
            ) : (
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Home
              </Link>
            )}
            {next ? (
              <Link
                href={`/chapters/${next.slug}`}
                className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity"
              >
                <span>{next.title}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <Link href="/" className="text-foreground hover:opacity-70 transition-opacity">
                Home →
              </Link>
            )}
          </nav>
        </article>
        <OnThisPage />
      </div>
    </div>
  );
}
