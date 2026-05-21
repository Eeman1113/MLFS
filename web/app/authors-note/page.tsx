import Link from "next/link";
import { DocsSidebar } from "@/components/docs-sidebar";

export const metadata = { title: "Author's Note · MLFS" };

export default function AuthorsNotePage() {
  return (
    <div className="mx-auto max-w-screen-2xl flex">
      <DocsSidebar />
      <article className="flex-1 min-w-0 px-6 md:px-10 lg:px-14 py-10 max-w-[760px] mx-auto xl:mx-0">
        <p className="text-sm text-muted-foreground mb-1">Front matter</p>
        <h1 className="font-display font-bold tracking-tight text-3xl md:text-[2rem] leading-[1.18]">
          Author's Note
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
          <p className="mt-12 font-display font-semibold">— Eeman Majumder</p>
        </div>

        <nav className="mt-20 pt-6 border-t flex items-center justify-between text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Home
          </Link>
          <Link
            href="/chapters/01-flowcharts"
            className="text-foreground hover:opacity-70 transition-opacity"
          >
            Chapter 1 →
          </Link>
        </nav>
      </article>
    </div>
  );
}
