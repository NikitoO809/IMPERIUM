// Sección Nosotros — qué es IMPERIUM, su historia y quiénes administran la web.
// El contenido se edita desde el panel de admin (/admin/nosotros) y se guarda en
// Supabase. Si Supabase no está configurado o no hay datos, se usan los textos de
// ejemplo (FALLBACK_*) para que la página nunca quede vacía.
import Link from "next/link";
import { Panel, HudLabel } from "@/components/hud";
import { DiscordIcon, ShieldIcon, BookIcon, UsersIcon } from "@/components/icons";
import { getAboutContent, type TimelineItem, type AdminMember } from "@/lib/about";

export const metadata = {
  title: "Nosotros — IMPERIUM",
  description: "Quiénes somos, nuestra historia y el equipo que administra IMPERIUM.",
};

// ── Fallbacks (se usan solo si no hay contenido en la base de datos) ──
const FALLBACK_INTRO =
  "IMPERIUM es una comunidad de jugadores de Discord. Aquí coordinamos partidas, compartimos estrategias y montamos guías interactivas para que todo el equipo mejore más rápido.";

const FALLBACK_TIMELINE: TimelineItem[] = [
  { id: "1", orderIndex: 1, year: "2023", title: "Nace la comunidad", description: "Un grupo de jugadores se reúne en Discord para coordinar partidas y compartir estrategias." },
  { id: "2", orderIndex: 2, year: "2024", title: "Crecemos juntos", description: "La comunidad se organiza, suma miembros y empieza a dominar sus primeros juegos en equipo." },
  { id: "3", orderIndex: 3, year: "2025", title: "Llega la web IMPERIUM", description: "Creamos esta web con guías interactivas para que cualquier miembro mejore más rápido." },
];

const FALLBACK_ADMINS: AdminMember[] = [
  { id: "1", orderIndex: 1, name: "Nombre 1", role: "Fundador / Líder", bio: "Lidera la comunidad y dirige la estrategia general.", avatarUrl: null },
  { id: "2", orderIndex: 2, name: "Nombre 2", role: "Administrador", bio: "Gestiona el Discord y modera el día a día de la comunidad.", avatarUrl: null },
  { id: "3", orderIndex: 3, name: "Nombre 3", role: "Editor de guías", bio: "Investiga y monta las guías de juego en la web.", avatarUrl: null },
];

export default async function NosotrosPage() {
  const about = await getAboutContent();
  const intro = about?.intro?.trim() ? about.intro : FALLBACK_INTRO;
  const timeline = about && about.timeline.length > 0 ? about.timeline : FALLBACK_TIMELINE;
  const admins = about && about.admins.length > 0 ? about.admins : FALLBACK_ADMINS;

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <HudLabel>La comunidad</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Sobre IMPERIUM
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
        {intro}
      </p>

      {/* ── Nuestra historia ─────────────────────────────────── */}
      <div className="mb-6 mt-12 flex items-center gap-3">
        <BookIcon className="h-5 w-5 text-accent" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">NUESTRA HISTORIA</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <ol className="relative ml-3 border-l border-white/12 pl-6">
        {timeline.map((item) => (
          <li key={item.id} className="relative mb-7 last:mb-0">
            {/* Punto en la línea */}
            <span className="absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full border border-accent/60 bg-zinc-950">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="hud-label text-[11px] text-accent/80">{item.year}</span>
            <h3 className="mt-1 font-title text-base font-bold">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm leading-relaxed text-white/60">{item.description}</p>
            )}
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
        {admins.map((admin) => (
          <Panel key={admin.id} className="lift" innerClassName="p-5">
            <div className="flex items-center gap-4">
              {/* Avatar o inicial */}
              {admin.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={admin.avatarUrl}
                  alt={admin.name}
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-accent/30"
                />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-accent/30 bg-black/40 font-title text-xl font-bold text-accent/80">
                  {admin.name.charAt(0)}
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
            {admin.bio && <p className="mt-3 text-sm leading-relaxed text-white/60">{admin.bio}</p>}
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
