import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { getChapter, getNext, getPrev } from "@/lib/chapters";
import { Button } from "./ui/button";
import { ReadingProgress } from "./reading-progress";

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
    <>
      <ReadingProgress />
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <Link
          href="/#toc"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" /> All chapters
        </Link>

        <div className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Part {meta.partNum} · Chapter {String(meta.num).padStart(2, "0")}
        </div>
        <h1 className="mt-2 font-display font-bold tracking-tight text-3xl md:text-5xl leading-[1.1]">
          {meta.title}
        </h1>
        <p className="mt-4 text-base text-muted-foreground max-w-2xl leading-relaxed">
          {meta.blurb}
        </p>
        <hr className="mt-8 mb-10" />

        <div className="prose-book max-w-none">{children}</div>

        <div className="mt-20 pt-6 border-t flex flex-col sm:flex-row gap-3 sm:items-stretch sm:justify-between">
          {prev ? (
            <Button asChild variant="outline" className="h-auto py-3 px-4 justify-start">
              <Link href={`/chapters/${prev.slug}`} className="gap-3">
                <ArrowLeft className="size-4 shrink-0" />
                <span className="text-left min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Previous
                  </span>
                  <span className="block text-sm font-medium truncate">
                    Ch. {prev.num} · {prev.title}
                  </span>
                </span>
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button asChild className="h-auto py-3 px-4 justify-end">
              <Link href={`/chapters/${next.slug}`} className="gap-3">
                <span className="text-right min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-primary-foreground/70">
                    Next
                  </span>
                  <span className="block text-sm font-medium truncate">
                    Ch. {next.num} · {next.title}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/" className="gap-2">
                Back to home <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </article>
    </>
  );
}
