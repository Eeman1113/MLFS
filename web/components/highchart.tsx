"use client";
import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "./theme-provider";

if (typeof window !== "undefined" && typeof HighchartsHeatmap === "function") {
  (HighchartsHeatmap as unknown as (h: typeof Highcharts) => void)(Highcharts);
}

export type HCOptions = Highcharts.Options;
export { palette } from "@/lib/palette";

const baseLight: HCOptions = {
  chart: { backgroundColor: "transparent", style: { fontFamily: "var(--font-poppins)" } },
  title: { style: { fontWeight: "700" } },
  legend: { itemStyle: { color: "#27272a", fontWeight: "500" } },
  xAxis: { lineColor: "#e4e4e7", tickColor: "#e4e4e7", labels: { style: { color: "#52525b" } }, title: { style: { color: "#3f3f46" } }, gridLineColor: "#f4f4f5" },
  yAxis: { lineColor: "#e4e4e7", tickColor: "#e4e4e7", labels: { style: { color: "#52525b" } }, title: { style: { color: "#3f3f46" } }, gridLineColor: "#f4f4f5" },
  credits: { enabled: false },
  tooltip: { backgroundColor: "rgba(255,255,255,0.95)", borderColor: "#e4e4e7", style: { color: "#18181b" } },
};

const baseDark: HCOptions = {
  chart: { backgroundColor: "transparent", style: { fontFamily: "var(--font-poppins)" } },
  title: { style: { color: "#fafafa", fontWeight: "700" } },
  legend: { itemStyle: { color: "#e4e4e7", fontWeight: "500" }, itemHoverStyle: { color: "#fff" } },
  xAxis: { lineColor: "#3f3f46", tickColor: "#3f3f46", labels: { style: { color: "#a1a1aa" } }, title: { style: { color: "#d4d4d8" } }, gridLineColor: "#27272a" },
  yAxis: { lineColor: "#3f3f46", tickColor: "#3f3f46", labels: { style: { color: "#a1a1aa" } }, title: { style: { color: "#d4d4d8" } }, gridLineColor: "#27272a" },
  credits: { enabled: false },
  tooltip: { backgroundColor: "rgba(24,24,27,0.95)", borderColor: "#3f3f46", style: { color: "#fafafa" } },
};

function merge<T>(a: any, b: any): T {
  if (Array.isArray(a) || Array.isArray(b)) return b ?? a;
  if (a && typeof a === "object" && b && typeof b === "object") {
    const out: any = { ...a };
    for (const k of Object.keys(b)) out[k] = merge(a[k], b[k]);
    return out;
  }
  return b === undefined ? a : b;
}

export function Highchart({
  options,
  height = 360,
  className,
}: {
  options: HCOptions;
  height?: number | string;
  className?: string;
}) {
  const { theme } = useTheme();
  const ref = useRef<any>(null);

  const merged = merge<HCOptions>(theme === "dark" ? baseDark : baseLight, options);
  merged.chart = { ...(merged.chart || {}), height };

  useEffect(() => {
    const id = window.setTimeout(() => ref.current?.chart?.reflow(), 50);
    return () => window.clearTimeout(id);
  }, [theme]);

  return (
    <div className={`not-prose my-6 rounded-lg border bg-card p-4 ${className || ""}`}>
      <HighchartsReact highcharts={Highcharts} options={merged} ref={ref} />
    </div>
  );
}

