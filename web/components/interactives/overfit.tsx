"use client";
import { useMemo, useState } from "react";
import { Highchart, palette } from "@/components/highchart";
import { Slider } from "@/components/ui/slider";

const DATA: [number, number][] = [
  [1, 2.2],
  [2, 3.4],
  [3, 4.1],
  [5, 5.0],
  [6, 4.6],
  [7, 4.8],
  [8, 3.1],
  [9, 1.6],
];

function polyFit(x: number[], y: number[], deg: number) {
  // build Vandermonde
  const n = x.length;
  const m = deg + 1;
  const X: number[][] = x.map((xi) => Array.from({ length: m }, (_, j) => Math.pow(xi, j)));
  // normal equations: (X^T X) w = X^T y
  const XtX: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
  const Xty: number[] = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let r = 0; r < m; r++) {
      Xty[r] += X[i][r] * y[i];
      for (let c = 0; c < m; c++) XtX[r][c] += X[i][r] * X[i][c];
    }
  }
  // solve by Gaussian elimination
  const A = XtX.map((row, i) => [...row, Xty[i]]);
  for (let i = 0; i < m; i++) {
    let pivot = i;
    for (let k = i + 1; k < m; k++) if (Math.abs(A[k][i]) > Math.abs(A[pivot][i])) pivot = k;
    [A[i], A[pivot]] = [A[pivot], A[i]];
    const div = A[i][i] || 1e-9;
    for (let j = i; j <= m; j++) A[i][j] /= div;
    for (let k = 0; k < m; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = i; j <= m; j++) A[k][j] -= factor * A[i][j];
    }
  }
  return A.map((row) => row[m]); // weights
}

function evalPoly(w: number[], x: number) {
  let s = 0;
  for (let i = 0; i < w.length; i++) s += w[i] * Math.pow(x, i);
  return s;
}

export function OverfitExplorer() {
  const [deg, setDeg] = useState(2);
  const xs = DATA.map((p) => p[0]);
  const ys = DATA.map((p) => p[1]);
  const weights = useMemo(() => polyFit(xs, ys, deg), [deg]);
  const curve = useMemo(() => {
    const arr: [number, number][] = [];
    for (let x = 0.2; x <= 9.8; x += 0.05) arr.push([+x.toFixed(2), evalPoly(weights, x)]);
    return arr;
  }, [weights]);
  const mse = ys.reduce((s, v, i) => s + (v - evalPoly(weights, xs[i])) ** 2, 0) / ys.length;
  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          live · increase the degree to see overfitting take over
        </div>
        <div className="font-mono text-xs">
          degree {deg} · train MSE {mse.toFixed(3)}
        </div>
      </div>
      <Slider min={1} max={9} step={1} value={[deg]} onValueChange={([v]) => setDeg(v)} />
      <Highchart
        height={340}
        options={{
          title: { text: "the data vs the model" },
          xAxis: { title: { text: "feature" }, min: 0, max: 10 },
          yAxis: { title: { text: "target" }, min: 0, max: 7 },
          series: [
            { type: "scatter", name: "data", data: DATA, color: palette.series[0], marker: { radius: 7 } },
            { type: "line", name: `degree-${deg}`, data: curve, color: palette.series[1], lineWidth: 2.5, marker: { enabled: false } },
          ],
        }}
      />
      <p className="text-xs text-muted-foreground italic mt-2">
        At <strong>degree 1</strong> you underfit. At <strong>degree 9</strong> the curve thrashes
        through every point — train loss is tiny, but it will fail on anything new.
      </p>
    </div>
  );
}
