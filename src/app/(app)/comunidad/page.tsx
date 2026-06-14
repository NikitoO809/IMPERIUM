// Sección Comunidad — roster del juego EN VIVO (Supabase Realtime).
// Lista a los miembros del juego y su avance, respetando la privacidad
// de cada uno (progress_visible). La parte dinámica vive en RosterLive.
import { getRoster } from "@/lib/games";
import { HudLabel } from "@/components/hud";
import { RosterLive } from "@/components/RosterLive";

const GAME_SLUG = "call-of-dragons";

export default async function ComunidadPage() {
  const roster = await getRoster(GAME_SLUG);
  const gameName = roster?.gameName ?? "Call of Dragons";

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-12">
      <HudLabel>Roster · {gameName}</HudLabel>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
          Comunidad
        </h1>
        <span className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 ring-1 ring-accent/30 bevel">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="hud-label text-[10px] text-accent">En vivo</span>
        </span>
      </div>
      <p className="mt-3 max-w-xl text-sm text-white/55">
        Jugadores del mismo juego y su avance. Cada quien decide si comparte su progreso.
      </p>

      {roster ? (
        <RosterLive initial={roster} />
      ) : (
        <p className="mt-8 text-sm text-white/40">
          El roster no está disponible ahora mismo. Inténtalo de nuevo en un momento.
        </p>
      )}
    </main>
  );
}
