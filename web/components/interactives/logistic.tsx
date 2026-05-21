"use client";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";
import { useTheme } from "@/components/theme-provider";

const Aclass: [number, number][] = [
  [1, 8], [2, 7], [1, 6], [3, 9], [2, 5], [2.5, 7.5], [1.5, 6.5],
];
const Bclass: [number, number][] = [
  [7, 6], [8, 5], [9, 4], [8, 7], [9, 2], [7.5, 5], [8.5, 6],
];

export function DecisionBoundaryExplorer() {
  const { theme } = useTheme();
  const ink = theme === "dark" ? "#fafafa" : "#27272a";
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0.5);
  const [bias, setBias] = useState(-7);

  const line = useMemo(() => {
    // w1*x + w2*y + b = 0  -> y = -(w1*x + b) / w2
    if (Math.abs(w2) < 1e-3) return [];
    return [
      [0, -(w1 * 0 + bias) / w2],
      [10, -(w1 * 10 + bias) / w2],
    ];
  }, [w1, w2, bias]);

  const correct = useMemo(() => {
    let ok = 0;
    [...Aclass, ...Bclass].forEach((p, i) => {
      const pred = w1 * p[0] + w2 * p[1] + bias > 0 ? 1 : 0;
      const truth = i < Aclass.length ? 0 : 1;
      if (pred === truth) ok++;
    });
    return ok;
  }, [w1, w2, bias]);

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · drag the decision boundary
        </div>
        <div className="font-mono text-xs">
          accuracy: {correct} / {Aclass.length + Bclass.length}
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <Knob label={`w₁ = ${w1.toFixed(2)}`} value={w1} min={-3} max={3} step={0.05} onChange={setW1} />
        <Knob label={`w₂ = ${w2.toFixed(2)}`} value={w2} min={-3} max={3} step={0.05} onChange={setW2} />
        <Knob label={`b = ${bias.toFixed(2)}`} value={bias} min={-15} max={15} step={0.1} onChange={setBias} />
      </div>
      <Highchart
        height={360}
        options={{
          chart: { type: "scatter" },
          title: { text: "logistic regression separates classes with a line" },
          xAxis: { title: { text: "feature 1" }, min: 0, max: 10 },
          yAxis: { title: { text: "feature 2" }, min: 0, max: 10 },
          series: [
            { type: "scatter", name: "class O", data: Aclass, color: palette.series[0], marker: { symbol: "circle", radius: 7 } },
            { type: "scatter", name: "class X", data: Bclass, color: palette.series[1], marker: { symbol: "diamond", radius: 7 } },
            { type: "line", name: "boundary", data: line, color: ink, lineWidth: 2, dashStyle: "Dash", marker: { enabled: false }, enableMouseTracking: false },
          ],
        }}
      />
    </div>
  );
}

function Knob({
  label, value, min, max, step, onChange,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-md bg-background border p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">{label}</div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
