"use client";
import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { Play, Loader2, Square, RotateCcw, Terminal, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { usePyodide } from "./pyodide-provider";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

type Props = {
  code: string;
  title?: string;
  caption?: string;
  height?: string;
  /** packages to load via pyodide.loadPackage before running */
  packages?: string[];
  /** When true, hide the run button (read-only demo) */
  readOnly?: boolean;
};

export function RunnableCode({
  code,
  title,
  caption,
  height = "auto",
  packages = [],
  readOnly = false,
}: Props) {
  const { theme } = useTheme();
  const { load, status: pyStatus } = usePyodide();
  const [src, setSrc] = useState(code);
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => setSrc(code), [code]);

  const run = async () => {
    setRunning(true);
    setOutput("");
    setHasRun(true);
    try {
      const py = await load();
      // capture stdout/stderr
      py.setStdout({ batched: (s: string) => setOutput((o) => o + s + "\n") });
      py.setStderr({ batched: (s: string) => setOutput((o) => o + s + "\n") });
      if (packages.length) {
        await py.loadPackage(packages);
      } else {
        // auto-detect common imports
        const auto: string[] = [];
        if (/\bimport\s+numpy\b|from\s+numpy\b/.test(src)) auto.push("numpy");
        if (/\bimport\s+pandas\b|from\s+pandas\b/.test(src)) auto.push("pandas");
        if (/\bimport\s+matplotlib\b|from\s+matplotlib\b/.test(src)) auto.push("matplotlib");
        if (auto.length) await py.loadPackage(auto);
      }
      // wrap in try/except to surface tracebacks nicely
      const wrapped = `
import sys, traceback
try:
${src.split("\n").map((l) => "    " + l).join("\n")}
except Exception:
    traceback.print_exc()
`;
      await py.runPythonAsync(wrapped);
    } catch (e: any) {
      setOutput((o) => o + "\n" + (e?.message || String(e)));
    } finally {
      setRunning(false);
      requestAnimationFrame(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight }));
    }
  };

  const reset = () => {
    setSrc(code);
    setOutput("");
    setHasRun(false);
  };

  return (
    <div className="not-prose my-6 rounded-2xl border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          <span className="ml-2 text-xs font-mono text-muted-foreground truncate">
            {title || "main.py"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {pyStatus === "loading" && (
            <Badge variant="ghost" className="gap-1.5 font-mono">
              <Loader2 className="size-3 animate-spin" /> loading python…
            </Badge>
          )}
          {pyStatus === "ready" && !running && (
            <Badge variant="ghost" className="gap-1.5 font-mono">
              <Sparkles className="size-3" /> python ready
            </Badge>
          )}
          {!readOnly && (
            <>
              <Button
                onClick={reset}
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5"
                disabled={running}
                aria-label="reset"
              >
                <RotateCcw className="size-3.5" /> reset
              </Button>
              <Button
                onClick={run}
                size="sm"
                disabled={running}
                className="h-8 gap-1.5"
              >
                {running ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                {running ? "running" : "run"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#282c34]">
        <CodeMirror
          value={src}
          onChange={(v) => setSrc(v)}
          theme={oneDark}
          extensions={[python()]}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            highlightActiveLine: !readOnly,
            highlightActiveLineGutter: !readOnly,
          }}
          style={{ height }}
        />
      </div>

      {hasRun && (
        <div className="border-t bg-background">
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono text-muted-foreground uppercase tracking-[0.18em]">
            <Terminal className="size-3" /> output
          </div>
          <pre
            ref={outputRef}
            className={cn(
              "px-4 pb-4 max-h-72 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed",
              running ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {output || (running ? "running…" : "(no output)")}
          </pre>
        </div>
      )}

      {caption && (
        <div className="px-4 pb-3 text-[11px] text-muted-foreground italic">{caption}</div>
      )}
    </div>
  );
}
