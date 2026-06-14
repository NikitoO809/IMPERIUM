// Maqueta 04 — Retro / Synthwave. Fondo: rejilla 3D que se inclina con el ratón.
import GridPerspectiveBg from "@/components/backgrounds/GridPerspectiveBg";
import { VariantNav } from "@/components/VariantNav";
import { DiscordIcon } from "@/components/icons";

const GAMES = ["Call of Dragons", "[EJEMPLO]", "[EJEMPLO]"];

export default function MaquetaRetro() {
  return (
    <main className="relative min-h-screen pb-28 text-white">
      <GridPerspectiveBg />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <span
          className="font-title text-base font-extrabold italic tracking-[0.2em]"
          style={{ textShadow: "0 0 16px rgba(255,94,156,0.8)" }}
        >
          IMPERIUM
        </span>
        <a
          href="#"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-xs font-bold text-black"
        >
          <DiscordIcon className="h-4 w-4" />
          ENTRAR
        </a>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-24 text-center sm:pt-28">
        <p
          className="rise font-title text-xs font-bold uppercase tracking-[0.4em] text-cyan-300"
          style={{ textShadow: "0 0 12px rgba(34,224,255,0.8)" }}
        >
          Comunidad de Discord
        </p>

        <h1
          className="rise mt-6 font-title text-6xl font-black italic leading-none tracking-tight sm:text-8xl"
          style={{
            animationDelay: "0.05s",
            background: "linear-gradient(180deg, #fff 0%, #ff8ad4 55%, #ff5e9c 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 28px rgba(255,94,156,0.6))",
          }}
        >
          IMPERIUM
        </h1>

        <p className="rise mx-auto mt-7 max-w-lg text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.12s" }}>
          Las guías de juego que <span className="font-bold text-cyan-300">sí avanzan contigo</span>.
          Progreso en vivo y comunidad conectada.
        </p>

        <div className="rise mt-10 flex justify-center" style={{ animationDelay: "0.2s" }}>
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 px-9 py-4 text-base font-extrabold uppercase tracking-wide text-black shadow-[0_0_50px_-8px_rgba(255,94,156,0.9)] transition hover:scale-[1.03]"
          >
            <DiscordIcon className="h-5 w-5" />
            Entrar con Discord
          </a>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-4xl px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <div
              key={i}
              className="rounded-xl border border-fuchsia-400/30 bg-black/40 p-6 backdrop-blur-sm transition hover:border-cyan-300/60"
              style={{ boxShadow: "inset 0 0 30px -10px rgba(255,94,156,0.4)" }}
            >
              <span className="font-title text-xs font-bold text-cyan-300">0{i + 1}</span>
              <h3 className="mt-2 font-title text-base font-bold italic">{g}</h3>
              <p className="mt-1 text-xs text-white/45">
                {i === 0 ? "6 guías disponibles" : "Próximamente"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <VariantNav current="retro" />
    </main>
  );
}
