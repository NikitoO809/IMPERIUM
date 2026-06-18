// Hub del juego: muestra info del juego + los paneles de secciones.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GAME_SECTIONS } from "@/lib/demo-data";
import { getGameMeta } from "@/lib/games";
import { getHubSections } from "@/lib/sections";
import { getAssistantIdentity } from "@/lib/assistant";
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

// Registro de iconos por CLAVE (lo que guarda game_sections.icon para secciones
// dinámicas). Si la sección no trae clave, se cae a SECTION_ICON por slug.
const ICON_BY_KEY: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  book: BookIcon, users: UsersIcon, shield: ShieldIcon, paw: PawIcon,
  dragon: DragonIcon, gem: GemIcon, gift: GiftIcon, calendar: CalendarIcon, wrench: WrenchIcon,
};

// "war-pets" → "War Pets" (fallback de nombre para secciones sin label)
function prettify(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

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
  "sword-x-staff": {
    // 'guias' es ruta especial (sin fila en game_sections); su portada va aquí.
    // Las secciones dinámicas (p. ej. fantomons) traen su cover_image desde la BD.
    guias:   "https://eog.gg/assets/games/sword-x-staff/kingdoms/forest.webp",
    codigos: "https://eog.gg/assets/games/sword-x-staff/card.webp",
  },
};

// Metadata SEO por juego (reutiliza getGameMeta; Next deduplica el fetch).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) return { title: "Juego" };
  const description = game.description || `Guías, builds y comunidad de ${game.name} en IMPERIUM.`;
  return {
    title: game.name,
    description,
    openGraph: {
      title: game.name,
      description,
      ...(game.coverImage ? { images: [{ url: game.coverImage }] } : {}),
    },
  };
}

export default async function GameHub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  const hubSections = await getHubSections(slug);
  const covers = SECTION_COVERS[slug] ?? {};
  const assistant = getAssistantIdentity(slug, game.name);

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

      {/* Asistente IA — escaparate destacado */}
      <Link href={`/juegos/${game.slug}/asistente`} className="mt-8 block">
        <Panel corners className="group sweep lift">
          <div className="panel-inner flex items-center gap-4 p-5">
            <span className="hex grid h-14 w-14 shrink-0 place-items-center bg-gradient-to-br from-brand to-accent/70 font-title text-2xl font-extrabold text-black">
              ◆
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-title text-lg font-bold group-hover:text-accent transition-colors">
                  {assistant.name} · Asistente IA
                </h3>
                <span className="hud-label rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[8px] text-accent">
                  NUEVO
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Pregúntale lo que quieras sobre {game.name}: builds, héroes, eventos, estrategias…
                Sabe de todas las guías y responde al instante.
              </p>
            </div>
            <span className="hidden shrink-0 font-hud text-sm font-semibold text-accent/80 group-hover:text-accent transition-colors sm:inline">
              Probar ▸
            </span>
          </div>
        </Panel>
      </Link>

      {/* Paneles de secciones */}
      <div className="mb-6 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">SECCIONES</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      {hubSections.length === 0 ? (
        <Panel className="opacity-80">
          <div className="panel-inner p-8 text-center text-sm text-white/55">
            Aún no hay secciones con contenido para este juego. ¡Pronto habrá más!
          </div>
        </Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubSections.map((s) => {
            // Presentación: la BD manda; si está vacía, se cae al catálogo del código.
            const meta = GAME_SECTIONS.find((g) => g.slug === s.slug);
            const label = s.label ?? meta?.label ?? prettify(s.slug);
            const desc = s.description ?? meta?.desc ?? "";
            const Icon = (s.icon ? ICON_BY_KEY[s.icon] : undefined) ?? SECTION_ICON[s.slug] ?? BookIcon;
            const coverImg = s.coverImage ?? covers[s.slug] ?? undefined;

            return (
              <Link key={s.slug} href={`/juegos/${game.slug}/${s.slug}`} className="block h-full">
                <Panel corners className="group h-full sweep lift">
                  <div className="panel-inner flex h-full flex-col">

                    {/* Imagen de cabecera */}
                    <div className="relative h-36 w-full overflow-hidden border-b border-white/8">
                      {coverImg ? (
                        <>
                          <Image
                            src={coverImg}
                            alt={label}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {/* Overlay HUD: oscurece + tiñe de violeta */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
                          <div className="scanlines absolute inset-0 opacity-20" />
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

                      {/* Solo se muestran secciones con contenido → siempre LISTO */}
                      <div className="absolute right-3 top-3 z-10">
                        <span className="hud-label rounded border border-emerald-400/30 bg-black/60 px-1.5 py-0.5 text-[9px] text-emerald-400/90 backdrop-blur-sm">
                          LISTO
                        </span>
                      </div>
                    </div>

                    {/* Texto */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-title text-base font-bold leading-tight group-hover:text-accent transition-colors">
                        {label}
                      </h3>
                      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-white/50">
                        {desc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-hud text-xs font-semibold text-accent/80 group-hover:text-accent transition-colors">
                        Abrir <span>▸</span>
                      </span>
                    </div>

                  </div>
                </Panel>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
