"use client";
import { useEffect, useState } from "react";

/** Reads the current <article>'s text content and shows the word count
 *  in the bottom-right corner.
 */
export function WordCount() {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    // exclude code editors and chart containers (their text is noise)
    const clone = article.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".cm-editor, .highcharts-container, pre").forEach((el) => el.remove());
    const text = clone.textContent || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setN(words);
  }, []);

  if (n === null) return null;
  return (
    <div className="fixed bottom-4 right-4 md:right-6 z-40 text-xs text-muted-foreground tabular-nums select-none">
      {n.toLocaleString()} words
    </div>
  );
}
