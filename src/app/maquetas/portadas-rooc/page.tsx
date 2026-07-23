// Previsualización de las portadas propuestas para las cards del Hub de
// Ragnarok Origin Classic. Replica el marcado real de la card del Hub (imagen +
// overlay violeta + scanlines + icono hexagonal) para poder aprobarlas antes de
// aplicarlas. Vive en /maquetas y trae su propio fondo.
import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/hud";
import {
  BookIcon, CalendarIcon, UsersIcon, ShieldIcon, GemIcon, DragonIcon, PawIcon,
} from "@/components/icons";

export const metadata = { title: "Portadas propuestas · ROOC" };

const CARDS = [
  { slug: "guias", label: "Guías", icon: BookIcon,
    desc: "Primeros pasos, progresión, edificios, cuentas, mapas y temporadas.",
    fuente: "Arte oficial (Glast Heim), recortado para quitarle el texto" },
  { slug: "eventos", label: "Eventos", icon: CalendarIcon,
    desc: "Guías de los eventos del juego.",
    fuente: "Arte oficial del Tyr Cup Season 2, sin el texto" },
  { slug: "clases", label: "Clases", icon: UsersIcon,
    desc: "Las 14 clases finales de ROOC: rama, rol y habilidades clave de cada una.",
    fuente: "Arte oficial de personajes, sin el texto" },
  { slug: "clases-build", label: "Clases Build", icon: ShieldIcon,
    desc: "Build completa de cada una de las 14 clases: habilidades, cartas, mascota y tácticas.",
    fuente: "Arte oficial de combate en equipo, sin el texto" },
  { slug: "cartas", label: "Cartas", icon: GemIcon,
    desc: "Las 225 cartas de ROOC: efecto real de cada una y en qué pieza de equipo va.",
    fuente: "Compuesta con 24 cartas reales del juego, a tamaño original" },
  { slug: "monturas", label: "Monturas", icon: DragonIcon,
    desc: "Las 48 monturas de Ragnarok Origin Classic, agrupadas por rareza (Épica o Mítica).",
    fuente: "Compuesta con 15 monturas reales del juego, a tamaño original" },
  { slug: "mascotas", label: "Mascotas", icon: PawIcon,
    desc: "Las mascotas de ROOC: rol, raza y habilidad exclusiva de cada una.",
    fuente: "Compuesta con las 9 mascotas reales del juego, a tamaño original" },
];

export default function PortadasRooc() {
  return (
    <main className="relative min-h-screen bg-[#05060a] px-4 py-10">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50rem 30rem at 20% 0%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(40rem 30rem at 90% 10%, rgba(34,224,255,0.12), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded border border-amber-400/30 bg-amber-400/5 px-4 py-3">
          <p className="hud-label text-[10px] text-amber-300/90">PROPUESTA — TODAVÍA NO ESTÁ APLICADO</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">
            Así quedarían las 7 cards del Hub de Ragnarok Origin Classic. Todas distintas, todas con arte del propio
            juego y a resolución nativa (sin ampliar nada, que era lo que se veía borroso). Debajo de cada una te digo
            de dónde sale.
          </p>
        </div>

        <h1 className="mb-5 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
          Portadas propuestas
        </h1>

        <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.slug} className="flex flex-col">
                <Panel corners className="group sweep">
                  <div className="panel-inner flex h-full flex-col">
                    {/* Cabecera: mismo marcado que la card real del Hub */}
                    <div className="relative h-36 w-full overflow-hidden border-b border-white/8">
                      <Image
                        src={`/rooc/${c.slug}.jpg`}
                        alt={c.label}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute inset-0 bg-brand/25 mix-blend-color" />
                      <div className="scanlines absolute inset-0 opacity-20" />

                      <div className="absolute bottom-3 left-4 z-10">
                        <span className="hex grid h-10 w-10 place-items-center bg-black/60 ring-1 ring-accent/40 backdrop-blur-sm">
                          <Icon className="h-4 w-4 text-accent" />
                        </span>
                      </div>
                      <div className="absolute right-3 top-3 z-10">
                        <span className="hud-label rounded border border-emerald-400/30 bg-black/60 px-1.5 py-0.5 text-[9px] text-emerald-400/90 backdrop-blur-sm">
                          LISTO
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-title text-base font-bold leading-tight">{c.label}</h3>
                      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-white/50">{c.desc}</p>
                    </div>
                  </div>
                </Panel>
                <p className="mt-3 px-1 text-[11px] leading-snug text-accent/70">{c.fuente}</p>
              </div>
            );
          })}
        </div>

        <Link
          href="/juegos/ragnarok-origin-classic"
          className="mt-8 inline-block text-sm text-white/45 transition hover:text-white"
        >
          ← Ver cómo está ahora
        </Link>
      </div>
    </main>
  );
}
