import type { MetadataRoute } from "next";
import { awardCategories, pastWinners } from "@/lib/data";

const BASE_URL = "https://ecoawardsafrica.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    // Static pages
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0, lastModified: new Date() },
    { url: `${BASE_URL}/winners`, changeFrequency: "monthly", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/news`, changeFrequency: "daily", priority: 0.8, lastModified: new Date() },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${BASE_URL}/ceremony`, changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
    { url: `${BASE_URL}/judges`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date() },
    { url: `${BASE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/login`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
  ];

  // Category pages (static, derived from data)
  for (const cat of awardCategories) {
    urls.push({
      url: `${BASE_URL}/categories/${cat.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: new Date(),
    });
  }

  // Static past winners
  for (const w of pastWinners) {
    urls.push({
      url: `${BASE_URL}/winners/${w.year}/${w.categoryId}`,
      changeFrequency: "yearly",
      priority: 0.6,
      lastModified: new Date(),
    });
  }

  return urls;
}
