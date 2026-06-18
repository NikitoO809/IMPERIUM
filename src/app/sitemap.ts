// Mapa del sitio (sitemap.xml) para buscadores. Incluye las rutas estáticas y las
// dinámicas (juegos publicados, sus guías y las secciones del Hub con contenido).
// Reutiliza la capa de datos existente para no reinventar consultas.
import type { MetadataRoute } from "next";
import { getCatalog, getGuidesForGame } from "@/lib/games";
import { getHubSections } from "@/lib/sections";
import { siteUrl } from "@/lib/seo";

// Secciones que tienen su propia ruta (no van por la ruta genérica [seccion]).
const SPECIAL_SECTIONS = new Set(["guias", "heroes"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Rutas estáticas principales.
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/juegos",
    "/nosotros",
    "/comunidad",
    "/fama",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  // Rutas dinámicas: por cada juego publicado, su Hub + guías + secciones del Hub.
  const games = await getCatalog();
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  for (const game of games) {
    // Hub del juego.
    dynamicRoutes.push({ url: `${siteUrl}/juegos/${game.slug}`, lastModified: now });

    // Guías publicadas + secciones del Hub (independientes entre sí → en paralelo).
    const [guidesData, hubSections] = await Promise.all([
      getGuidesForGame(game.slug),
      getHubSections(game.slug),
    ]);

    for (const guide of guidesData?.guides ?? []) {
      dynamicRoutes.push({
        url: `${siteUrl}/juegos/${game.slug}/guias/${guide.slug}`,
        lastModified: now,
      });
    }

    for (const section of hubSections) {
      // 'guias' ya está cubierta como /guias/[guia]; 'heroes' tiene su propia galería.
      if (SPECIAL_SECTIONS.has(section.slug)) continue;
      dynamicRoutes.push({
        url: `${siteUrl}/juegos/${game.slug}/${section.slug}`,
        lastModified: now,
      });
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
