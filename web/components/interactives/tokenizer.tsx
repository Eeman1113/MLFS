"use client";
import { useMemo, useState } from "react";
import { palette } from "@/lib/palette";

/**
 * Toy BPE-ish tokenizer. Not a real tokenizer — it splits on whitespace,
 * then peels off frequent suffixes/prefixes so you see why "tokenization"
 * becomes ["token", "ization"] rather than one big chunk.
 */

const SUFFIXES = ["ization", "ation", "tion", "ness", "ment", "able", "ible", "ing", "ed", "es", "s", "ly", "ity", "er", "or"];
const PREFIXES = ["un", "re", "pre", "non", "de", "in", "im", "anti", "sub", "super"];
const PUNCT = /([.,!?;:()"'`\-—])/g;

function tokenize(text: string): { tok: string; kind: "word" | "punct" | "space" | "sub" }[] {
  const out: { tok: string; kind: "word" | "punct" | "space" | "sub" }[] = [];
  // split words and punctuation
  const pieces = text.split(/(\s+)/);
  for (const piece of pieces) {
    if (!piece) continue;
    if (/^\s+$/.test(piece)) {
      out.push({ tok: piece.replace(/ /g, "·"), kind: "space" });
      continue;
    }
    const chunks = piece.split(PUNCT).filter(Boolean);
    for (const ch of chunks) {
      if (PUNCT.test(ch)) {
        out.push({ tok: ch, kind: "punct" });
        continue;
      }
      // try peel prefix + suffix
      let core = ch;
      let prefix: string | null = null;
      let suffix: string | null = null;
      const low = ch.toLowerCase();
      for (const p of PREFIXES) {
        if (low.startsWith(p) && low.length > p.length + 2) {
          prefix = ch.slice(0, p.length);
          core = ch.slice(p.length);
          break;
        }
      }
      for (const s of SUFFIXES) {
        if (core.toLowerCase().endsWith(s) && core.length > s.length + 2) {
          suffix = core.slice(core.length - s.length);
          core = core.slice(0, core.length - s.length);
          break;
        }
      }
      if (prefix) out.push({ tok: prefix, kind: "sub" });
      out.push({ tok: core, kind: prefix || suffix ? "sub" : "word" });
      if (suffix) out.push({ tok: suffix, kind: "sub" });
    }
  }
  return out;
}

function hashColor(s: string, kind: string) {
  if (kind === "space") return "transparent";
  if (kind === "punct") return "#a1a1aa";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return palette.series[h % palette.series.length];
}

const DEFAULT_TEXT =
  "Transformers tokenize unbelievable preprocessing-heavy sentences into subwords.";

export function TokenizerDemo() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const tokens = useMemo(() => tokenize(text), [text]);
  const charCount = text.length;
  const tokenCount = tokens.filter((t) => t.kind !== "space").length;
  const ratio = tokenCount ? (charCount / tokenCount).toFixed(2) : "0";

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Live · type text, watch it shatter into tokens
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-md border bg-background p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[80px]"
      />
      <div className="mt-4 rounded-md border bg-background p-3 sm:p-4 min-h-[80px]">
        <div className="flex flex-wrap gap-1 items-center">
          {tokens.map((t, i) => {
            if (t.kind === "space") {
              return (
                <span
                  key={i}
                  className="font-mono text-xs text-muted-foreground/50 px-0.5"
                  title="space"
                >
                  {t.tok}
                </span>
              );
            }
            const bg = hashColor(t.tok, t.kind);
            return (
              <span
                key={i}
                className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[12.5px] text-[#0a0a0a]"
                style={{
                  background: bg,
                  outline: t.kind === "sub" ? "1px dashed rgba(0,0,0,0.35)" : "none",
                  outlineOffset: -1,
                }}
                title={t.kind === "sub" ? "subword piece" : t.kind}
              >
                {t.tok}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <Stat label="chars" v={String(charCount)} />
        <Stat label="tokens" v={String(tokenCount)} />
        <Stat label="chars / token" v={ratio} />
      </div>
      <p className="text-xs text-muted-foreground italic mt-3">
        Real BPE tokenizers (GPT, Llama, Mistral) learn their splits from huge corpora — this toy
        peels common prefixes/suffixes so you can <em>see</em> the idea: chop big words into
        reusable pieces, drop them into a fixed vocab, never see an OOV again.
      </p>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-sm font-bold tabular-nums">{v}</div>
    </div>
  );
}
