// Placeholder para secciones del juego aún sin contenido cargado.
import Link from "next/link";
import { Panel } from "@/components/hud";

export function SectionPlaceholder({
  gameSlug,
  gameName,
  section,
  desc,
}: {
  gameSlug: string;
  gameName: string;
  section: string;
  desc: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <Link href="/juegos" className="transition hover:text-accent">Juegos</Link>
        <span>/</span>
        <Link href={`/juegos/${gameSlug}`} className="transition hover:text-accent">{gameName}</Link>
        <span>/</span>
        <span className="text-white/70">{section}</span>
      </div>

      <Panel corners>
        <div className="panel-inner flex flex-col items-center px-6 py-16 text-center">
          <span className="hud-label text-[10px] text-amber-400/70">Pendiente de cargar</span>
          <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-glow-brand">
            {section}
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/55">{desc}</p>
          <p className="mt-4 max-w-sm text-xs text-white/35">
            Esta sección se construirá scrapeando la información de las guías de
            origen, con el mismo diseño. Cuando esté el panel de administración,
            el equipo la mantendrá al día.
          </p>
          <Link href={`/juegos/${gameSlug}`} className="btn-hud mt-6 bg-brand px-5 py-2.5 text-white">
            <span className="hud-label text-[11px]">Volver al juego</span>
          </Link>
        </div>
      </Panel>
    </main>
  );
}
