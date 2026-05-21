import Link from "next/link";
import { CHAPTERS, PARTS } from "@/lib/chapters";
import { DocsSidebar } from "@/components/docs-sidebar";
import { OnThisPage } from "@/components/on-this-page";

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8">
        <article className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10">
          <p className="text-[14px] leading-5 text-muted-foreground mb-1.5">
            Machine Learning From Scratch
          </p>
          <h1
            className="font-display"
            style={{ fontSize: 30, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.75px" }}
          >
            Introduction
          </h1>
          <p className="text-muted-foreground mt-3" style={{ fontSize: 16, lineHeight: "24px" }}>
            A 69-page seduction into ML — now an interactive, runnable book.
            For those who have the urge to learn everything.
          </p>

          <div className="prose-book max-w-none mt-10">
            <p>
              Same words from the book, every chapter intact. Every algorithm
              is also a live cell on the page — real Python (numpy works!)
              executing in your browser, with charts that respond to your every
              keystroke.
            </p>
            <p>
              Read it in order, or jump anywhere from the index below.{" "}
              <Link
                href="/chapters/01-flowcharts"
                className="underline underline-offset-4 hover:no-underline"
              >
                Start at chapter one →
              </Link>
            </p>

            <h2 id="toc">Index</h2>
            {PARTS.map((p) => {
              const chapters = CHAPTERS.filter((c) => c.partNum === p.num);
              return (
                <div key={p.num} className="mt-8">
                  <h3>
                    Part {p.num} — {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground italic !mt-0">{p.subtitle}</p>
                  <ol className="!list-none !pl-0 flex flex-col gap-1.5 !mt-4">
                    {chapters.map((c) => (
                      <li key={c.slug} className="!my-0">
                        <Link
                          href={`/chapters/${c.slug}`}
                          className="group grid grid-cols-[2rem_1fr] gap-3 items-baseline py-1 hover:text-foreground"
                        >
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {String(c.num).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="group-hover:underline underline-offset-4">
                              {c.title}
                            </span>
                            <span className="block text-sm text-muted-foreground">{c.blurb}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}

            <h2 id="dedication">Dedication</h2>
            <p className="italic">
              To mumma and papa for being such amazing parents, love you both.
            </p>
          </div>

          <footer className="mt-20 pt-6 border-t flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <a href="./MLFS.pdf" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              PDF
            </a>
            <Link href="/authors-note" className="hover:text-foreground transition-colors">
              Author's Note
            </Link>
            <a href="./backup_index.html" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Flipbook
            </a>
            <a
              href="https://github.com/Eeman1113/MLFS"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="ml-auto">© {new Date().getFullYear()} Eeman Majumder · MIT</span>
          </footer>
        </article>
        <OnThisPage />
      </div>
    </div>
  );
}
