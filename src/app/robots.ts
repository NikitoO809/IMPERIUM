// robots.txt para buscadores: permite todo el sitio público, bloquea /admin y
// /manual (el Manual de Atreia, al que solo se entra con su enlace) y apunta
// al sitemap. La URL base usa la misma lógica que layout.tsx.
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/manual"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
