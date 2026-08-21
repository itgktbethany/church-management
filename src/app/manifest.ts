import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GKT Bethany CHMS",
    short_name: "GKT Bethany CHMS",
    description: "Church Management System for GKT Bethany",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/gkt-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/gkt-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
