"use client";
import { useState } from "react";
import { Highchart, palette } from "@/components/highchart";
import { Slider } from "@/components/ui/slider";

export function DotProductInteractive() {
  const [a, setA] = useState([2, 3, 4]);
  const [p, setP] = useState([1, 2, 3]);
  const items = ["Apples", "Bananas", "Clementines"];
  const total = a.reduce((s, v, i) => s + v * p[i], 0);

  return (
    <div className="not-prose my-8 rounded-lg border bg-card p-4 sm:p-6">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Live · drag the sliders
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {items.map((label, i) => (
          <div key={label} className="rounded-md border p-3 bg-background">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="text-lg font-display font-bold mb-1">
              {a[i]} × ${p[i]} = <span className="text-foreground">${a[i] * p[i]}</span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">qty</div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[a[i]]}
                  onValueChange={([v]) => setA(a.map((x, j) => (j === i ? v : x)))}
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">price</div>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[p[i]]}
                  onValueChange={([v]) => setP(p.map((x, j) => (j === i ? v : x)))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Highchart
        height={300}
        options={{
          chart: { type: "column" },
          title: { text: `Dot product = $${total}` },
          xAxis: { categories: items, title: { text: "" } },
          yAxis: { title: { text: "USD" } },
          plotOptions: { column: { borderRadius: 6, borderWidth: 0 } },
          series: [
            { type: "column", name: "qty × price", data: a.map((v, i) => v * p[i]), color: palette.series[0] },
          ],
        }}
      />
    </div>
  );
}
