// Utilidades de SEO compartidas: URL pública del sitio + generadores de datos
// estructurados (JSON-LD, schema.org). Centraliza la lógica de siteUrl que antes
// estaba duplicada en layout.tsx, sitemap.ts y robots.ts.

// URL pública del sitio. En Vercel se detecta sola (VERCEL_PROJECT_PRODUCTION_URL);
// si tienes dominio propio, ponlo en NEXT_PUBLIC_SITE_URL y todo se ajusta solo.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Une un path relativo con la URL base (deja pasar las URLs ya absolutas).
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

// ── Datos estructurados (JSON-LD) ───────────────────────────────
// Cada función devuelve un objeto schema.org que se inyecta con <JsonLd>.
// Usamos @id estables para enlazar la marca entre los distintos bloques.

export const ORG_ID = `${siteUrl}/#organization`;
export const WEBSITE_ID = `${siteUrl}/#website`;

// La organización/marca IMPERIUM (autoría y señales de marca).
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "IMPERIUM",
    url: siteUrl,
    logo: absoluteUrl("/brand/dragon-trans.png"),
    description:
      "Comunidad de juego con guías interactivas, builds y asistente IA.",
  };
}

// El sitio web como entidad (referencia la organización como editor).
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "IMPERIUM",
    url: siteUrl,
    inLanguage: "es",
    publisher: { "@id": ORG_ID },
  };
}

// Migas de pan: Google las muestra bajo el título del resultado de búsqueda.
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

// Un artículo/guía (imagen, descripción, autor = IMPERIUM).
export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: "es",
    mainEntityOfPage: absoluteUrl(opts.path),
    ...(opts.image ? { image: [opts.image] } : {}),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
