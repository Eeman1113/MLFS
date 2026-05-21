"use client";
import { useEffect, useState } from "react";

type H = { id: string; text: string };

export function OnThisPage() {
  const [items, setItems] = useState<H[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const hs = Array.from(article.querySelectorAll("h2"));
    hs.forEach((h, i) => {
      if (!h.id) h.id = `s-${i}`;
    });
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent || "" })));

    const onScroll = () => {
      const y = window.scrollY + 120;
      let cur = hs[0]?.id || "";
      for (const h of hs) {
        const top = h.getBoundingClientRect().top + window.scrollY;
        if (top <= y) cur = h.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!items.length) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-6 pr-6">
        <div className="text-sm font-semibold mb-3">On This Page</div>
        <ul className="flex flex-col gap-1.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`block text-sm transition-colors ${
                  active === it.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
