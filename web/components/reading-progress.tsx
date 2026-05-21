"use client";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setP(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-foreground transition-[width] duration-150"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
