"use client";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Highchart } from "@/components/highchart";

/**
 * Toy self-attention visualizer.
 * - Pick a sentence (or paste your own short one).
 * - Hand-rolled "embeddings" derived from a tiny semantic table so the heatmap
 *   actually looks plausible (subject ↔ verb ↔ object).
 * - Slider toggles temperature on the softmax — at 0 it's nearly one-hot,
 *   at ∞ it's uniform. Makes the "softmax over Q·Kᵀ" intuition visceral.
 */

const PRESETS = [
  "the cat sat on the mat",
  "she gave him a book",
  "transformers run on attention",
];

// hand-tuned 4-d "embeddings" so the demo isn't pure noise
const SEM: Record<string, number[]> = {
  the: [0.1, 0.0, 0.0, 0.1],
  a: [0.1, 0.0, 0.0, 0.1],
  on: [0.0, 0.4, 0.2, 0.0],
  in: [0.0, 0.4, 0.2, 0.0],
  to: [0.0, 0.4, 0.2, 0.0],
  cat: [0.9, 0.1, 0.0, 0.2],
  she: [0.85, 0.1, 0.0, 0.3],
  he: [0.85, 0.1, 0.0, 0.3],
  him: [0.7, 0.1, 0.0, 0.4],
  her: [0.7, 0.1, 0.0, 0.4],
  transformers: [0.6, 0.1, 0.7, 0.5],
  sat: [0.2, 0.8, 0.1, 0.0],
  run: [0.2, 0.8, 0.4, 0.0],
  gave: [0.3, 0.8, 0.0, 0.2],
  mat: [0.7, 0.0, 0.0, 0.7],
  book: [0.6, 0.0, 0.2, 0.7],
  attention: [0.3, 0.2, 0.9, 0.3],
};

function embed(word: string): number[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (SEM[w]) return SEM[w];
  // deterministic fallback so unknown words still get a stable vibe
  let h = 0;
  for (let i = 0; i < w.length; i++) h = (h * 31 + w.charCodeAt(i)) >>> 0;
  return [(h & 0xff) / 255, ((h >> 8) & 0xff) / 255, ((h >> 16) & 0xff) / 255, ((h >> 24) & 0xff) / 255];
}

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function softmax(xs: number[], temp: number) {
  const t = Math.max(temp, 1e-3);
  const m = Math.max(...xs);
  const exps = xs.map((x) => Math.exp((x - m) / t));
  const sum = exps.reduce((s, v) => s + v, 0);
  return exps.map((e) => e / sum);
}

export function AttentionDemo() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [text, setText] = useState(PRESETS[0]);
  const [temp, setTemp] = useState(0.4);

  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const n = tokens.length;

  const grid = useMemo(() => {
    const embs = tokens.map(embed);
    const dk = embs[0]?.length || 4;
    const cells: any[] = [];
    for (let i = 0; i < n; i++) {
      const raw = embs.map((kj) => dot(embs[i], kj) / Math.sqrt(dk));
      // causal: zero out attention to future tokens (decoder-style)
      const masked = raw.map((v, j) => (j > i ? -Infinity : v));
      const probs = softmax(masked, temp);
      for (let j = 0; j < n; j++) {
        cells.push([j, n - 1 - i, +probs[j].toFixed(3)]);
      }
    }
    return cells;
  }, [text, temp, n, tokens]);

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · self-attention heatmap (decoder-style, causal mask)
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {PRESETS.map((p, i) => (
            <button
              key={p}
              onClick={() => {
                setPresetIdx(i);
                setText(p);
              }}
              className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                presetIdx === i
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.split(" ").slice(0, 3).join(" ")}…
            </button>
          ))}
        </div>
      </div>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPresetIdx(-1);
        }}
        className="w-full rounded-md border bg-background p-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-3"
      />
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          <span>softmax temperature</span>
          <span className="font-mono">{temp.toFixed(2)}</span>
        </div>
        <Slider min={0.05} max={3} step={0.05} value={[temp]} onValueChange={([v]) => setTemp(v)} />
      </div>
      <Highchart
        height={Math.max(260, n * 38 + 80)}
        options={{
          chart: { type: "heatmap" },
          title: { text: "" },
          xAxis: {
            categories: tokens,
            title: { text: "key (what each row looks at)" },
            opposite: true,
          },
          yAxis: {
            categories: [...tokens].reverse(),
            title: { text: "query (each row is one token asking)" },
            reversed: false,
          },
          colorAxis: {
            min: 0,
            max: 1,
            stops: [
              [0, "#0a0a0a00"],
              [0.5, "#f97316aa"],
              [1, "#f97316"],
            ] as any,
          },
          legend: { enabled: false },
          series: [
            {
              type: "heatmap",
              name: "attention",
              data: grid,
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.05)",
              dataLabels: {
                enabled: n <= 8,
                style: { textOutline: "none", fontWeight: "400", fontSize: "10px" },
                format: "{point.value:.2f}",
              },
            } as any,
          ],
        }}
      />
      <p className="text-xs text-muted-foreground italic mt-3">
        Each row is one token asking, &quot;who should I listen to?&quot; The orange cells are where
        attention flows. The upper-right triangle is dark because we mask future tokens — decoders
        can&apos;t peek ahead. Crank temperature ↑ and the model gets &quot;confused&quot; (uniform);
        push it ↓ and it locks onto a single neighbour.
      </p>
    </div>
  );
}
