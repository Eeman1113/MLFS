"use client";
import { useEffect, useState } from "react";

type Section = { id: string; top: number };

/** A right-margin section indicator: one tick per h2 in the article.
 *  Active tick (the one closest to the viewport top) is highlighted.
 */
export function RightRail() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headings = Array.from(article.querySelectorAll("h2"));
    headings.forEach((h, i) => {
      if (!h.id) h.id = `s-${i}`;
    });

    const compute = () => {
      const list = headings.map((h) => ({
        id: h.id,
        top: h.getBoundingClientRect().top + window.scrollY,
      }));
      setSections(list);
    };
    compute();
    window.addEventListener("resize", compute);

    const onScroll = () => {
      const y = window.scrollY + 120;
      let idx = 0;
      for (let i = 0; i < headings.length; i++) {
        const top = headings[i].getBoundingClientRect().top + window.scrollY;
        if (top <= y) idx = i;
      }
      setActiveIdx(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, []);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="sections"
      className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2"
    >
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={`Section ${i + 1}`}
          className={`block h-px transition-all duration-300 ${
            i === activeIdx
              ? "w-6 bg-foreground"
              : "w-3 bg-muted-foreground/40 hover:bg-foreground/80 hover:w-5"
          }`}
        />
      ))}
    </nav>
  );
}
