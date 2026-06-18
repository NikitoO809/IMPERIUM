// robots.txt para buscadores: permite todo el sitio público, bloquea /admin y
// apunta al sitemap. La URL base usa la misma lógica que layout.tsx.
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
