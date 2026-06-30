// Página del ASISTENTE IA de un juego. Es pública (escaparate): todo el mundo
// la ve, pero solo Tester+ logueados pueden USARLA. Ruta estática → Next la
// prioriza sobre la ruta dinámica [seccion].
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameMeta } from "@/lib/games";
import { canUseAssistant, assistantDailyLimit } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";
import { AssistantChat } from "@/components/AssistantChat";
import {
  ASSISTANT_CONFIGURED,
  getViewerRank,
  getRemainingToday,
  getUserHistory,
  getAssistantIdentity,
  getExampleQuestions,
  getSampleExchange,
} from "@/lib/assistant";

// El asistente es una herramienta interactiva (no contenido para buscar): la
// marcamos como noindex para no gastar presupuesto de rastreo en ella, pero
// dejamos que Google siga sus enlaces (follow).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  return {
    title: game ? `Asistente IA — ${game.name}` : "Asistente IA",
    robots: { index: false, follow: true },
  };
}

export default async function GameAssistantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameMeta(slug);
  if (!game) notFound();

  const viewer = await getViewerRank();
  const identity = getAssistantIdentity(slug, game.name);

  // Estado: candado por login, candado por rango, en espera, o chat real.
  const mode = !viewer
    ? "locked-login"
    : !canUseAssistant(viewer.rank)
    ? "locked-rank"
    : !ASSISTANT_CONFIGURED
    ? "waiting"
    : "chat";

  // Cupo restante de hoy + historial (solo si va a poder usarlo de verdad).
  const remaining = mode === "chat" ? await getRemainingToday() : null;
  const history = mode === "chat" ? await getUserHistory(slug) : [];

  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 pb-16">
      {/* migas de pan */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${game.slug}`} className="transition hover:text-accent">{game.name}</Link>
        <span>/</span>
        <span className="text-white/70">Asistente</span>
      </div>

      <HudLabel>{game.name}</HudLabel>
      <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
        {identity.name} · Asistente IA
      </h1>
      <p className="mt-2 mb-6 max-w-xl text-sm text-white/55">
        {identity.name} es {identity.tagline}. Sabe de TODAS las guías y secciones del juego y responde al instante.
      </p>

      <AssistantChat
        gameSlug={game.slug}
        gameName={game.name}
        assistantName={identity.name}
        mode={mode}
        exampleQuestions={getExampleQuestions(slug)}
        sample={getSampleExchange(slug, game.name)}
        dailyLimit={assistantDailyLimit(viewer?.rank ?? "veterano")}
        initialRemaining={remaining}
        initialHistory={history}
        discordInvite={process.env.NEXT_PUBLIC_DISCORD_INVITE}
      />
    </main>
  );
}
