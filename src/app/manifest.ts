import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Africa Climate Leadership Awards",
    short_name: "ACLA Awards",
    description:
      "Celebrating climate leadership across Africa — an initiative of the Africa Climate Leadership Academy.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7EE",
    theme_color: "#1A5E47",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    categories: ["education", "social"],
  };
}
