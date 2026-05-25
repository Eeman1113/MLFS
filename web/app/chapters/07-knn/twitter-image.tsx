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
          justifyContent: "center",
          gap: 20,
          background: "#fafaf7",
          color: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#6366f1",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {`MLFS · Ch. ${chapter.num}`}
        </div>
        <div
          style={{
            fontSize: 88,
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
            fontSize: 30,
            opacity: 0.7,
            maxWidth: 1040,
            marginTop: 20,
            lineHeight: 1.3,
          }}
        >
          {chapter.blurb}
        </div>
        <div style={{ fontSize: 32, opacity: 0.6, marginTop: 12 }}>
          by Eeman Majumder · mlfs.online
        </div>
      </div>
    ),
    { ...size }
  );
}
