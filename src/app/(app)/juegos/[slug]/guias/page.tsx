// Sección Guías del juego: grid de tarjetas (2 col desktop).
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGuidesForGame, getGameMeta } from "@/lib/games";
import { Panel, HudLabel, XpBar } from "@/components/hud";
import { BookIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

// Metadata SEO de la lista de guías (reutiliza getGameMeta; Next deduplica el fetch).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) return { title: "Guías" };
  const title = `Guías — ${game.name}`;
  const description = `Todas las guías interactivas de ${game.name} paso a paso en IMPERIUM.`;
  return {
    title,
    description,
    alternates: { canonical: `/juegos/${slug}/guias` },
    openGraph: {
      title,
      description,
      ...(game.coverImage ? { images: [{ url: game.coverImage }] } : {}),
    },
  };
}

export default async function GuiasSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getGuidesForGame(slug);
  if (!data) notFound();
  const { meta: game, guides } = data;

  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Juegos", path: "/juegos" },
          { name: game.name, path: `/juegos/${game.slug}` },
          { name: "Guías", path: `/juegos/${game.slug}/guias` },
        ])}
      />
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Guías</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-10 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Guías
      </h1>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {guides.map((guide, idx) => {
          const pct = guide.stepCount
            ? Math.round((guide.completedCount / guide.stepCount) * 100)
            : 0;
          const started = guide.completedCount > 0;

          return (
            <Link
              key={guide.slug}
              href={`/juegos/${game.slug}/guias/${guide.slug}`}
              className="group block h-full"
            >
              <Panel className="sweep lift h-full">
                <div className="panel-inner flex h-full flex-col">

                  {/* Imagen de cabecera — mismo patrón que el Hub */}
                  <div className="relative h-40 w-full overflow-hidden border-b border-white/8">
                    {guide.coverImage ? (
                      <>
                        <Image
                          src={guide.coverImage}
                          alt={guide.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
                        <div className="scanlines absolute inset-0 opacity-20" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-brand/8">
                        <span className="hex grid h-14 w-14 place-items-center bg-brand/20 ring-2 ring-accent/30 group-hover:ring-accent/60 transition-all">
                          <BookIcon className="h-6 w-6 text-accent" />
                        </span>
                      </div>
                    )}

                    {/* Ícono flotante inferior izquierdo */}
                    <div className="absolute bottom-3 left-4 z-10">
                      <span className="hex grid h-10 w-10 place-items-center bg-black/60 ring-1 ring-accent/40 backdrop-blur-sm group-hover:ring-accent/70 transition-all">
                        <BookIcon className="h-4 w-4 text-accent" />
                      </span>
                    </div>

                    {/* Número de guía */}
                    <span className="absolute bottom-3 right-4 z-10 select-none font-title text-4xl font-extrabold leading-none text-white/20">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Badge EN PROGRESO */}
                    {started && (
                      <span className="absolute left-4 top-3 z-10 hud-label rounded border border-accent/30 bg-black/60 px-1.5 py-0.5 text-[9px] text-accent/80 backdrop-blur-sm">
                        EN PROGRESO
                      </span>
                    )}
                  </div>

                  {/* Cuerpo */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <span className="hud-label text-[9px] text-white/35">
                        GUÍA {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-1.5 font-title text-lg font-bold leading-tight group-hover:text-accent transition-colors">
                        {guide.title}
                      </h3>
                      {guide.description && (
                        <p className="mt-2 text-sm leading-relaxed text-white/45 line-clamp-2">
                          {guide.description}
                        </p>
                      )}
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-auto pt-2">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="hud-label text-[9px] text-white/35">
                          {guide.stepCount} pasos
                        </span>
                        <span className="font-title text-xs font-bold text-accent">
                          {pct}%
                        </span>
                      </div>
                      <XpBar value={pct} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end border-t border-white/6 px-5 py-3">
                    <span className="hud-label flex items-center gap-1.5 text-[10px] text-accent/60 group-hover:text-accent transition-colors">
                      VER GUÍA
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>

                </div>
              </Panel>
            </Link>
          );
        })}
      </div>

      {guides.length === 0 && (
        <div className="mt-12 text-center text-sm text-white/35">
          Aún no hay guías publicadas para este juego.
        </div>
      )}

      <p className="mt-10 text-center text-xs text-white/30">
        Contenido cargado desde fuentes verificadas · más guías en camino.
      </p>
    </main>
  );
}
