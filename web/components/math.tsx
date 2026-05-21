"use client";
import { useEffect, useRef } from "react";
import katex from "katex";

export function M({ children, display = false }: { children: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(children, ref.current, { displayMode: display, throwOnError: false, output: "html" });
      } catch (e) {
        ref.current.textContent = children;
      }
    }
  }, [children, display]);
  return <span ref={ref} className={display ? "block my-4 text-center" : "inline-block"} />;
}

export function Math({ children }: { children: string }) {
  return <M display>{children}</M>;
}
