"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";

/** Tiny NN: 2 inputs → 4 hidden (ReLU) → 1 output (sigmoid), trained on XOR with manual backprop. */

const X = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];
const Y = [0, 1, 1, 0];

const HIDDEN = 4;

function relu(x: number) { return x > 0 ? x : 0; }
function reluD(x: number) { return x > 0 ? 1 : 0; }
function sig(x: number) { return 1 / (1 + Math.exp(-x)); }

function randMat(rows: number, cols: number, scale = 1) {
  const a: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) row.push((Math.random() - 0.5) * 2 * scale);
    a.push(row);
  }
  return a;
}

type Net = { W1: number[][]; b1: number[]; W2: number[][]; b2: number };
function initNet(): Net {
  return {
    W1: randMat(2, HIDDEN, 1.4),
    b1: new Array(HIDDEN).fill(0),
    W2: randMat(HIDDEN, 1, 1.4).map((r) => r),
    b2: 0,
  };
}

function forward(net: Net, x: number[]) {
  const z1 = new Array(HIDDEN).fill(0).map((_, j) => x[0] * net.W1[0][j] + x[1] * net.W1[1][j] + net.b1[j]);
  const a1 = z1.map(relu);
  const z2 = a1.reduce((s, v, j) => s + v * net.W2[j][0], 0) + net.b2;
  const a2 = sig(z2);
  return { z1, a1, z2, a2 };
}

function step(net: Net, lr: number) {
  const dW1 = randMat(2, HIDDEN, 0).map((r) => r.map(() => 0));
  const db1 = new Array(HIDDEN).fill(0);
  const dW2 = new Array(HIDDEN).fill(0).map(() => [0]);
  let db2 = 0;
  let lossSum = 0;
  for (let i = 0; i < X.length; i++) {
    const x = X[i];
    const y = Y[i];
    const { z1, a1, a2 } = forward(net, x);
    const eps = 1e-9;
    lossSum += -(y * Math.log(a2 + eps) + (1 - y) * Math.log(1 - a2 + eps));
    const dz2 = a2 - y;
    for (let j = 0; j < HIDDEN; j++) {
      dW2[j][0] += a1[j] * dz2;
    }
    db2 += dz2;
    const dz1 = new Array(HIDDEN).fill(0).map((_, j) => dz2 * net.W2[j][0] * reluD(z1[j]));
    for (let j = 0; j < HIDDEN; j++) {
      dW1[0][j] += x[0] * dz1[j];
      dW1[1][j] += x[1] * dz1[j];
      db1[j] += dz1[j];
    }
  }
  const n = X.length;
  for (let i = 0; i < 2; i++) for (let j = 0; j < HIDDEN; j++) net.W1[i][j] -= (lr * dW1[i][j]) / n;
  for (let j = 0; j < HIDDEN; j++) net.b1[j] -= (lr * db1[j]) / n;
  for (let j = 0; j < HIDDEN; j++) net.W2[j][0] -= (lr * dW2[j][0]) / n;
  net.b2 -= (lr * db2) / n;
  return lossSum / n;
}

export function XORTrainer() {
  const [net, setNet] = useState<Net>(() => initNet());
  const [lr, setLr] = useState(0.5);
  const [hist, setHist] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [ep, setEp] = useState(0);
  const raf = useRef<number | null>(null);

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setNet(initNet());
    setHist([]);
    setEp(0);
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      // batch a few steps per frame so training feels fast
      let l = 0;
      for (let i = 0; i < 8; i++) l = step(net, lr);
      setEp((e) => e + 8);
      setHist((h) => {
        const nx = [...h, +l.toFixed(4)];
        return nx.length > 800 ? nx.slice(-800) : nx;
      });
      setNet({ ...net });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line
  }, [running, lr]);

  // build a heatmap of decision surface
  const grid: any[] = [];
  const N = 26;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = (i / (N - 1));
      const y = (j / (N - 1));
      const { a2 } = forward(net, [x, y]);
      grid.push([x, y, a2]);
    }
  }

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · tiny neural net learning XOR · epoch {ep}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={running ? "outline" : "default"} onClick={() => setRunning((r) => !r)} className="gap-1.5">
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />} {running ? "pause" : "train"}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5">
            <RotateCcw className="size-3.5" /> reset
          </Button>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          <span>learning rate</span>
          <span className="font-mono">{lr.toFixed(2)}</span>
        </div>
        <Slider min={0.01} max={2} step={0.01} value={[lr]} onValueChange={([v]) => setLr(v)} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Highchart
          height={320}
          options={{
            chart: { type: "heatmap" },
            title: { text: "decision surface" },
            xAxis: { min: 0, max: 1, title: { text: "x₁" } },
            yAxis: { min: 0, max: 1, title: { text: "x₂" } },
            colorAxis: { min: 0, max: 1, stops: [[0, "#0ea5e9"], [0.5, "#fafafa"], [1, "#f97316"]] as any },
            legend: { enabled: false },
            series: [
              { type: "heatmap", name: "p(class 1)", data: grid, colsize: 1 / (N - 1), rowsize: 1 / (N - 1), borderWidth: 0 } as any,
              {
                type: "scatter",
                name: "data",
                data: X.map((p, i) => ({ x: p[0], y: p[1], marker: { fillColor: Y[i] === 1 ? "#0a0a0a" : "#fafafa", lineColor: "#0a0a0a", lineWidth: 2 } })),
                marker: { radius: 9, symbol: "circle" },
              } as any,
            ],
          }}
        />
        <Highchart
          height={320}
          options={{
            title: { text: "loss curve" },
            xAxis: { title: { text: "iter" } },
            yAxis: { title: { text: "BCE" }, min: 0 },
            series: [
              { type: "areaspline", name: "loss", color: palette.series[3], fillOpacity: 0.1, data: hist, marker: { enabled: false } },
            ],
            legend: { enabled: false },
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground italic mt-3">
        Watch a 2-4-1 ReLU+sigmoid net carve XOR out of nothing — the same XOR our linear model
        choked on in Ch. 5.
      </p>
    </div>
  );
}
