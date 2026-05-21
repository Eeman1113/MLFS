import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { getChapter, getNext, getPrev } from "@/lib/chapters";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ReadingProgress } from "./reading-progress";

export function ChapterShell({
  slug,
  children,
  rightAside,
}: {
  slug: string;
  children: React.ReactNode;
  rightAside?: React.ReactNode;
}) {
  const meta = getChapter(slug);
  const next = getNext(slug);
  const prev = getPrev(slug);
  if (!meta) return null;
  return (
    <>
      <ReadingProgress />
      <article className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/#toc"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" /> all chapters
          </Link>
          <div className="mt-6 flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono">
              Part {meta.partNum} · Ch. {String(meta.num).padStart(2, "0")}
            </Badge>
            <Badge variant="ghost" className="font-normal">
              {meta.part}
            </Badge>
          </div>
          <h1 className="font-display font-black tracking-tight text-4xl md:text-6xl leading-[1.05]">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{meta.blurb}</p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr] gap-12">
          <div className="prose-book max-w-3xl mx-auto w-full">{children}</div>
        </div>

        <div className="max-w-3xl mx-auto mt-24 pt-8 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {prev ? (
            <Button asChild variant="outline">
              <Link href={`/chapters/${prev.slug}`} className="gap-2">
                <ArrowLeft className="size-4" />
                <span className="text-left">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Previous
                  </span>
                  <span className="block text-sm font-medium">Ch. {prev.num} · {prev.title}</span>
                </span>
              </Link>
            </Button>
          ) : <span />}
          {next ? (
            <Button asChild>
              <Link href={`/chapters/${next.slug}`} className="gap-2">
                <span className="text-right">
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70">
                    Next
                  </span>
                  <span className="block text-sm font-medium">Ch. {next.num} · {next.title}</span>
                </span>
                <ArrowRight className="size-4" />
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
