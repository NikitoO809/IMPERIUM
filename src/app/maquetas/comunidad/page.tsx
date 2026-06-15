// Maqueta de comparación — varias versiones del bloque "Nuestra comunidad / Discord".
// Página de referencia visual: NO es parte de la app real. Elige una y la montamos en /.
// Todas SIN panel/caja detrás: el contenido va directo sobre el fondo.
import { HudLabel } from "@/components/hud";
import { DiscordIcon } from "@/components/icons";

// Datos de ejemplo (en la portada real vienen en vivo de Discord).
const MEMBERS = "1166";
const ONLINE = "180";
const SERVER = "Imperium Guild Community";

export default function MaquetaComunidad() {
  return (
    <main className="min-h-screen bg-[#05060c] py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-2 font-title text-2xl font-black tracking-wide text-white">
          Maquetas · Bloque de comunidad
        </h1>
        <p className="mb-12 text-sm text-white/50">
          Cuatro versiones, todas sin caja detrás. Dime cuál te gusta (A, B, C o
          D) y la dejo en la portada.
        </p>

        <Variant id="A" name="Monolito centrado — imponente y limpio">
          <VariantA />
        </Variant>

        <Variant id="B" name="El “20” como protagonista (split asimétrico)">
          <VariantB />
        </Variant>

        <Variant id="C" name="Banda ultra-minimalista (una sola línea)">
          <VariantC />
        </Variant>

        <Variant id="D" name="Sello / emblema con hexágono">
          <VariantD />
        </Variant>
      </div>
    </main>
  );
}

// Envoltorio con etiqueta de cada variante (solo para esta página de comparación).
function Variant({
  id,
  name,
  children,
}: {
  id: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center gap-3">
        <span className="hex grid h-8 w-8 place-items-center bg-brand/20 font-title text-sm font-black text-accent ring-1 ring-accent/30">
          {id}
        </span>
        <h2 className="font-hud text-sm font-semibold tracking-wide text-white/70">
          {name}
        </h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      {children}
    </section>
  );
}

// Botón reutilizable.
function DiscordBtn({ className = "" }: { className?: string }) {
  return (
    <a
      href="#"
      className={`btn-hud inline-flex items-center gap-2.5 bg-gradient-to-r from-brand to-brand-bright px-8 py-3.5 text-white ${className}`}
    >
      <DiscordIcon className="h-5 w-5" />
      <span className="font-hud font-bold tracking-[0.08em]">ÚNETE A DISCORD</span>
    </a>
  );
}

// ───────────────────────── Variante A ─────────────────────────
// Centrado, IMPERIUM enorme, métricas en línea separadas por filetes. Sin caja.
function VariantA() {
  return (
    <div className="flex flex-col items-center gap-9 py-10 text-center">
      <div className="flex flex-col items-center">
        <span className="inline-flex items-center gap-2 hud-label text-[11px] text-accent/80">
          <span className="h-px w-6 bg-accent/40" />
          EST. 2006 · 20 años jugando juntos
          <span className="h-px w-6 bg-accent/40" />
        </span>
        <h2 className="mt-5 font-title text-5xl font-black uppercase leading-[0.95] tracking-[0.04em] text-glow-brand sm:text-7xl">
          IMPERIUM
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
          Dos décadas de partidas, alianzas y victorias. Entra, preséntate y
          juega con nosotros.
        </p>
      </div>

      <div className="flex w-full max-w-2xl items-stretch justify-center divide-x divide-white/10">
        <StatInline value="20" label="Años juntos" />
        <StatInline value={MEMBERS} label="Miembros" />
        <StatInline value={ONLINE} label="Online ahora" live />
      </div>

      <DiscordBtn />
    </div>
  );
}

// ───────────────────────── Variante B ─────────────────────────
// El número 20 gigante a la izquierda; a la derecha nombre, texto y métricas. Sin caja.
function VariantB() {
  return (
    <div className="grid items-center gap-8 py-8 md:grid-cols-[auto_1fr]">
      {/* Bloque del 20 */}
      <div className="flex flex-col items-center justify-center border-white/10 pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-10">
        <span className="font-title text-7xl font-black leading-none text-glow-brand sm:text-8xl">
          20
        </span>
        <span className="mt-2 hud-label text-[11px] tracking-[0.2em] text-accent/80">
          AÑOS DE COMUNIDAD
        </span>
      </div>

      {/* Contenido */}
      <div>
        <HudLabel>Nuestra comunidad</HudLabel>
        <h2 className="mt-2 font-title text-3xl font-extrabold uppercase tracking-wide text-glow-brand sm:text-4xl">
          {SERVER}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
          Dos décadas organizando partidas, resolviendo dudas y decidiendo
          juntos a qué jugamos.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          <StatRow value={MEMBERS} label="Miembros" />
          <StatRow value={ONLINE} label="Online ahora" live />
          <DiscordBtn className="ml-auto px-6 py-3" />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Variante C ─────────────────────────
// Una sola línea, máxima limpieza. Sin caja, solo un filete arriba y abajo.
function VariantC() {
  return (
    <div className="flex flex-col items-center gap-6 border-y border-white/10 px-2 py-8 sm:flex-row sm:gap-10 sm:py-7">
      <div className="text-center sm:text-left">
        <h2 className="font-title text-xl font-extrabold uppercase tracking-[0.12em] text-glow-brand">
          IMPERIUM
        </h2>
        <span className="hud-label text-[10px] text-white/45">
          Comunidad desde hace 20 años
        </span>
      </div>

      <div className="flex items-center gap-8 sm:ml-2">
        <StatTiny value="20" label="Años" />
        <StatTiny value={MEMBERS} label="Miembros" />
        <StatTiny value={ONLINE} label="Online" live />
      </div>

      <DiscordBtn className="px-6 py-3 sm:ml-auto" />
    </div>
  );
}

// ───────────────────────── Variante D ─────────────────────────
// Sello: hexágono con "20 AÑOS"; nombre y métricas debajo. Sin caja.
function VariantD() {
  return (
    <div className="flex flex-col items-center gap-7 py-10 text-center">
      <div className="hex grid h-28 w-28 place-items-center bg-brand/15 ring-1 ring-accent/30">
        <div className="flex flex-col items-center">
          <span className="font-title text-4xl font-black leading-none text-glow-brand">
            20
          </span>
          <span className="hud-label mt-1 text-[9px] tracking-[0.25em] text-accent/80">
            AÑOS
          </span>
        </div>
      </div>

      <div>
        <h2 className="font-title text-3xl font-black uppercase tracking-[0.04em] text-glow-brand sm:text-5xl">
          IMPERIUM
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/55">
          Veinte años de comunidad. Guías, partidas y gente con quien jugar.
          Entra y forma parte.
        </p>
      </div>

      <div className="flex items-center gap-10">
        <StatTiny value={MEMBERS} label="Miembros" />
        <span className="h-8 w-px bg-white/10" />
        <StatTiny value={ONLINE} label="Online ahora" live />
      </div>

      <DiscordBtn />
    </div>
  );
}

// ───────────────────────── Piezas de métrica ─────────────────────────

// Para la variante A: columnas separadas por filetes.
function StatInline({ value, label, live = false }: StatProps) {
  return (
    <div className="flex flex-1 flex-col items-center px-4 sm:px-8">
      <div className="flex items-center gap-2">
        {live && <span className="live-dot h-2 w-2 rounded-full bg-accent" />}
        <span className="font-title text-4xl font-black tracking-wide text-glow-brand sm:text-5xl">
          {value}
        </span>
      </div>
      <span className="mt-2 block hud-label text-[10px] text-white/45">{label}</span>
    </div>
  );
}

// Para la variante B: número + etiqueta en fila horizontal compacta.
function StatRow({ value, label, live = false }: StatProps) {
  return (
    <div className="flex items-baseline gap-2">
      {live && <span className="live-dot mb-1 h-2 w-2 self-center rounded-full bg-accent" />}
      <span className="font-title text-2xl font-black text-glow-brand">{value}</span>
      <span className="hud-label text-[10px] text-white/45">{label}</span>
    </div>
  );
}

// Para variantes C y D: compacto y centrado.
function StatTiny({ value, label, live = false }: StatProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5">
        {live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />}
        <span className="font-title text-2xl font-black text-glow-brand sm:text-3xl">
          {value}
        </span>
      </div>
      <span className="hud-label mt-1 text-[9px] text-white/45">{label}</span>
    </div>
  );
}

type StatProps = { value: string; label: string; live?: boolean };
