import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Do NOT enable ignoreBuildErrors — production builds must catch type errors.
  // If the build fails, fix the type error rather than silencing it.
  reactStrictMode: true, // Catches unsafe lifecycles, double-renders, missing cleanups in dev
  images: {
    // Only allow image optimization from trusted hostnames.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
