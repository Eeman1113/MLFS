"use client";
import { useMemo, useState } from "react";
import { Highchart, palette } from "@/components/highchart";
import { Slider } from "@/components/ui/slider";

export function SigmoidExplorer() {
  const [z, setZ] = useState(0);
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  const data = useMemo(() => {
    const arr: [number, number][] = [];
    for (let x = -10; x <= 10; x += 0.05) arr.push([+x.toFixed(2), +sigmoid(x).toFixed(5)]);
    return arr;
  }, []);
  return (
    <div className="not-prose my-8 rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          live · drag z
        </div>
        <div className="font-mono text-xs">
          z = {z.toFixed(2)} → σ(z) = {sigmoid(z).toFixed(4)}
        </div>
      </div>
      <Slider min={-10} max={10} step={0.05} value={[z]} onValueChange={([v]) => setZ(v)} />
      <Highchart
        height={340}
        options={{
          title: { text: "" },
          xAxis: { title: { text: "z (raw model output)" }, min: -10, max: 10, plotLines: [{ value: z, color: "#a1a1aa", width: 1, dashStyle: "Dash" }] },
          yAxis: { title: { text: "σ(z)" }, min: -0.05, max: 1.05, plotLines: [{ value: 0.5, color: "#a1a1aa", width: 1, dashStyle: "Dash" }] },
          series: [
            { type: "areaspline", name: "sigmoid", color: palette.series[0], fillOpacity: 0.08, data, marker: { enabled: false }, lineWidth: 3 },
            { type: "scatter", name: "z", data: [[z, sigmoid(z)]], color: palette.series[3], marker: { radius: 7, symbol: "circle" } },
          ],
          legend: { enabled: true },
        }}
      />
    </div>
  );
}
