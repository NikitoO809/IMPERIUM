// Página de Héroes de un juego — galería interactiva con fichas, modal de detalle y panel de build.
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameMeta } from "@/lib/games";
import { getHeroesByGame } from "@/lib/heroes";
import { HeroesGallery } from "@/components/HeroesGallery";
import { HudLabel } from "@/components/hud";

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
