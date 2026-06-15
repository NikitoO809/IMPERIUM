// Sección Nosotros — qué es IMPERIUM, su historia y quiénes administran la web.
// Contenido estático editable. Los textos marcados [EJEMPLO — reemplazar] son
// plantilla: cámbialos por la historia y los administradores reales.
import Link from "next/link";
import { Panel, HudLabel } from "@/components/hud";
import { DiscordIcon, ShieldIcon, BookIcon, UsersIcon } from "@/components/icons";

export const metadata = {
  title: "Nosotros — IMPERIUM",
  description: "Quiénes somos, nuestra historia y el equipo que administra IMPERIUM.",
};

// ── Historia: hitos de la comunidad (orden cronológico) ──────────
// [EJEMPLO — reemplazar] por los hitos reales de IMPERIUM.
const TIMELINE: { year: string; title: string; text: string }[] = [
  {
    year: "2023",
    title: "[EJEMPLO] Nace la comunidad",
    text: "Un grupo de jugadores se reúne en Discord para coordinar partidas y compartir estrategias. [EJEMPLO — reemplazar]",
  },
  {
    year: "2024",
    title: "[EJEMPLO] Crecemos juntos",
    text: "La comunidad se organiza, suma miembros y empieza a dominar sus primeros juegos en equipo. [EJEMPLO — reemplazar]",
  },
  {
    year: "2025",
    title: "[EJEMPLO] Llega la web IMPERIUM",
    text: "Creamos esta web con guías interactivas para que cualquier miembro mejore más rápido. [EJEMPLO — reemplazar]",
  },
];

// ── Administradores del sitio ────────────────────────────────────
// [EJEMPLO — reemplazar] por las personas reales del equipo.
// avatar: URL de imagen (Discord, etc.) o null para mostrar la inicial.
const ADMINS: { name: string; role: string; bio: string; avatar: string | null }[] = [
  {
    name: "[EJEMPLO] Nombre 1",
    role: "Fundador / Líder",
    bio: "Lidera la comunidad y dirige la estrategia general. [EJEMPLO — reemplazar]",
    avatar: null,
  },
  {
    name: "[EJEMPLO] Nombre 2",
    role: "Administrador",
    bio: "Gestiona el Discord y modera el día a día de la comunidad. [EJEMPLO — reemplazar]",
    avatar: null,
  },
  {
    name: "[EJEMPLO] Nombre 3",
    role: "Editor de guías",
    bio: "Investiga y monta las guías de juego en la web. [EJEMPLO — reemplazar]",
    avatar: null,
  },
];

export default function NosotrosPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <HudLabel>La comunidad</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Sobre IMPERIUM
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
        IMPERIUM es una comunidad de jugadores de Discord. Aquí coordinamos
        partidas, compartimos estrategias y montamos guías interactivas para que
        todo el equipo mejore más rápido. <span className="text-white/40">[EJEMPLO — reemplazar por la descripción real de la comunidad]</span>
      </p>

      {/* ── Nuestra historia ─────────────────────────────────── */}
      <div className="mb-6 mt-12 flex items-center gap-3">
        <BookIcon className="h-5 w-5 text-accent" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">NUESTRA HISTORIA</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <ol className="relative ml-3 border-l border-white/12 pl-6">
        {TIMELINE.map((item) => (
          <li key={item.year} className="relative mb-7 last:mb-0">
            {/* Punto en la línea */}
            <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border border-accent/60 bg-zinc-950">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="hud-label text-[11px] text-accent/80">{item.year}</span>
            <h3 className="mt-1 font-title text-base font-bold">{item.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/60">{item.text}</p>
          </li>
        ))}
      </ol>

      {/* ── Quiénes administran ──────────────────────────────── */}
      <div className="mb-6 mt-14 flex items-center gap-3">
        <UsersIcon className="h-5 w-5 text-accent" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">QUIÉNES ADMINISTRAN</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ADMINS.map((admin) => (
          <Panel key={admin.name} className="lift" innerClassName="p-5">
            <div className="flex items-center gap-4">
              {/* Avatar o inicial */}
              {admin.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-accent/30"
                />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-accent/30 bg-black/40 font-title text-xl font-bold text-accent/80">
                  {admin.name.replace(/^\[EJEMPLO\]\s*/, "").charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <h3 className="truncate font-title text-base font-bold">{admin.name}</h3>
                <span className="hud-label flex items-center gap-1.5 text-[10px] text-accent/80">
                  <ShieldIcon className="h-3 w-3" />
                  {admin.role}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{admin.bio}</p>
          </Panel>
        ))}
      </div>

      {/* ── CTA Discord ──────────────────────────────────────── */}
      <Panel corners className="mt-12" innerClassName="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-title text-lg font-bold">¿Quieres unirte a IMPERIUM?</h3>
          <p className="mt-1 text-sm text-white/60">Entra a nuestro Discord y forma parte de la comunidad.</p>
        </div>
        <Link
          href="/comunidad"
          className="btn-hud flex shrink-0 items-center gap-2 bg-brand px-5 py-2.5 text-white"
        >
          <DiscordIcon className="h-4 w-4" />
          <span className="hud-label text-[11px]">Ver la comunidad</span>
        </Link>
      </Panel>
    </main>
  );
}
