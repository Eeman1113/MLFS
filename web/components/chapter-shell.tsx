import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getChapter, getNext, getPrev } from "@/lib/chapters";
import { ReadingProgress } from "./reading-progress";
import { RightRail } from "./right-rail";
import { WordCount } from "./word-count";

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
      <RightRail />
      <WordCount />
      <article className="mx-auto max-w-2xl px-6 md:px-8 pt-20 md:pt-28 pb-32">
        <h1 className="font-display font-bold tracking-tight text-3xl md:text-4xl leading-[1.18]">
          {meta.title}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Part {meta.partNum} · Chapter {String(meta.num).padStart(2, "0")}
        </p>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed italic">
          {meta.blurb}
        </p>

        <div className="prose-book max-w-none mt-12">{children}</div>

        <nav className="mt-24 pt-6 border-t flex items-center justify-between text-sm">
          {prev ? (
            <Link
              href={`/chapters/${prev.slug}`}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">{prev.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
          )}
          {next ? (
            <Link
              href={`/chapters/${next.slug}`}
              className="group flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity"
            >
              <span className="hidden sm:inline">{next.title}</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <Link href="/" className="text-foreground hover:opacity-70 transition-opacity">
              Home →
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
