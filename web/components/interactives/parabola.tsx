"use client";
import { useMemo, useState } from "react";
import { Highchart, palette } from "@/components/highchart";
import { Slider } from "@/components/ui/slider";

/** Loss curve with a moving "current parameter" point — visualizes the derivative-as-slope intuition. */
export function LossCurveExplorer() {
  const [w, setW] = useState(1.2);
  const f = (x: number) => 0.2 * (x - 5) ** 2 + 1;
  const slope = 0.4 * (w - 5);
  const data = useMemo(() => {
    const arr: [number, number][] = [];
    for (let x = 0; x <= 10; x += 0.1) arr.push([+x.toFixed(2), +f(x).toFixed(3)]);
    return arr;
  }, []);
  const tangent = useMemo(() => {
    const y0 = f(w);
    const m = slope;
    return [
      [w - 2, y0 - 2 * m],
      [w + 2, y0 + 2 * m],
    ] as [number, number][];
  }, [w, slope]);

  return (
    <div className="not-prose my-8 rounded-2xl border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          slide the parameter — feel the slope
        </div>
        <div className="font-mono text-xs">
          w = {w.toFixed(2)} · slope = {slope.toFixed(2)}
        </div>
      </div>
      <Slider min={0} max={10} step={0.05} value={[w]} onValueChange={([v]) => setW(v)} />
      <Highchart
        height={340}
        options={{
          title: { text: "" },
          xAxis: { title: { text: "model parameter (w)" }, min: 0, max: 10 },
          yAxis: { title: { text: "loss" }, min: 0, max: 7 },
          series: [
            { type: "line", name: "loss curve", color: palette.series[0], data, marker: { enabled: false }, lineWidth: 3 },
            { type: "line", name: "tangent (gradient)", color: palette.series[1], data: tangent, marker: { enabled: false }, dashStyle: "Dash", lineWidth: 2 },
            { type: "scatter", name: "current point", data: [[w, f(w)]], color: palette.series[3], marker: { radius: 7, symbol: "circle" } },
          ],
          legend: { enabled: true },
        }}
      />
      <p className="text-xs text-muted-foreground italic mt-2">
        At <code>w = 5</code> the slope is zero — you've found the bottom of the valley.
      </p>
    </div>
  );
}
