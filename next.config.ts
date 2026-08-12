import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  images: {
    // Only allow image optimization from trusted hostnames.
    // Add more as needed (e.g., your CDN, cloudinary, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
