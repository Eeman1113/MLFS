"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type PyodideAPI = any;

type Ctx = {
  pyodide: PyodideAPI | null;
  status: "idle" | "loading" | "ready" | "error";
  load: () => Promise<PyodideAPI>;
  error: string | null;
};

const PyCtx = createContext<Ctx | null>(null);

declare global {
  interface Window {
    loadPyodide?: any;
    __pyodide?: any;
    __pyodide_promise?: Promise<any>;
  }
}

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

export function PyodideProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Ctx["status"]>("idle");
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideAPI | null>(null);

  const load = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (window.__pyodide) {
      pyodideRef.current = window.__pyodide;
      setStatus("ready");
      return window.__pyodide;
    }
    if (window.__pyodide_promise) {
      const p = await window.__pyodide_promise;
      pyodideRef.current = p;
      setStatus("ready");
      return p;
    }

    setStatus("loading");
    try {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = `${PYODIDE_URL}pyodide.js`;
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Pyodide script"));
          document.head.appendChild(s);
        });
      }
      window.__pyodide_promise = window.loadPyodide({ indexURL: PYODIDE_URL });
      const py = await window.__pyodide_promise;
      window.__pyodide = py;
      pyodideRef.current = py;
      setStatus("ready");
      return py;
    } catch (e: any) {
      setError(e?.message || "Pyodide failed to load");
      setStatus("error");
      throw e;
    }
  };

  return (
    <PyCtx.Provider value={{ pyodide: pyodideRef.current, status, load, error }}>
      {children}
    </PyCtx.Provider>
  );
}

export function usePyodide() {
  const ctx = useContext(PyCtx);
  if (!ctx) throw new Error("usePyodide must be used inside PyodideProvider");
  return ctx;
}
