import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dominios externos cuyas imágenes enlazamos (guías scrapeadas).
    remotePatterns: [
      { protocol: "https", hostname: "eog.gg" },
      { protocol: "https", hostname: "www.allclash.com" },
      { protocol: "https", hostname: "cdn.cod.guide" },
      { protocol: "https", hostname: "callofdragonsguides.com" },
      { protocol: "https", hostname: "albiononline.com" },
      { protocol: "https", hostname: "assets.albiononline.com" },
      // Zenless Zone Zero: retratos de agentes enlazados desde el CDN de Prydwen.
      { protocol: "https", hostname: "cdn.prydwen.gg" },
      // Imágenes subidas por el staff a Supabase Storage (bucket público).
      { protocol: "https", hostname: "fihjqermiqhuubwepfcc.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // Permite que /sw.js (servido desde la raíz) controle el scope /admin.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Service-Worker-Allowed", value: "/admin" },
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
