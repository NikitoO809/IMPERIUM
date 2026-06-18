// Maqueta 02 — Constelación. Fondo: red de partículas que reacciona al ratón.
// Estética minimalista y técnica: mucho espacio negro, líneas finas, cian.
import ParticleNetworkBg from "@/components/backgrounds/ParticleNetworkBg";
import { VariantNav } from "@/components/VariantNav";
import { DiscordIcon } from "@/components/icons";

const GAMES = ["Call of Dragons", "[EJEMPLO]", "[EJEMPLO]"];

export default function MaquetaConstelacion() {
  return (
    <main className="relative min-h-screen pb-28 text-white">
      <ParticleNetworkBg color="120,220,255" />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <span className="text-sm font-semibold tracking-[0.35em] text-white/90">IMPERIUM</span>
        <a
          href="#"
          className="flex items-center gap-2 border border-cyan-300/40 px-4 py-2 text-xs font-medium tracking-wide text-cyan-200 transition hover:bg-cyan-300/10"
        >
          <DiscordIcon className="h-4 w-4" />
          Iniciar sesión
        </a>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-28 sm:pt-36">
        <div className="rise max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-cyan-300/70">
            {"// COMUNIDAD DE DISCORD"}
          </p>
          <h1 className="mt-6 text-5xl font-light leading-[1.05] tracking-tight sm:text-7xl">
            Guías que
            <br />
            <span className="font-semibold text-cyan-200">avanzan contigo</span>
          </h1>
          <p className="mt-7 max-w-md text-base font-light leading-relaxed text-white/55">
            Progreso guardado al instante, fuentes verificadas y toda la
            comunidad conectada en tiempo real. Empezamos por Call of Dragons.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href="#"
              className="flex items-center gap-2.5 bg-cyan-300 px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-200"
            >
              <DiscordIcon className="h-4 w-4" />
              Entrar con Discord
            </a>
            <span className="font-mono text-xs tracking-widest text-white/40">
              01 JUEGO · 06 GUÍAS
            </span>
          </div>
        </div>

        <div className="mt-24 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <div key={i} className="group bg-[#05070c] p-7 transition hover:bg-[#080b12]">
              <span className="font-mono text-xs text-white/35">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-medium">{g}</h3>
              <p className="mt-1 text-xs text-white/40">
                {i === 0 ? "6 guías disponibles" : "Próximamente"}
              </p>
              <span className="mt-6 block h-px w-0 bg-cyan-300 transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </section>

      <VariantNav current="constelacion" />
    </main>
  );
}
