// Sección Comunidad — MURO DE LOGROS de los juegos que jugamos. Hazañas con
// imágenes y vídeos, gestionadas desde el panel (/admin/comunidad).
// (Los "Mejores jugadores" viven ahora en su propia sección: /fama.)
import { getCommunityAchievements } from "@/lib/community";
import { HudLabel } from "@/components/hud";
import { CommunityAchievements } from "@/components/CommunityAchievements";

export default async function ComunidadPage() {
  const achievements = await getCommunityAchievements();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-12 pb-12">
      <HudLabel>Comunidad</HudLabel>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
          Logros
        </h1>
        <span className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 ring-1 ring-accent/30 bevel">
          <span className="hud-label text-[10px] text-accent">IMPERIUM</span>
        </span>
      </div>
      <p className="mt-3 max-w-xl text-sm text-white/55">
        Las mejores hazañas de la comunidad en los juegos que jugamos: capturas, vídeos y
        momentazos. Lo más reciente, arriba.
      </p>

      <div className="mt-8">
        {achievements.length > 0 ? (
          <CommunityAchievements achievements={achievements} />
        ) : (
          <p className="text-sm text-white/40">
            Todavía no hay logros publicados. Vuelve pronto.
          </p>
        )}
      </div>
    </main>
  );
}
