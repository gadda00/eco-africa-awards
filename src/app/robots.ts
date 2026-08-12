import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/judge", "/api", "/login"],
      },
    ],
    sitemap: "https://ecoawardsafrica.com/sitemap.xml",
    host: "https://ecoawardsafrica.com",
  };
}
