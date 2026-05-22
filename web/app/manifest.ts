import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MLFS – Machine Learning From Scratch",
    short_name: "MLFS",
    description: "A 69-page book that seduces you into loving machine learning. Interactive ML primer by Eeman Majumder.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait",
    categories: ["education", "books", "productivity"],
    lang: "en",
    icons: [
      { src: "/icon-light.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/icon-dark.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
