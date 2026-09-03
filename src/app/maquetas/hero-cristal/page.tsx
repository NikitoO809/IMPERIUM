// Maqueta — Hero "cristal": traducción a la identidad de IMPERIUM (oro + fondo
// oscuro) del hero que Miguel señaló como referencia (maqueta MCVSoft):
// insignia arriba, título grande centrado, borde de vidrio acanalado a la
// izquierda, marco de esquinas y dos tarjetas de cristal flotando en las
// esquinas inferiores (una cifra, una tarjeta-enlace). Solo vista previa:
// no toca ninguna página real todavía.
import Link from "next/link";
import { ShieldIcon } from "@/components/icons";

export default function MaquetaHeroCristal() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0b] pb-28 text-amber-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 pt-6 sm:px-6">
        <Link href="/maquetas" className="text-sm text-amber-100/50 transition hover:text-amber-100">
          ← Volver a maquetas
        </Link>
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
          Maqueta — vista previa
        </span>
      </div>

      {/* ───── Hero ───── */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <div className="relative isolate flex min-h-[clamp(520px,72vh,680px)] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-amber-400/15 bg-black/20 px-6 py-24 text-center backdrop-blur-[2px]">
          {/* borde de vidrio acanalado, a la izquierda */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[56px] sm:w-[100px]"
            aria-hidden
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              background:
                "repeating-linear-gradient(to right, rgba(255,207,90,.16) 0 3px, rgba(255,207,90,.02) 3px 7px, rgba(120,80,20,.14) 7px 11px)",
              borderRight: "1px solid rgba(255,207,90,.18)",
            }}
          />

          {/* marco con esquinas (mismo lenguaje que el banner de AION 2) */}
          <div className="pointer-events-none absolute inset-4" aria-hidden>
            <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-amber-400/80" />
            <span className="absolute -right-px -top-px h-6 w-6 border-r-2 border-t-2 border-amber-400/80" />
            <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-amber-400/80" />
            <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-amber-400/80" />
          </div>

          {/* contenido centrado */}
          <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-md">
            <ShieldIcon className="h-3.5 w-3.5" />
            Comunidad de Discord
          </span>

          <h1
            className="relative z-10 mt-6 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl"
            style={{
              fontFamily: "var(--font-sans-imperium), system-ui, sans-serif",
              backgroundImage: "linear-gradient(180deg,#fff 0%,#f6e3b4 48%,#e3b341 110%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 8px 44px rgba(227,179,65,.35))",
            }}
          >
            Nosotros
          </h1>

          <p className="relative z-10 mx-auto mt-5 max-w-lg text-base leading-relaxed text-amber-100/75 sm:text-lg">
            Una comunidad de jugadores de Discord. Coordinamos partidas, compartimos
            estrategias y montamos guías para que todo el equipo mejore más rápido.
          </p>

          {/* tarjeta flotante: cifra (misma que ya usamos en la portada) */}
          <div className="absolute bottom-4 left-4 z-10 rounded-2xl border border-amber-400/20 bg-black/45 px-5 py-3.5 backdrop-blur-md sm:bottom-6 sm:left-6 sm:px-6 sm:py-4">
            <b className="block text-3xl font-extrabold leading-none text-amber-50 sm:text-4xl">20</b>
            <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/60">
              Años de comunidad
            </span>
          </div>

          {/* tarjeta flotante: enlace (icono que gira al pasar el ratón) */}
          <a
            href="#equipo"
            className="group absolute bottom-0 right-0 z-10 hidden items-center gap-4 rounded-tl-3xl border-l border-t border-amber-400/20 bg-black/55 px-6 py-5 backdrop-blur-md transition hover:bg-black/70 sm:flex"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-400/10 text-lg text-amber-200 transition group-hover:rotate-45 group-hover:bg-amber-400 group-hover:text-amber-950">
              →
            </span>
            <span className="text-left">
              <span className="block text-base font-bold text-amber-50">Conoce al equipo</span>
              <span className="mt-0.5 block text-sm text-amber-200/55">Quiénes llevan IMPERIUM</span>
            </span>
          </a>
        </div>
      </section>

      {/* ───── Qué es esto (explicación para Miguel, no forma parte del diseño) ───── */}
      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-amber-400/15 bg-black/30 p-6 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-amber-300">Qué cambia respecto al ejemplo</h2>
          <ul className="mt-4 grid gap-2.5 text-sm leading-relaxed text-amber-100/70 sm:grid-cols-2">
            <li>· Insignia + título grande + subtítulo centrados — igual que ahora, con nuestra tipografía y el oro imperial.</li>
            <li>· Borde de vidrio acanalado a la izquierda — nuevo, traducido a la paleta oscura.</li>
            <li>· Tarjeta flotante con una cifra real (20 años) — nuevo, misma cifra que ya se muestra en la portada.</li>
            <li>· Tarjeta-enlace con icono giratorio — nuevo, apunta al equipo de administradores.</li>
            <li>· Marco de esquinas doradas — ya lo usamos en el banner de AION 2, no es nuevo.</li>
            <li>· Sin foto de fondo ni vidrio azul del ejemplo — usamos el fondo de aurora dorada que ya sigue al cursor.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
