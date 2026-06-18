// Página de Héroes de un juego — galería interactiva con fichas, modal de detalle y panel de build.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameMeta } from "@/lib/games";
import { getHeroesByGame } from "@/lib/heroes";
import { HeroesGallery } from "@/components/HeroesGallery";
import { HudLabel } from "@/components/hud";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

// Metadata SEO de la galería de héroes (reutiliza getGameMeta; Next deduplica el fetch).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) return { title: "Héroes" };
  const title = `Héroes — ${game.name}`;
  const description = `Tier list y builds de los héroes de ${game.name} en IMPERIUM.`;
  return {
    title,
    description,
    alternates: { canonical: `/juegos/${slug}/heroes` },
    openGraph: {
      title,
      description,
      ...(game.coverImage ? { images: [{ url: game.coverImage }] } : {}),
    },
  };
}

export default async function HeroesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const game = await getGameMeta(slug);
  if (!game) notFound();

  const heroes = await getHeroesByGame(slug);

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-20">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Juegos", path: "/juegos" },
          { name: game.name, path: `/juegos/${game.slug}` },
          { name: "Héroes", path: `/juegos/${game.slug}/heroes` },
        ])}
      />
      {/* Migas de pan */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Héroes</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-2 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        Héroes
      </h1>
      <p className="mb-8 text-sm text-white/45">
        {heroes.length} héroes · clic en un héroe para ver su detalle y build
      </p>

      <HeroesGallery heroes={heroes} gameSlug={slug} />
    </main>
  );
}
