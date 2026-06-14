import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dominios externos cuyas imágenes enlazamos (guías scrapeadas).
    remotePatterns: [
      { protocol: "https", hostname: "eog.gg" },
      { protocol: "https", hostname: "www.allclash.com" },
      { protocol: "https", hostname: "cdn.cod.guide" },
      { protocol: "https", hostname: "callofdragonsguides.com" },
    ],
  },
};

export default nextConfig;
