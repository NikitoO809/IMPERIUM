// Maqueta 03 — Imperial épico. Fondo: aurora cálida que persigue al cursor.
// Oro + tipografía serif con carácter (Cinzel). Tono de imperio/fantasía.
import { Cinzel } from "next/font/google";
import AuroraBg from "@/components/backgrounds/AuroraBg";
import { VariantNav } from "@/components/VariantNav";
import { DiscordIcon } from "@/components/icons";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "700", "900"] });

const GAMES = [
  { name: "Call of Dragons", sub: "6 guías disponibles", locked: false },
  { name: "[EJEMPLO]", sub: "Próximamente", locked: true },
  { name: "[EJEMPLO]", sub: "Próximamente", locked: true },
];

export default function MaquetaImperial() {
  return (
    <main className="relative min-h-screen pb-28 text-amber-50">
      <AuroraBg />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <span className={`${cinzel.className} text-lg font-bold tracking-[0.25em] text-amber-200`}>
          IMPERIUM
        </span>
        <a
          href="#"
          className="flex items-center gap-2 rounded-sm border border-amber-400/40 bg-amber-400/5 px-4 py-2 text-xs font-medium tracking-wide text-amber-200 transition hover:bg-amber-400/15"
        >
          <DiscordIcon className="h-4 w-4" />
          Entrar
        </a>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-24 text-center sm:pt-32">
        <div className="rise mx-auto flex items-center justify-center gap-3 text-amber-300/70">
          <span className="h-px w-10 bg-amber-300/40" />
          <span className="text-xs uppercase tracking-[0.35em]">La comunidad</span>
          <span className="h-px w-10 bg-amber-300/40" />
        </div>

        <h1
          className={`${cinzel.className} rise mt-8 text-5xl font-black leading-tight tracking-wide sm:text-7xl`}
          style={{ animationDelay: "0.05s", textShadow: "0 0 40px rgba(255,180,60,0.35)" }}
        >
          <span className="bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-transparent">
            IMPERIUM
          </span>
        </h1>

        <p className={`${cinzel.className} rise mt-6 text-lg tracking-wide text-amber-100/90 sm:text-2xl`} style={{ animationDelay: "0.1s" }}>
          Las guías que forjan tu avance
        </p>
        <p className="rise mx-auto mt-6 max-w-md text-sm leading-relaxed text-amber-100/55 sm:text-base" style={{ animationDelay: "0.16s" }}>
          Guías interactivas con su fuente verificada, tu progreso a salvo y la
          comunidad avanzando contigo. Empezamos por Call of Dragons.
        </p>

        <div className="rise mt-10" style={{ animationDelay: "0.22s" }}>
          <a
            href="#"
            className="group inline-flex items-center gap-3 rounded-sm bg-gradient-to-b from-amber-300 to-amber-500 px-8 py-4 font-semibold tracking-wide text-amber-950 shadow-[0_10px_40px_-10px_rgba(255,180,60,0.7)] transition hover:from-amber-200 hover:to-amber-400"
          >
            <DiscordIcon className="h-5 w-5" />
            Unirse al imperio
            <span className="transition group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-4xl px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {GAMES.map((g, i) => (
            <div
              key={i}
              className={`rounded-sm border border-amber-400/20 bg-gradient-to-b from-amber-950/40 to-black/40 p-6 backdrop-blur-sm transition hover:border-amber-400/50 ${g.locked ? "opacity-60" : ""}`}
            >
              <div className="flex justify-center">
                <span className="text-2xl">{g.locked ? "🔒" : "🐉"}</span>
              </div>
              <h3 className={`${cinzel.className} mt-3 text-center text-base font-bold tracking-wide text-amber-100`}>
                {g.name}
              </h3>
              <p className="mt-1 text-center text-xs text-amber-100/45">{g.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <VariantNav current="imperial" />
    </main>
  );
}
