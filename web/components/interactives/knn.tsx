"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";
import { useTheme } from "@/components/theme-provider";

const SEED_A: [number, number][] = [[2, 7], [3, 8], [2, 5], [4, 6], [2.5, 7.5], [3.5, 7]];
const SEED_B: [number, number][] = [[7, 8], [8, 7], [9, 4], [7, 4], [8, 5], [9, 7]];

function dist(a: number[], b: number[]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function KNNExplorer() {
  const { theme } = useTheme();
  const ink = theme === "dark" ? "#fafafa" : "#27272a";
  const [k, setK] = useState(3);
  const [probe, setProbe] = useState<[number, number]>([5, 6]);

  const labels: ("A" | "B")[] = useMemo(
    () => [...SEED_A.map(() => "A" as const), ...SEED_B.map(() => "B" as const)],
    []
  );
  const pts: [number, number][] = useMemo(() => [...SEED_A, ...SEED_B], []);

  const sorted = useMemo(() => {
    return pts
      .map((p, i) => ({ p, i, d: dist(p, probe), l: labels[i] }))
      .sort((a, b) => a.d - b.d);
  }, [probe, pts, labels]);

  const topK = sorted.slice(0, k);
  const voteA = topK.filter((x) => x.l === "A").length;
  const voteB = topK.length - voteA;
  const prediction = voteA >= voteB ? "A" : "B";

  const neighborLines = topK.map((n) => ({
    type: "line" as const,
    data: [probe, n.p] as [number, number][],
    color: "#a1a1aa",
    dashStyle: "Dash" as const,
    enableMouseTracking: false,
    showInLegend: false,
    marker: { enabled: false },
  }));

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · click the plot to move the probe
        </div>
        <div className="font-mono text-xs">
          k = {k} · votes: A {voteA} · B {voteB} → prediction:{" "}
          <strong className="text-foreground">{prediction}</strong>
        </div>
      </div>
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">k</div>
        <Slider min={1} max={11} step={2} value={[k]} onValueChange={([v]) => setK(v)} />
      </div>
      <Highchart
        height={360}
        options={{
          chart: {
            type: "scatter",
            events: {
              click: function (this: any, e: any) {
                if (e?.xAxis?.[0] && e?.yAxis?.[0]) {
                  setProbe([+e.xAxis[0].value.toFixed(2), +e.yAxis[0].value.toFixed(2)]);
                }
              },
            },
          },
          title: { text: "" },
          xAxis: { title: { text: "feature 1" }, min: 0, max: 10, gridLineWidth: 1 },
          yAxis: { title: { text: "feature 2" }, min: 0, max: 10, gridLineWidth: 1 },
          series: [
            { type: "scatter", name: "class A", data: SEED_A, color: palette.series[0], marker: { symbol: "circle", radius: 7 } },
            { type: "scatter", name: "class B", data: SEED_B, color: palette.series[1], marker: { symbol: "diamond", radius: 7 } },
            ...neighborLines,
            { type: "scatter", name: "probe", data: [probe], color: prediction === "A" ? palette.series[0] : palette.series[1], marker: { symbol: "circle", radius: 11, lineColor: ink, lineWidth: 2 } },
          ],
        }}
      />
      <p className="text-xs text-muted-foreground italic mt-2">
        The gray dashed lines are the {k} nearest neighbors. Their majority class is your answer.
      </p>
    </div>
  );
}
