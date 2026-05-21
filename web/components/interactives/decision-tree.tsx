"use client";
import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";
import { useTheme } from "@/components/theme-provider";

/** Toy 1D split visualizer — show gini drop as user chooses a threshold. */
const RED: number[] = [1, 1.4, 1.7, 2.2, 2.5, 2.6];
const GREEN: number[] = [3, 3.5, 4, 4.4, 4.9, 5.2, 5.6, 6];

function gini(labels: number[]) {
  if (!labels.length) return 0;
  const c0 = labels.filter((x) => x === 0).length / labels.length;
  const c1 = 1 - c0;
  return 1 - c0 ** 2 - c1 ** 2;
}

export function GiniSplitExplorer() {
  const { theme } = useTheme();
  const ink = theme === "dark" ? "#fafafa" : "#27272a";
  const [t, setT] = useState(2.8);
  const pts = useMemo(
    () => [
      ...RED.map((x) => ({ x, l: 0 })),
      ...GREEN.map((x) => ({ x, l: 1 })),
    ],
    []
  );
  const left = pts.filter((p) => p.x <= t);
  const right = pts.filter((p) => p.x > t);
  const gL = gini(left.map((p) => p.l));
  const gR = gini(right.map((p) => p.l));
  const wL = left.length / pts.length;
  const wR = right.length / pts.length;
  const giniSplit = wL * gL + wR * gR;
  const giniBefore = gini(pts.map((p) => p.l));
  const gain = giniBefore - giniSplit;

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · move the threshold, watch impurity drop
        </div>
        <div className="font-mono text-xs">
          gini left {gL.toFixed(2)} · right {gR.toFixed(2)} · gain{" "}
          <strong className="text-foreground">{gain.toFixed(3)}</strong>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          <span>threshold</span>
          <span className="font-mono">{t.toFixed(2)}</span>
        </div>
        <Slider min={0} max={7} step={0.05} value={[t]} onValueChange={([v]) => setT(v)} />
      </div>
      <Highchart
        height={300}
        options={{
          chart: { type: "scatter" },
          title: { text: "" },
          xAxis: { title: { text: "petal length (toy)" }, min: 0, max: 7, plotLines: [{ value: t, color: ink, width: 2, dashStyle: "Dash" }] },
          yAxis: { min: -0.5, max: 1.5, tickPositions: [0, 1], categories: ["benign", "malignant"], title: { text: "class" } },
          series: [
            { type: "scatter", name: "benign (0)", data: RED.map((x) => [x, 0]), color: palette.series[0], marker: { radius: 7 } },
            { type: "scatter", name: "malignant (1)", data: GREEN.map((x) => [x, 1]), color: palette.series[1], marker: { radius: 7 } },
          ],
        }}
      />
    </div>
  );
}

/** A tiny pre-built decision tree, rendered with SVG. */
export function PrettyTree() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 560 360" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
          </marker>
        </defs>
        <TreeNode x={280} y={40} text="petal length ≤ 2.45?" />
        <TreeNode x={120} y={130} text="setosa" leaf />
        <TreeNode x={400} y={130} text="petal width ≤ 1.75?" />
        <TreeNode x={310} y={230} text="petal length ≤ 4.95?" />
        <TreeNode x={490} y={230} text="virginica" leaf />
        <TreeNode x={230} y={320} text="versicolor" leaf />
        <TreeNode x={400} y={320} text="virginica" leaf />
        <path d="M 252 56 L 145 110" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <path d="M 310 56 L 380 110" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <path d="M 380 152 L 320 210" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <path d="M 420 152 L 480 210" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <path d="M 290 252 L 250 300" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <path d="M 330 252 L 390 300" className="stroke-foreground" markerEnd="url(#arr)" fill="none" />
        <text x={195} y={92} fontSize="10" fontWeight="700" className="fill-foreground">yes</text>
        <text x={345} y={92} fontSize="10" fontWeight="700" className="fill-foreground">no</text>
        <text x={335} y={188} fontSize="10" fontWeight="700" className="fill-foreground">yes</text>
        <text x={465} y={188} fontSize="10" fontWeight="700" className="fill-foreground">no</text>
        <text x={250} y={282} fontSize="10" fontWeight="700" className="fill-foreground">yes</text>
        <text x={372} y={282} fontSize="10" fontWeight="700" className="fill-foreground">no</text>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        A simple decision tree for classifying Iris flowers.
      </figcaption>
    </figure>
  );
}

function TreeNode({ x, y, text, leaf }: { x: number; y: number; text: string; leaf?: boolean }) {
  const w = 140;
  const h = 38;
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={leaf ? 18 : 8}
        className={`${leaf ? "fill-foreground" : "fill-background"} stroke-foreground`}
        strokeWidth="1.4"
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11.5"
        fontWeight={leaf ? 700 : 500}
        className={leaf ? "fill-background" : "fill-foreground"}
      >
        {text}
      </text>
    </g>
  );
}
