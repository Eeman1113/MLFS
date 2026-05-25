import type { MetadataRoute } from "next";

// Web App Manifest screenshot entries support `form_factor` and `label` per
// the W3C spec, but the installed Next 14.2 types omit them. We widen the
// screenshot type locally so the runtime feature is preserved.
type Screenshot = NonNullable<MetadataRoute.Manifest["screenshots"]>[number] & {
  form_factor?: "wide" | "narrow";
  label?: string;
};

export default function manifest(): MetadataRoute.Manifest {
  const screenshots: Screenshot[] = [
    {
      src: "/logo.png",
      sizes: "512x512",
      type: "image/png",
      form_factor: "wide",
      label: "MLFS – Machine Learning From Scratch",
    },
    {
      src: "/logo.png",
      sizes: "512x512",
      type: "image/png",
      form_factor: "narrow",
      label: "MLFS – Machine Learning From Scratch",
    },
  ];

  return {
    id: "/",
    name: "MLFS – Machine Learning From Scratch",
    short_name: "MLFS",
    description:
      "A 69-page book that gets you addicted to machine learning. Interactive ML primer by Eeman Majumder.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait",
    categories: ["education", "books", "productivity"],
    lang: "en",
    prefer_related_applications: false,
    icons: [
      // icon-light (any)
      { src: "/icon-light.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-light.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/icon-light.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/icon-light.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // icon-light (maskable)
      { src: "/icon-light.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-light.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      // icon-dark (any)
      { src: "/icon-dark.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-dark.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/icon-dark.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/icon-dark.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // icon-dark (maskable)
      { src: "/icon-dark.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-dark.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      // logo
      { src: "/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Start reading",
        short_name: "Read",
        description: "Jump to the MLFS homepage and start reading.",
        url: "/",
        icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
      },
      {
        name: "Browse chapters",
        short_name: "Chapters",
        description: "See the full chapter list.",
        url: "/chapters/",
        icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
      },
      {
        name: "About the author",
        short_name: "Author",
        description: "Read the author's note from Eeman Majumder.",
        url: "/authors-note/",
        icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
      },
    ],
    screenshots,
  };
}
