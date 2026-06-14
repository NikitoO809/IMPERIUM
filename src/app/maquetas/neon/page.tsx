// Maqueta 01 — Neón HUD. Fondo: foco de luz que sigue al cursor.
import SpotlightBg from "@/components/backgrounds/SpotlightBg";
import { VariantNav } from "@/components/VariantNav";
import { Panel, HudLabel, XpBar } from "@/components/hud";
import { DiscordIcon, ShieldIcon } from "@/components/icons";

const GAMES = [
  { name: "Call of Dragons", tag: "ESTRATEGIA", rank: "S", pct: 0 },
  { name: "[EJEMPLO]", tag: "PRÓXIMAMENTE", rank: "—", pct: 0 },
  { name: "[EJEMPLO]", tag: "PRÓXIMAMENTE", rank: "—", pct: 0 },
];

export default function MaquetaNeon() {
  return (
    <main className="relative min-h-screen pb-28">
      <SpotlightBg />

      <header className="px-4 pt-4">
        <div className="mx-auto max-w-5xl">
          <Panel>
            <div className="panel-inner flex items-center justify-between px-4 py-2.5">
              <span className="flex items-center gap-2.5">
                <span className="hex grid h-8 w-8 place-items-center bg-gradient-to-br from-brand to-accent">
                  <ShieldIcon className="h-4 w-4 text-black" />
                </span>
                <span className="font-title text-base font-extrabold tracking-[0.15em] text-glow-accent">
                  IMPERIUM
                </span>
              </span>
              <a href="#" className="btn-hud flex items-center gap-2 bg-brand px-4 py-2 text-white">
                <DiscordIcon className="h-4 w-4" />
                <span className="hud-label text-[11px]">Entrar</span>
              </a>
            </div>
          </Panel>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-20 text-center sm:pt-28">
        <div className="rise flex justify-center">
          <HudLabel>Comunidad de Discord · ES</HudLabel>
        </div>
        <h1 className="rise mt-7 font-title text-6xl font-black tracking-[0.06em] text-glow-brand sm:text-8xl" style={{ animationDelay: "0.05s" }}>
          IMPERIUM
        </h1>
        <p className="rise mx-auto mt-6 max-w-xl font-title text-lg font-semibold text-white/90 sm:text-2xl" style={{ animationDelay: "0.1s" }}>
          Las guías de juego <span className="text-gradient">que sí avanzan contigo</span>
        </p>
        <p className="rise mx-auto mt-5 max-w-lg text-sm text-white/55 sm:text-base" style={{ animationDelay: "0.16s" }}>
          Guías interactivas, tu progreso guardado y la comunidad jugando a tu lado en tiempo real.
        </p>
        <div className="rise mt-10 flex flex-col items-center gap-3" style={{ animationDelay: "0.22s" }}>
          <a href="#" className="btn-hud group flex items-center gap-3 bg-gradient-to-r from-brand to-brand-bright px-8 py-4 text-white">
            <DiscordIcon className="h-5 w-5" />
            <span className="font-hud text-base font-bold tracking-[0.1em]">ENTRAR CON DISCORD</span>
            <span className="text-accent transition group-hover:translate-x-1">▸</span>
          </a>
          <span className="blink hud-label text-[10px] text-white/35">Pulsa para empezar</span>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
          <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">SELECCIONA TU JUEGO</h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <Panel key={i} corners={i === 0} className={`sweep lift ${i > 0 ? "opacity-55" : ""}`}>
              <div className="panel-inner p-5">
                <div className="flex items-start justify-between">
                  <span className="hud-label text-[10px] text-accent/70">{g.tag}</span>
                  <span className={`hex grid h-9 w-9 place-items-center font-title text-sm font-extrabold ${i === 0 ? "bg-gradient-to-br from-rank to-amber-600 text-black" : "bg-white/10 text-white/40"}`}>
                    {g.rank}
                  </span>
                </div>
                <h3 className="mt-4 font-title text-lg font-bold">{g.name}</h3>
                <XpBar value={g.pct} className="mt-4" />
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <VariantNav current="neon" />
    </main>
  );
}
