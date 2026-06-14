// Sección Mi progreso — avance real del usuario por guía (desde Supabase).
// Si no hay sesión, se ve el aviso para entrar y los porcentajes en 0.
import Link from "next/link";
import { getGuidesForGame, getSessionUserId } from "@/lib/games";
import { Panel, HudLabel, XpBar } from "@/components/hud";
import { DiscordIcon, ChartIcon } from "@/components/icons";
import { LoginButton } from "@/components/auth/LoginButton";

const GAME_SLUG = "call-of-dragons";

export default async function MiProgresoPage() {
  const [userId, data] = await Promise.all([
    getSessionUserId(),
    getGuidesForGame(GAME_SLUG),
  ]);

  const guides = data?.guides ?? [];
  const gameName = data?.meta.name ?? "Call of Dragons";

  const totalSteps = guides.reduce((a, g) => a + g.stepCount, 0);
  const totalDone = guides.reduce((a, g) => a + g.completedCount, 0);
  const overall = totalSteps ? Math.round((totalDone / totalSteps) * 100) : 0;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-12">
      <HudLabel>Tu cuenta</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Mi progreso
      </h1>

      {/* Aviso: sin sesión todavía */}
      {!userId && (
        <Panel corners className="mt-6">
          <div className="panel-inner flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ChartIcon className="h-5 w-5 text-accent" />
              <p className="text-sm text-white/70">
                Inicia sesión para guardar tu avance de verdad.{" "}
                <span className="text-white/40">(Ahora ves 0% hasta que entres.)</span>
              </p>
            </div>
            <LoginButton className="btn-hud flex shrink-0 items-center gap-2 bg-brand px-4 py-2 text-white">
              <DiscordIcon className="h-4 w-4" />
              <span className="hud-label text-[11px]">Entrar</span>
            </LoginButton>
          </div>
        </Panel>
      )}

      {/* Resumen global */}
      <Panel className="mt-6">
        <div className="panel-inner p-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="hud-label text-[10px] text-white/45">{gameName}</span>
              <p className="mt-1 text-sm text-white/55">Avance total del juego</p>
            </div>
            <span className="font-title text-3xl font-extrabold text-accent text-glow-accent">{overall}%</span>
          </div>
          <XpBar value={overall} className="mt-4" />
        </div>
      </Panel>

      {/* Progreso por guía */}
      <div className="mb-5 mt-10 flex items-center gap-3">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">POR GUÍA</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-4">
        {guides.map((guide) => {
          const pct = guide.stepCount ? Math.round((guide.completedCount / guide.stepCount) * 100) : 0;
          return (
            <Link key={guide.slug} href={`/juegos/${GAME_SLUG}/guias/${guide.slug}`} className="block">
              <Panel className="sweep lift">
                <div className="panel-inner p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-title text-base font-bold">{guide.title}</h3>
                    <span className="hud-label shrink-0 text-[10px] text-accent/80">{pct}%</span>
                  </div>
                  <XpBar value={pct} className="mt-3" />
                  <p className="mt-2 text-xs text-white/40">
                    {guide.completedCount} de {guide.stepCount} pasos
                  </p>
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
