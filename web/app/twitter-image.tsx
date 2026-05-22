import { ImageResponse } from "next/og";

export const alt = "MLFS – Machine Learning From Scratch by Eeman Majumder";
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
          gap: 24,
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
          MLFS · Machine Learning From Scratch
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
          A 69-page book that seduces you into loving ML.
        </div>
        <div style={{ fontSize: 32, opacity: 0.6 }}>
          by Eeman Majumder · mlfs.online
        </div>
      </div>
    ),
    { ...size }
  );
}
