import type { NextConfig } from "next";

const isCapacitorBuild =
  process.env.BUILD_TARGET === "capacitor" ||
  process.env.NEXT_BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : undefined,
  trailingSlash: isCapacitorBuild,
  // Autoriser l'accès HMR depuis les appareils mobiles sur le réseau local
  allowedDevOrigins: ["172.20.10.3"],
  // Désactiver les features expérimentales incompatibles avec le WebView Android
  experimental: isCapacitorBuild ? {
    webpackBuildWorker: false,
  } : {},
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: isCapacitorBuild,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
