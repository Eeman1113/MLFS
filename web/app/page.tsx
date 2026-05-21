import Link from "next/link";
import Image from "next/image";
import { DocsSidebar } from "@/components/docs-sidebar";
import { OnThisPage } from "@/components/on-this-page";
import { withBase } from "@/lib/utils";

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8">
        <article className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10">
          <Image
            src={withBase("/logo.png")}
            alt="MLFS"
            width={88}
            height={88}
            className="size-[88px] mb-8"
            priority
          />
          <p className="text-[14px] leading-5 text-muted-foreground mb-1.5">
            Machine Learning From Scratch
          </p>
          <h1
            className="font-display"
            style={{ fontSize: 30, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.75px" }}
          >
            Introduction
          </h1>
          <div className="prose-book max-w-none mt-10">
            <p>Dear Reader,</p>
            <p>So — this book is for people who haven't quite figured it out yet.</p>
            <p>Like, yeah, you love coding. You've made projects. You've got the GitHub commits.</p>
            <p>But... it still doesn't give you that umph, that passion. You feel like something's missing.</p>
            <p>This book isn't great at teaching you ML —</p>
            <p>It's here to make you interested in ML.</p>
            <p>To make you aroused about ML.</p>
            <p>To make you feel more sure about it.</p>
            <p>You know that topic you always wanted to learn for years?</p>
            <p>The one that lowkey scared you because it felt like such a big, brain-melting undertaking?</p>
            <p>Yeah. This is that book.</p>
            <p>And it's only 69 pages.</p>
            <p>It's here to make you curious.</p>
            <p>To push you.</p>
            <p>To say: "You got this, bro. ML isn't that deep. Yet."</p>
            <p>I hope you have fun reading through the book.</p>
            <p>And most of all — I hope you leave it wanting to explore even more.</p>
            <p>
              I hope this helps you break out of procrastination and gives you a much-needed push
              toward finally saying:
            </p>
            <p>"Screw it. Let's just do this."</p>
            <p>Thank you for being here.</p>
            <p>Now let's build some smart stuff together.</p>
            <p className="mt-10 font-display font-semibold">— Eeman Majumder</p>

            <p className="mt-10">
              <Link
                href="/chapters/01-flowcharts"
                className="underline underline-offset-4 hover:no-underline"
              >
                Start at chapter one →
              </Link>
            </p>

            <h2 id="dedication">Dedication</h2>
            <p className="italic">
              To mumma and papa for being such amazing parents, love you both.
            </p>
          </div>

          <footer className="mt-20 pt-6 border-t flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <a href="https://drive.google.com/file/d/1AKPArWSJqyYRjcUFYKzgzcgQ3A20FA4M/view" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
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
