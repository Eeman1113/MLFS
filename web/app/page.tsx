import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHAPTERS, PARTS } from "@/lib/chapters";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 md:pt-28 pb-16">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Machine Learning From Scratch
          </div>
          <h1 className="font-display font-bold tracking-tight text-4xl md:text-6xl leading-[1.05]">
            A 69-page seduction into ML — now an interactive, runnable book.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            For those who have the urge to learn everything. Read the same words from the book;
            run the algorithms inline in Python; watch the charts update as you tweak.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/chapters/01-flowcharts">Start reading</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#toc">Browse chapters</Link>
            </Button>
            <Button asChild variant="ghost">
              <a href="./MLFS.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                PDF <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Parts */}
      <section id="parts" className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border">
          {PARTS.map((p) => {
            const chapters = CHAPTERS.filter((c) => c.partNum === p.num);
            return (
              <div key={p.num} className="bg-background p-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Part {p.num}
                </div>
                <h3 className="font-display font-semibold text-lg mt-1 tracking-tight">
                  {p.title}
                </h3>
                <div className="text-sm text-muted-foreground italic">{p.subtitle}</div>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/chapters/${c.slug}`}
                        className="flex items-center gap-3 text-sm py-0.5 hover:underline underline-offset-4"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums w-6">
                          {String(c.num).padStart(2, "0")}
                        </span>
                        <span>{c.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOC */}
      <section id="toc" className="mx-auto max-w-5xl px-6 pb-20 scroll-mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display font-bold text-2xl tracking-tight">All chapters</h2>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            15 chapters
          </div>
        </div>
        <ol className="divide-y border-y">
          {CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/chapters/${c.slug}`}
                className="group flex items-baseline gap-5 py-4 px-1 hover:bg-muted/40 transition-colors"
              >
                <span className="text-xs text-muted-foreground tabular-nums w-8 shrink-0 mt-1">
                  {String(c.num).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 truncate">{c.blurb}</div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground shrink-0 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Dedication */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="border-l-2 pl-5 max-w-xl">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Dedication
          </div>
          <p className="font-display italic text-lg leading-relaxed">
            To mumma and papa for being such amazing parents, love you both.
          </p>
        </div>
      </section>
    </div>
  );
}
