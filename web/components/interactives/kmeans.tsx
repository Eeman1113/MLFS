"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, ShuffleIcon } from "lucide-react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Highchart, palette } from "@/components/highchart";

type Pt = [number, number];

function genClusters(n = 90, k = 3, seed = 1): Pt[] {
  // simple deterministic-ish RNG
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const centers: Pt[] = Array.from({ length: k }, () => [2 + rand() * 6, 2 + rand() * 6]);
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const c = centers[i % k];
    pts.push([c[0] + (rand() - 0.5) * 2.5, c[1] + (rand() - 0.5) * 2.5]);
  }
  return pts;
}

function dist(a: Pt, b: Pt) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function KMeansExplorer() {
  const [k, setK] = useState(3);
  const [seed, setSeed] = useState(1);
  const [points] = useState<Pt[]>(() => genClusters(120, 3, 1));
  const [centroids, setCentroids] = useState<Pt[]>([]);
  const [assign, setAssign] = useState<number[]>([]);
  const [iter, setIter] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);

  const init = (kk: number) => {
    let s = seed * 31 + 17;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const idxs = new Set<number>();
    while (idxs.size < kk) idxs.add(Math.floor(rand() * points.length));
    const cs = Array.from(idxs).map((i) => [...points[i]] as Pt);
    setCentroids(cs);
    setAssign(new Array(points.length).fill(0));
    setIter(0);
  };

  useEffect(() => init(k), [k, seed]);

  const step = () => {
    if (!centroids.length) return;
    // assign
    const newA = points.map((p) => {
      let bi = 0, bd = Infinity;
      for (let i = 0; i < centroids.length; i++) {
        const d = dist(p, centroids[i]);
        if (d < bd) { bd = d; bi = i; }
      }
      return bi;
    });
    // update
    const newC: Pt[] = centroids.map((_, ci) => {
      const cluster = points.filter((_, i) => newA[i] === ci);
      if (!cluster.length) return centroids[ci];
      const x = cluster.reduce((s, p) => s + p[0], 0) / cluster.length;
      const y = cluster.reduce((s, p) => s + p[1], 0) / cluster.length;
      return [x, y];
    });
    setAssign(newA);
    setCentroids(newC);
    setIter((i) => i + 1);
  };

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      step();
      raf.current = window.setTimeout(() => raf.current = requestAnimationFrame(tick), 380) as any;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        clearTimeout(raf.current as any);
      }
    };
    // eslint-disable-next-line
  }, [running, centroids]);

  const clusterSeries = Array.from({ length: k }, (_, ci) => ({
    type: "scatter" as const,
    name: `cluster ${ci + 1}`,
    color: palette.series[ci % palette.series.length],
    data: points.filter((_, i) => assign[i] === ci),
    marker: { radius: 5, symbol: "circle" },
  }));
  const centroidSeries = {
    type: "scatter" as const,
    name: "centroids",
    data: centroids,
    color: "#27272a",
    marker: { radius: 10, symbol: "diamond", lineColor: "#fff", lineWidth: 2 },
  };

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Live · k-means dance · iter {iter}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={step} variant="outline" disabled={running}>step</Button>
          <Button size="sm" onClick={() => setRunning((r) => !r)} className="gap-1.5">
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? "pause" : "play"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => init(k)} className="gap-1.5">
            <RotateCcw className="size-3.5" /> reset
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSeed((s) => s + 1)} className="gap-1.5">
            <Shuffle className="size-3.5" /> reseed
          </Button>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
          <span>k (number of clusters)</span>
          <span className="font-mono">{k}</span>
        </div>
        <Slider min={2} max={6} step={1} value={[k]} onValueChange={([v]) => setK(v)} />
      </div>
      <Highchart
        height={420}
        options={{
          chart: { type: "scatter" },
          title: { text: "" },
          xAxis: { min: 0, max: 10, title: { text: "feature 1" } },
          yAxis: { min: 0, max: 10, title: { text: "feature 2" } },
          series: [...clusterSeries, centroidSeries],
        }}
      />
    </div>
  );
}
