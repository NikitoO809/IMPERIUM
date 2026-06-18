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
  { id: "1", orderIndex: 1, tier: 1, name: "Nombre 1", role: "Fundador / Líder", bio: "Lidera la comunidad y dirige la estrategia general.", avatarUrl: null },
  { id: "2", orderIndex: 2, tier: 2, name: "Nombre 2", role: "Administrador", bio: "Gestiona el Discord y modera el día a día de la comunidad.", avatarUrl: null },
  { id: "3", orderIndex: 3, tier: 2, name: "Nombre 3", role: "Editor de guías", bio: "Investiga y monta las guías de juego en la web.", avatarUrl: null },
];

// ── Organigrama del equipo (árbol genealógico por niveles) ───────────
// Avatar redondo (foto o inicial). `big` para el líder.
function TeamAvatar({ member, big = false }: { member: AdminMember; big?: boolean }) {
  const size = big ? "h-20 w-20" : "h-14 w-14";
  if (member.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.avatarUrl}
        alt={member.name}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ${big ? "ring-accent/60" : "ring-accent/30"}`}
      />
    );
  }
  return (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-full border bg-black/40 font-title font-bold ${
        big ? "border-accent/60 text-2xl text-accent" : "border-accent/30 text-lg text-accent/80"
      }`}
    >
      {member.name.charAt(0)}
    </span>
  );
}

// Conector vertical entre niveles del organigrama, con un nodo.
function Connector() {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden>
      <span className="h-7 w-px bg-gradient-to-b from-accent/15 to-accent/55" />
      <span className="h-1.5 w-1.5 rounded-full bg-accent/70 shadow-[0_0_8px_rgba(227,179,65,0.6)]" />
    </div>
  );
}

function LeaderCard({ member }: { member: AdminMember }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Corona */}
      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 text-2xl drop-shadow-[0_0_8px_rgba(227,179,65,0.8)]">
        👑
      </div>
      <Panel corners className="lift" innerClassName="p-5 pt-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <TeamAvatar member={member} big />
          <div>
            <h3 className="font-title text-xl font-extrabold text-glow-brand">{member.name}</h3>
            <span className="hud-label mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-accent/80">
              <ShieldIcon className="h-3 w-3" />
              {member.role}
            </span>
          </div>
        </div>
        {member.bio && <p className="mt-3 text-sm leading-relaxed text-white/60">{member.bio}</p>}
      </Panel>
    </div>
  );
}

function MemberCard({ member }: { member: AdminMember }) {
  return (
    <Panel className="lift w-44" innerClassName="p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <TeamAvatar member={member} />
        <div className="min-w-0">
          <h4 className="truncate font-title text-sm font-bold">{member.name}</h4>
          <span className="hud-label text-[9px] text-accent/70">{member.role}</span>
        </div>
      </div>
      {member.bio && <p className="mt-2 text-center text-xs leading-relaxed text-white/50">{member.bio}</p>}
    </Panel>
  );
}

function TeamOrgChart({ members }: { members: AdminMember[] }) {
  // Agrupa por nivel (tier) y los ordena de menor (líder) a mayor.
  const tiers = new Map<number, AdminMember[]>();
  for (const m of members) {
    const t = m.tier ?? 1;
    if (!tiers.has(t)) tiers.set(t, []);
    tiers.get(t)!.push(m);
  }
  const levels = [...tiers.keys()].sort((a, b) => a - b);

  return (
    <div className="flex flex-col items-center">
      {levels.map((lvl, i) => (
        <div key={lvl} className="flex w-full flex-col items-center">
          {i > 0 && <Connector />}
          <div className="flex w-full flex-wrap items-stretch justify-center gap-4">
            {tiers.get(lvl)!.map((m) =>
              i === 0 ? <LeaderCard key={m.id} member={m} /> : <MemberCard key={m.id} member={m} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function NosotrosPage() {
  const about = await getAboutContent();
  const intro = about?.intro?.trim() ? about.intro : FALLBACK_INTRO;
  const timeline = about && about.timeline.length > 0 ? about.timeline : FALLBACK_TIMELINE;
  const admins = about && about.admins.length > 0 ? about.admins : FALLBACK_ADMINS;
  const games = about?.games ?? [];
  const quote = about?.quote?.trim() ?? "";
  const introParas = intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const quoteLines = quote.split("\n").map((l) => l.trim()).filter(Boolean);
  const quoteClose = quoteLines.length > 1 ? quoteLines.pop()! : null;

  return (
    <main className="mx-auto max-w-4xl px-4 pt-12 pb-16">
      <HudLabel>La comunidad</HudLabel>
      <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Sobre IMPERIUM
      </h1>
      <div className="mt-4 max-w-2xl space-y-3">
        {introParas.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-white/65 sm:text-base">
            {para}
          </p>
        ))}
      </div>

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

      {/* ── Nuestro recorrido (juegos) ───────────────────────── */}
      {games.length > 0 && (
        <>
          <div className="mb-6 mt-14 flex items-center gap-3">
            <ShieldIcon className="h-5 w-5 text-accent" />
            <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">NUESTRO RECORRIDO</h2>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
          </div>
          <p className="mb-5 max-w-2xl text-sm text-white/50">
            Juegos por los que ha pasado IMPERIUM a lo largo de casi dos décadas, conquistando
            algunos desde sus primeros días y alcanzando la cima en otros.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {games.map((g) => (
              <span
                key={g}
                className="bevel border border-accent/20 bg-accent/[0.06] px-3.5 py-1.5 font-hud text-xs text-white/75 transition-colors hover:border-accent/50 hover:text-white"
              >
                {g}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── Quiénes administran ──────────────────────────────── */}
      <div className="mb-6 mt-14 flex items-center gap-3">
        <UsersIcon className="h-5 w-5 text-accent" />
        <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">QUIÉNES ADMINISTRAN</h2>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
      </div>

      <TeamOrgChart members={admins} />

      {/* ── Cita de cierre ───────────────────────────────────── */}
      {quoteLines.length > 0 && (
        <figure className="mt-16 border-t border-white/8 pt-12 text-center">
          <blockquote className="mx-auto max-w-2xl">
            {quoteLines.map((line, i) => (
              <p key={i} className="font-title text-lg font-semibold leading-relaxed text-white/55 sm:text-xl">
                {line}
              </p>
            ))}
            {quoteClose && (
              <p className="mt-2 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
                {quoteClose}
              </p>
            )}
          </blockquote>
        </figure>
      )}

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
