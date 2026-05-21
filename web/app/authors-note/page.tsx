import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Author's Note · MLFS" };

export default function AuthorsNotePage() {
  return (
    <article className="container py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" /> back home
        </Link>
        <h1 className="mt-6 font-display font-black tracking-tight text-4xl md:text-6xl leading-[1.05]">
          Author's Note
        </h1>
        <div className="prose-book mt-10 max-w-none">
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
      </div>
    </article>
  );
}
