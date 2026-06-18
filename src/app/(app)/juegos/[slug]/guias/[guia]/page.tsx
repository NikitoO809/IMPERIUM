// Página de una guía concreta: cabecera + pasos interactivos (GuideRunner).
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGuide } from "@/lib/games";
import { HudLabel, Panel } from "@/components/hud";
import { GuideRunner } from "@/components/GuideRunner";
import { ImageZoom } from "@/components/ImageZoom";
import { TalentBuildsViewer } from "@/components/TalentBuildsViewer";

// Metadata SEO por guía (reutiliza getGuide; Next deduplica el fetch).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; guia: string }>;
}): Promise<Metadata> {
  const { slug, guia } = await params;
  const data = await getGuide(slug, guia);
  if (!data) return { title: "Guía" };
  const { meta: game, guide } = data;
  const description =
    guide.description || `Guía de ${game.name}: ${guide.title}. Paso a paso en IMPERIUM.`;
  const cover = guide.introImages[0];
  return {
    title: guide.title,
    description,
    openGraph: {
      title: guide.title,
      description,
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string; guia: string }>;
}) {
  const { slug, guia } = await params;
  const data = await getGuide(slug, guia);
  if (!data) notFound();
  const { meta: game, guide, completedStepIds } = data;

  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 pb-4">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}/guias`} className="transition hover:text-accent">Guías</Link>
        <span>/</span>
        <span className="text-white/70">{guide.title}</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-2 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        {guide.title}
      </h1>
      <p className="mb-6 max-w-xl text-sm text-white/55">{guide.description}</p>

      {/* Introducción de la guía (bloque de contexto de la fuente, no es un paso) */}
      {(guide.intro || guide.introTitle) && (
        <Panel corners className="mb-8">
          <div className="panel-inner p-5 sm:p-7">
            {guide.introTitle && (
              <h2 className="mb-2 font-title text-xl font-bold text-glow-accent">
                {guide.introTitle}
              </h2>
            )}
            {guide.intro
              ?.split("\n\n")
              .map((para, i) => (
                <p key={i} className="mt-2 max-w-3xl text-base leading-relaxed text-white/70">
                  {para}
                </p>
              ))}
            {guide.introImages.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {guide.introImages.map((src) => (
                  <ImageZoom
                    key={src}
                    src={src}
                    className="bevel relative block aspect-video w-full overflow-hidden border border-white/10"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </ImageZoom>
                ))}
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* Si los pasos son builds de talentos (__TALENTS__), usa el visor especial;
          si no, el lector de pasos interactivo normal. */}
      {guide.steps[0]?.content.startsWith("__TALENTS__") ? (
        <TalentBuildsViewer steps={guide.steps} />
      ) : (
        <GuideRunner steps={guide.steps} initialCompletedIds={completedStepIds} />
      )}
    </main>
  );
}
