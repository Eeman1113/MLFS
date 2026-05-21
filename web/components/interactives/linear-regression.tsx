"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";

const X = [2, 3, 5, 6, 8];
const Y = [65, 70, 75, 85, 90];

function predict(x: number[], m: number, b: number) {
  return x.map((v) => m * v + b);
}
function mse(yp: number[], yt: number[]) {
  return yp.reduce((s, v, i) => s + (yt[i] - v) ** 2, 0) / yt.length;
}
function step(yp: number[], yt: number[], x: number[], m: number, b: number, lr: number) {
  const n = yt.length;
  let dm = 0,
    db = 0;
  for (let i = 0; i < n; i++) {
    dm += x[i] * (yt[i] - yp[i]);
    db += yt[i] - yp[i];
  }
  dm *= -2 / n;
  db *= -2 / n;
  return [m - lr * dm, b - lr * db];
}

export function LinearRegressionTrainer() {
  const [m, setM] = useState(0);
  const [b, setB] = useState(0);
  const [lr, setLr] = useState(0.02);
  const [epoch, setEpoch] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const raf = useRef<number | null>(null);

  const reset = () => {
    cancelAnimationFrame(raf.current!);
    setM(0);
    setB(0);
    setEpoch(0);
    setHistory([]);
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setEpoch((e) => e + 1);
      setM((curM) => {
        let cur = [curM, b];
        for (let k = 0; k < 1; k++) {
          const yp = predict(X, cur[0], cur[1]);
          const [nm, nb] = step(yp, Y, X, cur[0], cur[1], lr);
          cur = [nm, nb];
        }
        setB(cur[1]);
        const yp = predict(X, cur[0], cur[1]);
        setHistory((h) => {
          const next = [...h, +mse(yp, Y).toFixed(3)];
          return next.length > 1000 ? next.slice(-1000) : next;
        });
        if (history.length > 1500) setRunning(false);
        return cur[0];
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lr]);

  const yp = predict(X, m, b);
  const line = [
    [1, m * 1 + b],
    [9, m * 9 + b],
  ] as [number, number][];

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · gradient descent on hours studied → exam score
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={running ? "outline" : "default"}
            onClick={() => setRunning((r) => !r)}
            className="gap-1.5"
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? "pause" : "train"}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5">
            <RotateCcw className="size-3.5" /> reset
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <Stat label="m (weight)" v={m.toFixed(3)} />
        <Stat label="b (bias)" v={b.toFixed(3)} />
        <Stat label="loss (MSE)" v={mse(yp, Y).toFixed(3)} />
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          <span>learning rate</span>
          <span className="font-mono">{lr.toFixed(4)}</span>
        </div>
        <Slider min={0.0001} max={0.1} step={0.0001} value={[lr]} onValueChange={([v]) => setLr(v)} />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Highchart
          height={300}
          options={{
            title: { text: "fit" },
            xAxis: { title: { text: "hours studied" }, min: 0, max: 10 },
            yAxis: { title: { text: "exam score" }, min: 50, max: 100 },
            series: [
              {
                type: "scatter",
                name: "data",
                color: palette.series[0],
                data: X.map((x, i) => [x, Y[i]]),
                marker: { radius: 6, symbol: "circle" },
              },
              {
                type: "line",
                name: "model",
                color: palette.series[1],
                data: line,
                marker: { enabled: false },
                lineWidth: 3,
              },
            ],
          }}
        />
        <Highchart
          height={300}
          options={{
            title: { text: `loss curve (epoch ${epoch})` },
            xAxis: { title: { text: "epoch" }, min: 0 },
            yAxis: { title: { text: "MSE" }, min: 0 },
            series: [
              {
                type: "areaspline",
                name: "loss",
                color: palette.series[3],
                fillOpacity: 0.1,
                data: history,
                marker: { enabled: false },
                lineWidth: 2,
              },
            ],
            legend: { enabled: false },
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground italic mt-3">
        Try a tiny learning rate (0.0005) — it crawls. Bump it to 0.05 — it converges fast. Push it
        to 0.1 — it diverges. Same algorithm, different vibes.
      </p>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-md bg-background border p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-lg font-bold">{v}</div>
    </div>
  );
}
