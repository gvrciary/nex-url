import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NexURL",
    short_name: "NexURL",
    description: "Transform long URLs into short and elegant links. Track clicks, analyze audience and manage your links professionally.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo_svg.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}