// Alianzas de un juego jugable: /juegos/[slug]/alianzas. Cabecera + tarjetas
// reutilizables (AllianceBoard). Ruta estática → prioritaria sobre [seccion].
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameMeta } from "@/lib/games";
import { AllianceBoard } from "@/components/AllianceBoard";
import { HudLabel } from "@/components/hud";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  return { title: game ? `Alianzas — ${game.name}` : "Alianzas" };
}

export default async function AlliancesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Alianzas</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 mb-2 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        Alianzas
      </h1>
      <p className="mb-6 max-w-xl text-sm text-white/55">
        Grupos para entrar juntos a {game.name}. Todos las ven; los donantes las crean; cualquiera se une.
      </p>

      <AllianceBoard gameSlug={slug} gameName={game.name} basePath={`/juegos/${slug}/alianzas`} />
    </main>
  );
}
