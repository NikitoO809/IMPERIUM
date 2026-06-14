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
import { SectionPlaceholder } from "@/components/SectionPlaceholder";

export default async function GameSectionPage({
  params,
}: {
  params: Promise<{ slug: string; seccion: string }>;
}) {
  const { slug, seccion } = await params;

  // La sección debe existir en el catálogo del Hub.
  const sec = GAME_SECTIONS.find((s) => s.slug === seccion);
  if (!sec) notFound();

  const game = await getGameMeta(slug);
  if (!game) notFound();

  const content = await getSectionContent(slug, seccion);

  // Sin contenido cargado todavía → placeholder.
  if (!content) {
    return (
      <SectionPlaceholder
        gameSlug={game.slug}
        gameName={game.name}
        section={sec.label}
        desc={sec.desc}
      />
    );
  }

  return (
    <main className={`mx-auto px-4 pt-12 pb-16 ${seccion === "artefactos" ? "max-w-6xl" : seccion === "behemoths" ? "max-w-5xl" : "max-w-3xl"}`}>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">{sec.label}</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-6 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        {content.title || sec.label}
      </h1>

      {seccion === "artefactos"
        ? <ArtifactosViewer section={content} />
        : seccion === "behemoths"
        ? <BehemothsViewer section={content} />
        : <SectionContent section={content} />
      }
    </main>
  );
}
