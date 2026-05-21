"use client";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";

/**
 * Temperature / top-k / top-p sampling visualizer.
 * Hand-picked distribution over the next tokens after "The cat sat on the ___".
 */

const VOCAB = [
  "mat", "rug", "couch", "bed", "floor", "chair", "table",
  "lap", "windowsill", "stool", "carpet", "stairs",
];
const LOGITS = [4.2, 3.6, 3.1, 2.9, 2.5, 2.1, 1.8, 1.5, 1.2, 0.9, 0.6, 0.2];

function applyTemp(logits: number[], T: number) {
  const t = Math.max(T, 1e-3);
  const scaled = logits.map((l) => l / t);
  const m = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - m));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / s);
}

function applyTopK(probs: number[], k: number) {
  if (k >= probs.length) return probs.slice();
  const sorted = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
  const keep = new Set(sorted.slice(0, k).map((x) => x.i));
  const out = probs.map((p, i) => (keep.has(i) ? p : 0));
  const s = out.reduce((a, b) => a + b, 0) || 1;
  return out.map((p) => p / s);
}

function applyTopP(probs: number[], p: number) {
  const sorted = probs.map((pp, i) => ({ p: pp, i })).sort((a, b) => b.p - a.p);
  const keep = new Set<number>();
  let cum = 0;
  for (const { p: pp, i } of sorted) {
    keep.add(i);
    cum += pp;
    if (cum >= p) break;
  }
  const out = probs.map((pp, i) => (keep.has(i) ? pp : 0));
  const s = out.reduce((a, b) => a + b, 0) || 1;
  return out.map((pp) => pp / s);
}

export function SamplingExplorer() {
  const [temp, setTemp] = useState(1.0);
  const [k, setK] = useState(12);
  const [p, setP] = useState(1.0);

  const probs = useMemo(() => {
    let pr = applyTemp(LOGITS, temp);
    pr = applyTopK(pr, k);
    pr = applyTopP(pr, p);
    return pr;
  }, [temp, k, p]);

  const kept = probs.filter((x) => x > 1e-9).length;
  const top = probs.indexOf(Math.max(...probs));

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · &quot;the cat sat on the ___&quot; · sampling knobs
        </div>
        <div className="font-mono text-xs">
          kept <strong className="text-foreground">{kept}</strong> · most likely:{" "}
          <strong className="text-foreground">{VOCAB[top]}</strong>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <Knob label={`temperature = ${temp.toFixed(2)}`} value={temp} min={0.05} max={2.5} step={0.05} onChange={setTemp} />
        <Knob label={`top-k = ${k}`} value={k} min={1} max={VOCAB.length} step={1} onChange={setK} />
        <Knob label={`top-p = ${p.toFixed(2)}`} value={p} min={0.05} max={1.0} step={0.01} onChange={setP} />
      </div>
      <Highchart
        height={320}
        options={{
          chart: { type: "column" },
          title: { text: "" },
          xAxis: { categories: VOCAB, labels: { rotation: -25, style: { fontSize: "11px" } } },
          yAxis: { title: { text: "P(next token)" }, min: 0, max: 1 },
          plotOptions: { column: { borderRadius: 4, borderWidth: 0 } },
          legend: { enabled: false },
          series: [
            {
              type: "column",
              name: "P",
              data: probs.map((pr, i) => ({
                y: +pr.toFixed(4),
                color: pr < 1e-9 ? "#e4e4e7" : i === top ? palette.series[1] : palette.series[0],
              })),
            } as any,
          ],
        }}
      />
      <p className="text-xs text-muted-foreground italic mt-3">
        Drop <strong>temperature</strong> → distribution sharpens, model gets boring/repetitive.
        Push it up → it gets creative/unhinged. <strong>top-k</strong> chops the long tail to the k
        most-likely tokens. <strong>top-p</strong> (nucleus) keeps the smallest set whose
        probabilities sum to p — adaptive width. Real LLM serving stacks
        (vLLM, llama.cpp, OpenAI API) apply them in this order.
      </p>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-md bg-background border p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">{label}</div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
