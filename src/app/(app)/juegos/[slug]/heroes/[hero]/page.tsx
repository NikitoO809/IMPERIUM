// Página dedicada a la build de un héroe: /juegos/[slug]/heroes/[hero]
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/auth-config";
import { getGameMeta } from "@/lib/games";
import { getHeroesByGame } from "@/lib/heroes";
import { HudLabel, Panel } from "@/components/hud";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";
import type { Hero, HeroBuild } from "@/lib/heroes";

const CLASS_ES: Record<string, string> = {
  Magic: "Mago", Infantry: "Infantería", Cavalry: "Caballería",
  Marksman: "Tirador", Overall: "Universal",
};
const ROLE_ES: Record<string, string> = {
  PvP: "PvP", Garrison: "Guarnición", Rally: "Rally",
  Peacekeeping: "Pacificación", Gathering: "Recolección", Engineering: "Ingeniería",
};
const TIER_COLOR: Record<string, string> = {
  "S+": "text-[#ffd700] border-[#ffd700]/60",
  S:   "text-[#ffcf5a] border-[#ffcf5a]/60",
  "A+": "text-[#22e0ff] border-[#22e0ff]/60",
  A:   "text-[#22e0ff]/80 border-[#22e0ff]/40",
  "B+": "text-[#a78bfa] border-[#a78bfa]/60",
  B:   "text-[#a78bfa]/80 border-[#a78bfa]/40",
  NEW: "text-[#22e0ff] border-[#22e0ff]/60",
};

// ── Detecta si una sección es la de parejas ──────────────────
function isPairingsSection(section: string) {
  const s = section.toLowerCase();
  return s.includes("pareja") || s.includes("pairing");
}

// Palabras de inicio que NO son nombres de héroes (oraciones genéricas)
const NOT_HERO_NAMES = new Set([
  "Si", "En", "Con", "Sin", "Al", "El", "La", "Lo", "Los", "Las",
  "Un", "Una", "Para", "Por", "De", "Del", "Que", "Como", "Cuando",
  "Empareja", "Emparéjala", "Emparéjalo", "Usar", "Reunir",
]);

// ── Parsea un párrafo de pareja detectando nombre de héroe al inicio ──
// Captura 1-3 palabras Capitalizadas al inicio antes de cualquier conector.
function parsePairing(paragraph: string): { name: string; desc: string } | null {
  // Una "palabra de nombre propio": empieza con mayúscula, resto minúsculas/guión/apóstrofe
  const match = paragraph.match(
    /^((?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ\-']+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ\-']+){0,2})/
  );
  if (!match) return null;
  const name = match[1].trim();
  const firstWord = name.split(" ")[0];
  if (NOT_HERO_NAMES.has(firstWord)) return null;
  if (name.length < 3) return null;
  return { name, desc: paragraph };
}

// ── Renderer de tarjetas de pareja ───────────────────────────
function PairingsBlock({ content }: { content: string }) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  const pairings = paragraphs.map(parsePairing);
  const allParsed = pairings.every((p) => p !== null);

  // Si no se pudo parsear, render normal
  if (!allParsed) {
    return (
      <div className="flex flex-col gap-2">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-white/75 leading-relaxed">{p}</p>
        ))}
      </div>
    );
  }

  // Paleta de acento por posición (para variedad visual)
  const accents = [
    "border-[#22e0ff]/50 bg-[#22e0ff]/5",
    "border-[#a78bfa]/50 bg-[#a78bfa]/5",
    "border-[#ffcf5a]/50 bg-[#ffcf5a]/5",
    "border-[#22e0ff]/30 bg-[#22e0ff]/3",
    "border-[#a78bfa]/30 bg-[#a78bfa]/3",
    "border-white/20 bg-white/3",
  ];
  const nameColors = [
    "text-[#22e0ff]",
    "text-[#a78bfa]",
    "text-[#ffcf5a]",
    "text-[#22e0ff]/80",
    "text-[#a78bfa]/80",
    "text-white/80",
  ];
  const icons = ["★", "◆", "▲", "●", "◈", "◇"];

  return (
    <div className="flex flex-col gap-3">
      {pairings.map((p, i) => {
        if (!p) return null;
        const accent = accents[i % accents.length];
        const nameColor = nameColors[i % nameColors.length];
        const icon = icons[i % icons.length];
        // Quitar el nombre del inicio de la descripción para no repetirlo
        const descBody = p.desc.replace(p.name, "").replace(/^\s*[,.]?\s*/, "").trim();

        return (
          <div
            key={i}
            className={`rounded border ${accent} p-3 flex gap-3 items-start transition-all hover:brightness-110`}
          >
            {/* Icono + número */}
            <div className="shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
              <span className={`font-title font-black text-lg leading-none ${nameColor}`}>{icon}</span>
              <span className="text-[9px] text-white/25 font-hud">#{i + 1}</span>
            </div>
            {/* Contenido */}
            <div className="flex flex-col gap-1 min-w-0">
              <span className={`font-title font-extrabold text-sm ${nameColor}`}>{p.name}</span>
              <p className="text-xs text-white/65 leading-relaxed">{descBody}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Renderer de un bloque de build genérico ──────────────────
function BuildBlock({ build }: { build: HeroBuild }) {
  const isPairings = isPairingsSection(build.section);

  return (
    <Panel>
      <div className="panel-inner p-4 flex flex-col gap-3">
        <HudLabel>{build.section}</HudLabel>

        {isPairings ? (
          <PairingsBlock content={build.content} />
        ) : (
          build.content.split("\n\n").map((p, i) => (
            <p key={i} className="text-sm text-white/75 leading-relaxed">{p}</p>
          ))
        )}

        {build.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
            {build.images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded overflow-hidden bevel border border-white/10">
                <Image src={img} alt="" fill className="object-contain" sizes="250px" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

// ── Carga de datos ───────────────────────────────────────────
async function getHeroWithBuild(gameSlug: string, heroSlug: string) {
  if (!SUPABASE_CONFIGURED) return null;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games").select("id").eq("slug", gameSlug).eq("is_published", true).maybeSingle();
  if (!game) return null;
  const gameId = (game as { id: string }).id;

  const { data: heroRow } = await supabase
    .from("heroes")
    .select("id, name, slug, generation, tier, faction, hero_class, role, specialty, description, image_url")
    .eq("game_id", gameId)
    .eq("slug", heroSlug)
    .maybeSingle();
  if (!heroRow) return null;

  const h = heroRow as {
    id: string; name: string; slug: string; generation: number; tier: string;
    faction: string; hero_class: string; role: string; specialty: string;
    description: string; image_url: string;
  };
  const hero: Hero = {
    id: h.id, name: h.name, slug: h.slug, generation: h.generation, tier: h.tier,
    faction: h.faction, heroClass: h.hero_class, role: h.role,
    specialty: h.specialty, description: h.description, imageUrl: h.image_url,
  };

  const { data: buildRows } = await supabase
    .from("hero_builds")
    .select("id, section, order_index, content, images, source_url, is_verified")
    .eq("hero_id", hero.id)
    .order("order_index");

  const builds: HeroBuild[] = (buildRows ?? []).map((b: {
    id: string; section: string; order_index: number; content: string;
    images: string[] | null; source_url: string | null; is_verified: boolean;
  }) => ({
    id: b.id, section: b.section, orderIndex: b.order_index,
    content: b.content, images: b.images ?? [],
    sourceUrl: b.source_url, isVerified: b.is_verified,
  }));

  return { hero, builds };
}

// Metadata SEO por héroe (reutiliza getGameMeta + getHeroesByGame).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; hero: string }>;
}): Promise<Metadata> {
  const { slug, hero: heroSlug } = await params;
  const game = await getGameMeta(slug);
  if (!game) return { title: "Héroe" };

  const heroes = await getHeroesByGame(slug);
  const hero = heroes.find((h) => h.slug === heroSlug);
  if (!hero) return { title: `Héroe — ${game.name}` };

  const title = `${hero.name} — ${game.name}`;
  const description =
    hero.description?.trim() || `Build y guía de ${hero.name} en ${game.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/juegos/${slug}/heroes/${heroSlug}` },
    openGraph: {
      title,
      description,
      ...(hero.imageUrl ? { images: [{ url: hero.imageUrl }] } : {}),
    },
  };
}

// ── Página ───────────────────────────────────────────────────
export default async function HeroBuildPage({
  params,
}: {
  params: Promise<{ slug: string; hero: string }>;
}) {
  const { slug, hero: heroSlug } = await params;

  const game = await getGameMeta(slug);
  if (!game) notFound();

  const data = await getHeroWithBuild(slug, heroSlug);
  if (!data) notFound();

  const { hero, builds } = data;
  const tc = TIER_COLOR[hero.tier] ?? "text-white/60 border-white/20";

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-20">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Juegos", path: "/juegos" },
          { name: game.name, path: `/juegos/${game.slug}` },
          { name: "Héroes", path: `/juegos/${game.slug}/heroes` },
          { name: hero.name, path: `/juegos/${game.slug}/heroes/${heroSlug}` },
        ])}
      />
      {/* Migas */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}/heroes`} className="transition hover:text-accent">Héroes</Link>
        <span>/</span>
        <span className="text-white/70">{hero.name}</span>
      </div>

      {/* Cabecera */}
      <Panel corners className="mb-8">
        <div className="panel-inner p-5 flex gap-5 items-start">
          {hero.imageUrl && (
            <div className="relative shrink-0 w-28 h-28 rounded bevel overflow-hidden border border-white/15">
              <Image src={hero.imageUrl} alt={hero.name} fill className="object-cover object-top" sizes="112px" />
            </div>
          )}
          <div className="flex flex-col gap-3 min-w-0">
            <HudLabel>{game.name} · Generación {hero.generation}</HudLabel>
            <h1 className="font-title text-2xl font-extrabold text-white text-glow-brand leading-tight">
              {hero.name} — Build
            </h1>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`font-title font-black px-2 py-0.5 rounded border bg-black/50 ${tc}`}>
                Tier {hero.tier}
              </span>
              <span className="px-2 py-0.5 rounded border border-white/20 text-white/60">
                {CLASS_ES[hero.heroClass] ?? hero.heroClass}
              </span>
              <span className="px-2 py-0.5 rounded border border-white/20 text-white/60">
                {hero.faction}
              </span>
              <span className="px-2 py-0.5 rounded border border-accent/30 text-accent/80">
                Mejor rol: {ROLE_ES[hero.role] ?? hero.role}
              </span>
            </div>
            {hero.description && (
              <p className="text-xs text-white/55 leading-relaxed line-clamp-3">{hero.description}</p>
            )}
          </div>
        </div>
      </Panel>

      {/* Build */}
      {builds.length === 0 ? (
        <Panel>
          <div className="panel-inner p-8 text-center text-white/40 text-sm">
            La build de <span className="text-white/70">{hero.name}</span> estará disponible próximamente.
          </div>
        </Panel>
      ) : (
        <div className="flex flex-col gap-5">
          {builds.map((b) => (
            <BuildBlock key={b.id} build={b} />
          ))}
        </div>
      )}
    </main>
  );
}
