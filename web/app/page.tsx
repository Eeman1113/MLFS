import Link from "next/link";
import { CHAPTERS, PARTS } from "@/lib/chapters";

export default function Home() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-6 md:px-10 pt-24 md:pt-32 pb-32">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Machine Learning From Scratch
      </p>
      <h1 className="mt-4 font-display font-bold tracking-tight text-4xl md:text-5xl leading-[1.1]">
        A 69-page seduction into ML — now an interactive, runnable book.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed italic">
        For those who have the urge to learn everything.
      </p>

      <div className="mt-10 prose-book max-w-none">
        <p>
          Same words from the book, every chapter intact. Every algorithm is
          also a live cell on the page — real Python (numpy works!) executing
          in your browser, with charts that respond to your every keystroke.
        </p>
        <p>
          Read it in order, or jump anywhere from the index below.
        </p>
        <p>
          <Link
            href="/chapters/01-flowcharts"
            className="underline underline-offset-4 hover:no-underline"
          >
            Start at chapter one →
          </Link>
        </p>
      </div>

      <section id="toc" className="mt-20 scroll-mt-20">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Index
        </p>
        <div className="mt-8 flex flex-col gap-10">
          {PARTS.map((p) => {
            const chapters = CHAPTERS.filter((c) => c.partNum === p.num);
            return (
              <div key={p.num}>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-1">
                  Part {p.num}
                </div>
                <h2 className="font-display font-semibold text-xl tracking-tight">
                  {p.title}
                </h2>
                <p className="text-sm text-muted-foreground italic mb-4">
                  {p.subtitle}
                </p>
                <ol className="flex flex-col gap-2">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/chapters/${c.slug}`}
                        className="group grid grid-cols-[2.5rem_1fr] gap-3 items-baseline py-1.5 hover:text-foreground"
                      >
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {String(c.num).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="group-hover:underline underline-offset-4">
                            {c.title}
                          </span>
                          <span className="block text-sm text-muted-foreground mt-0.5">
                            {c.blurb}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-24">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-4">
          Dedication
        </p>
        <p className="font-display italic text-lg leading-relaxed">
          To mumma and papa for being such amazing parents, love you both.
        </p>
      </section>

      <footer className="mt-24 pt-6 border-t flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <a href="./MLFS.pdf" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">PDF</a>
        <Link href="/authors-note" className="hover:text-foreground transition-colors">Author's Note</Link>
        <a href="./backup_index.html" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Original flipbook</a>
        <a href="https://github.com/Eeman1113/MLFS" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        <span className="ml-auto">© {new Date().getFullYear()} Eeman Majumder · MIT</span>
      </footer>
    </article>
  );
}
