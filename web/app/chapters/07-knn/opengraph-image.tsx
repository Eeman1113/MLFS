import { ImageResponse } from "next/og";
import { CHAPTERS } from "@/lib/chapters";

const SLUG = "07-knn";
const chapter = CHAPTERS.find((c) => c.slug === SLUG)!;

export const alt = `Ch. ${chapter.num} – ${chapter.title} · MLFS`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              opacity: 0.6,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {`Ch. ${chapter.num} · ${chapter.part}`}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            {chapter.title}
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.7,
              maxWidth: 1040,
              marginTop: 24,
              lineHeight: 1.3,
            }}
          >
            {chapter.blurb}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.8 }}>by Eeman Majumder</div>
          <div style={{ fontSize: 28, opacity: 0.5 }}>
            mlfs.online · Machine Learning From Scratch
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
