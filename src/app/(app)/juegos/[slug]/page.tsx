// Hub del juego: muestra info del juego + los paneles de secciones.
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GAME_SECTIONS } from "@/lib/demo-data";
import { getGameMeta } from "@/lib/games";
import { getReadySections } from "@/lib/sections";
import { Panel, HudLabel } from "@/components/hud";
import {
  BookIcon,
  UsersIcon,
  PawIcon,
  DragonIcon,
  GemIcon,
  GiftIcon,
  CalendarIcon,
  WrenchIcon,
  ShieldIcon,
} from "@/components/icons";

// Icono por sección
const SECTION_ICON: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  guias: BookIcon,
  heroes: UsersIcon,
  facciones: ShieldIcon,
  "war-pets": PawIcon,
  behemoths: DragonIcon,
  artefactos: GemIcon,
  codigos: GiftIcon,
  eventos: CalendarIcon,
  herramientas: WrenchIcon,
};

// Imagen de portada por sección (por juego)
const SECTION_COVERS: Record<string, Record<string, string>> = {
  "call-of-dragons": {
    guias:        "https://cdn.cod.guide/wp-content/uploads/2023/10/Call-of-Dragons-power-guide-1024x576.jpg",
    heroes:       "https://cdn.cod.guide/wp-content/uploads/2023/01/promoting-star-level-in-Call-of-Dragons-1024x576.jpg",
    facciones:    "https://www.allclash.com/wp-content/uploads/2023/04/call-of-dragons-best-factions-2023.jpg",
    "war-pets":   "https://cdn.cod.guide/wp-content/uploads/2023/08/Skill-Card-Store-1024x576.jpg",
    behemoths:    "https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-Behemoths-1024x576.png",
    artefactos:   "https://cdn.cod.guide/wp-content/uploads/2023/02/opening-artifact-in-tavern-1024x576.png",
    codigos:      "https://cdn.cod.guide/wp-content/uploads/2023/02/Call-of-Dragons-Alliance-1024x576.png",
    eventos:      "https://cdn.cod.guide/wp-content/uploads/2023/01/Call-of-Dragons-Events-300x169.png",
    herramientas: "https://cdn.cod.guide/wp-content/uploads/2023/03/call-of-dragons-background.jpg",
  },
};

export default async function GameHub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  const ready = await getReadySections(slug);
  const covers = SECTION_COVERS[slug] ?? {};

  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      {/* migas de pan */}
      <div className="mb-6 flex items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <span className="text-white/70">{game.name}</span>
      </div>

      {/* Cabecera del juego */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <HudLabel>{game.tag}</HudLabel>
          <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
            {game.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/55">{game.description}</p>
        </div>
        <span className="hex hidden h-14 w-14 shrink-0 place-items-center bg-gradient-to-br from-rank to-amber-600 font-title text-xl font-extrabold text-black sm:grid">
          {game.rank}
        </span>
      </div>

      {/* Paneles de secciones */}
      <div className="mb-6 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">SECCIONES</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_SECTIONS.map((s) => {
          const Icon = SECTION_ICON[s.slug] ?? BookIcon;
          const isReady = ready.has(s.slug);
          const coverImg = covers[s.slug];

          const card = (
            <Panel corners={isReady} className={`group h-full ${isReady ? "sweep lift" : "opacity-70"}`}>
              <div className="panel-inner flex h-full flex-col">

                {/* Imagen de cabecera */}
                <div className="relative h-36 w-full overflow-hidden border-b border-white/8">
                  {coverImg ? (
                    <>
                      <Image
                        src={coverImg}
                        alt={s.label}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Overlay HUD: oscurece + tiñe de violeta */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
                      {isReady && <div className="scanlines absolute inset-0 opacity-20" />}
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-brand/8" />
                  )}

                  {/* Ícono flotante sobre la imagen */}
                  <div className="absolute bottom-3 left-4 z-10">
                    <span className="hex grid h-10 w-10 place-items-center bg-black/60 ring-1 ring-accent/40 backdrop-blur-sm group-hover:ring-accent/70 transition-all">
                      <Icon className="h-4 w-4 text-accent" />
                    </span>
                  </div>

                  {/* Badge estado */}
                  <div className="absolute right-3 top-3 z-10">
                    {isReady ? (
                      <span className="hud-label rounded border border-emerald-400/30 bg-black/60 px-1.5 py-0.5 text-[9px] text-emerald-400/90 backdrop-blur-sm">
                        LISTO
                      </span>
                    ) : (
                      <span className="hud-label rounded border border-amber-400/30 bg-black/60 px-1.5 py-0.5 text-[9px] text-amber-400/70 backdrop-blur-sm">
                        PRÓXIMO
                      </span>
                    )}
                  </div>
                </div>

                {/* Texto */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-title text-base font-bold leading-tight group-hover:text-accent transition-colors">
                    {s.label}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-white/50">
                    {s.desc}
                  </p>
                  <span className={`mt-4 inline-flex items-center gap-1.5 font-hud text-xs font-semibold ${isReady ? "text-accent/80 group-hover:text-accent" : "text-white/30"} transition-colors`}>
                    {isReady ? "Abrir" : "Próximamente"} {isReady && <span>▸</span>}
                  </span>
                </div>

              </div>
            </Panel>
          );

          return (
            <Link key={s.slug} href={`/juegos/${game.slug}/${s.slug}`} className="block h-full">
              {card}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
