// Ruta genérica de sección del juego (eventos, codigos, war-pets, behemoths,
// artefactos, herramientas...). Si la sección tiene contenido cargado en la base
// de datos, lo muestra con el diseño HUD; si no, muestra el placeholder.
// Las secciones "guias" y "heroes" tienen sus propias carpetas (rutas estáticas,
// que Next prioriza sobre esta dinámica).
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAME_SECTIONS } from "@/lib/demo-data";
import { getGameMeta } from "@/lib/games";
import { getSectionContent } from "@/lib/sections";
import { HudLabel } from "@/components/hud";
import { SectionContent } from "@/components/SectionContent";
import { ArtifactosViewer } from "@/components/ArtifactosViewer";
import { BehemothsViewer } from "@/components/BehemothsViewer";
import { TierListViewer } from "@/components/TierListViewer";
import { RoadmapViewer } from "@/components/RoadmapViewer";
import { BuildsViewer } from "@/components/BuildsViewer";
import { ClassTierViewer } from "@/components/ClassTierViewer";
import { EventosViewer } from "@/components/EventosViewer";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";

export default async function GameSectionPage({
  params,
}: {
  params: Promise<{ slug: string; seccion: string }>;
}) {
  const { slug, seccion } = await params;

  const game = await getGameMeta(slug);
  if (!game) notFound();

  const content = await getSectionContent(slug, seccion);

  // Etiqueta del catálogo del Hub (si la sección está en él). Las secciones
  // dinámicas creadas por juego (p. ej. 'fantomons') NO están en el catálogo,
  // así que NO exigimos que esté: basta con que tenga contenido.
  const sec = GAME_SECTIONS.find((s) => s.slug === seccion);
  const sectionLabel = sec?.label ?? content?.title ?? seccion;

  // Sin contenido: si es una sección conocida del catálogo, placeholder; si es
  // desconocida y sin contenido, 404 (de verdad no existe).
  if (!content) {
    if (!sec) notFound();
    return (
      <SectionPlaceholder
        gameSlug={game.slug}
        gameName={game.name}
        section={sec.label}
        desc={sec.desc}
      />
    );
  }

  // Tipo de visor: lo manda render_type de la BD; si es 'generic', caemos al
  // mapeo por slug (así artefactos/behemoths de CoD siguen igual aunque no se
  // haya rellenado render_type).
  const rt =
    content.renderType !== "generic"
      ? content.renderType
      : seccion === "artefactos"
      ? "artifact-table"
      : seccion === "behemoths"
      ? "behemoth"
      : seccion === "eventos"
      ? "events"
      : "generic";
  const widthClass =
    rt === "artifact-table" || rt === "tier-list" ? "max-w-6xl"
    : rt === "class-tier" ? "max-w-5xl"
    : rt === "behemoth" ? "max-w-5xl"
    : rt === "builds" ? "max-w-4xl"
    : rt === "roadmap" ? "max-w-3xl"
    : "max-w-3xl";

  return (
    <main className={`mx-auto px-4 pt-12 pb-16 ${widthClass}`}>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">{sectionLabel}</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-6 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        {content.title || sectionLabel}
      </h1>

      {rt === "artifact-table"
        ? <ArtifactosViewer section={content} />
        : rt === "behemoth"
        ? <BehemothsViewer section={content} />
        : rt === "tier-list"
        ? <TierListViewer section={content} />
        : rt === "roadmap"
        ? <RoadmapViewer section={content} />
        : rt === "builds"
        ? <BuildsViewer section={content} />
        : rt === "class-tier"
        ? <ClassTierViewer section={content} />
        : rt === "events"
        ? <EventosViewer section={content} />
        : <SectionContent section={content} />
      }
    </main>
  );
}
