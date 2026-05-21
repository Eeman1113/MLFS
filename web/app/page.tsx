import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Gauge, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHAPTERS, PARTS } from "@/lib/chapters";

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="container relative pt-20 md:pt-32 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 font-mono tracking-widest gap-1.5 px-3 py-1">
              <Sparkles className="size-3" /> v1 · interactive edition
            </Badge>
            <h1 className="font-display font-black tracking-[-0.04em] text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              Machine Learning
              <br />
              <span className="shimmer-text">From Scratch.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              For those who have the urge to learn everything.
              <br className="hidden md:block" />
              A 69-page seduction into ML — now an interactive,
              runnable book with live Python in your browser.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/chapters/01-flowcharts">
                  <BookOpen className="size-4" /> Start reading
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="#toc">
                  Browse chapters <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="gap-2">
                <a href="./MLFS.pdf" target="_blank" rel="noreferrer">
                  Or the OG PDF
                </a>
              </Button>
            </div>
            <div className="mt-14 grid grid-cols-3 max-w-xl mx-auto text-center">
              <Stat n="15" label="chapters" />
              <Stat n="∞" label="runnable cells" />
              <Stat n="69" label="cig pages" />
            </div>
          </div>
        </div>

        <div className="relative pb-16 marquee opacity-70">
          <div className="marquee__inner whitespace-nowrap text-xs md:text-sm font-mono uppercase tracking-[0.25em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-10">
                <span>Linear Regression</span>
                <span>·</span>
                <span>Logistic</span>
                <span>·</span>
                <span>Decision Trees</span>
                <span>·</span>
                <span>KNN</span>
                <span>·</span>
                <span>Naïve Bayes</span>
                <span>·</span>
                <span>K-Means</span>
                <span>·</span>
                <span>Neural Networks</span>
                <span>·</span>
                <span>Cross-Validation</span>
                <span>·</span>
                <span>Bias / Variance</span>
                <span>·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Why this version
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">
            Read it. Run it. Bend it.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every algorithm in the book is also a live cell on the page —
            real Python (numpy works!) executing in your browser via Pyodide,
            with charts that respond to your every keystroke.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Feature
            icon={<Code2 className="size-5" />}
            title="Runnable Python"
            body="Edit, hit run. Pyodide loads numpy / matplotlib lazily so the page stays fast."
          />
          <Feature
            icon={<Gauge className="size-5" />}
            title="Live charts"
            body="Highcharts visualizations driven by sliders — see learning rate, k, depth, loss in real time."
          />
          <Feature
            icon={<BookOpen className="size-5" />}
            title="Same words"
            body="Not a single sentence touched. The book's voice, with a body of interactive proof."
          />
        </div>
      </section>

      {/* PARTS */}
      <section id="parts" className="container py-16">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Three parts
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">
            The arc.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PARTS.map((p) => {
            const chapters = CHAPTERS.filter((c) => c.partNum === p.num);
            return (
              <Card key={p.num} className="hover-lift overflow-hidden">
                <CardContent className="p-7">
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Part {p.num}
                  </div>
                  <h3 className="font-display font-bold text-2xl mt-1.5 tracking-tight">
                    {p.title}
                  </h3>
                  <div className="text-sm italic text-muted-foreground mt-1">
                    {p.subtitle}
                  </div>
                  <div className="mt-5 space-y-1.5">
                    {chapters.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/chapters/${c.slug}`}
                        className="flex items-center gap-3 group text-sm py-1"
                      >
                        <span className="font-mono text-xs text-muted-foreground w-6">
                          {String(c.num).padStart(2, "0")}
                        </span>
                        <span className="group-hover:underline underline-offset-4">{c.title}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FULL TOC */}
      <section id="toc" className="container py-16 scroll-mt-20">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Table of Contents
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight">
            Chapter by chapter.
          </h2>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-3">
          {CHAPTERS.map((c) => (
            <Link
              key={c.slug}
              href={`/chapters/${c.slug}`}
              className="group rounded-2xl border p-5 hover-lift bg-card"
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Part {c.partNum} · Ch. {String(c.num).padStart(2, "0")}
                </div>
                <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
              </div>
              <div className="font-display font-bold text-lg tracking-tight">{c.title}</div>
              <div className="text-sm text-muted-foreground mt-1.5">{c.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* DEDICATION */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Dedication
          </div>
          <p className="font-display italic text-xl md:text-2xl tracking-tight">
            To mumma and papa for being such amazing parents, love you both.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display font-black text-3xl md:text-4xl tracking-tight">{n}</div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="size-10 rounded-full bg-foreground text-background grid place-items-center">
          {icon}
        </div>
        <div className="mt-4 font-display font-bold text-lg tracking-tight">{title}</div>
        <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
      </CardContent>
    </Card>
  );
}
