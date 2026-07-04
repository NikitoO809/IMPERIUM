// SALÓN DE LOS TITANES — el club VIP/whales de la alianza, con estilo HUD del
// sitio (panel biselado, oro imperial, fuente Orbitron). Fondo ESTÁTICO (sin
// canvas interactivo). Un "trono" grande para el #1 y bloques por tier
// (Diamante · Rubí · Oro) con avatares HEXAGONALES enmarcados en su color.
// Componente de servidor (sin JS de cliente).
import type { CSSProperties } from "react";
import type { Titan, TitanTier } from "@/lib/titanes";

const TIER_META: Record<TitanTier, { label: string; accent: string }> = {
  diamante: { label: "Diamante", accent: "#8fe3f2" },
  rubi: { label: "Rubí", accent: "#e86a9c" },
  oro: { label: "Oro", accent: "#e3b341" },
};
const TIER_ORDER: TitanTier[] = ["diamante", "rubi", "oro"];

function formatPower(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function initials(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

// Avatar HEXAGONAL: marco exterior del color del tier + interior con la foto o
// las iniciales, y un halo del color. Profesional y llamativo, estilo HUD.
function HexAvatar({ titan, accent, size }: { titan: Titan; accent: string; size: number }) {
  const border = Math.max(3, Math.round(size * 0.06));
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size, filter: `drop-shadow(0 0 ${size * 0.14}px ${accent}88)` }}
    >
      {/* Marco exterior (color del tier) */}
      <span
        className="hex absolute inset-0"
        style={{ background: `linear-gradient(150deg, ${accent}, ${accent}70)` }}
        aria-hidden
      />
      {/* Interior con la imagen / iniciales */}
      <span
        className="hex absolute grid place-items-center overflow-hidden"
        style={{
          inset: border,
          background: `radial-gradient(circle at 35% 22%, ${accent}26, #07070f 78%)`,
        }}
      >
        {titan.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={titan.avatarUrl} alt={titan.ign} className="h-full w-full object-cover" />
        ) : (
          <span className="font-title font-extrabold text-white drop-shadow" style={{ fontSize: size * 0.28 }}>
            {initials(titan.ign)}
          </span>
        )}
      </span>
    </span>
  );
}

function Header() {
  return (
    <header className="text-center">
      <span className="hud-label inline-block text-xs tracking-[0.32em] text-accent">
        Salón de los Titanes
      </span>
      <h1 className="mt-3 font-title text-4xl font-extrabold tracking-wide text-glow-brand sm:text-6xl">
        Los Titanes
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base text-white/55">
        Los que sostienen la alianza. Sin ellos, no hay guerra.
      </p>
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/30 px-3 py-4 text-center">
      <span className="block font-title text-2xl font-extrabold text-gold sm:text-3xl">{value}</span>
      <span className="mt-1.5 block text-[11px] uppercase tracking-[0.08em] text-white/50">{label}</span>
    </div>
  );
}

// Trono del #1 — panel biselado grande con borde del color de su tier.
function Throne({ titan }: { titan: Titan }) {
  const accent = TIER_META[titan.tier].accent;
  return (
    <article
      className="panel panel-accent relative mt-12"
      style={{ "--accent": accent, "--brand": accent } as CSSProperties}
    >
      <div className="panel-inner p-7 sm:p-10">
        {/* Resplandor superior del tier */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: `radial-gradient(75% 100% at 50% 0%, ${accent}2e, transparent 70%)` }}
          aria-hidden
        />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-left">
          <HexAvatar titan={titan} accent={accent} size={150} />
          <div className="min-w-0 flex-1">
            <span
              className="inline-block rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: accent, background: `${accent}1c`, boxShadow: `inset 0 0 0 1px ${accent}55` }}
            >
              ♛ El #1 · Tier {TIER_META[titan.tier].label}
            </span>
            <h2 className="mt-3 font-title text-4xl font-extrabold tracking-wide text-white sm:text-5xl">
              {titan.ign}
            </h2>
            {titan.epiteto && (
              <p className="mt-1.5 text-lg italic" style={{ color: accent }}>
                «{titan.epiteto}»
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-2.5 sm:justify-start">
              <span className="rounded-full bg-gold px-3 py-1 text-sm font-bold text-black">
                ★ VIP {titan.vipLevel}
              </span>
              {titan.isFounder && (
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-sm text-white/65">
                  Fundador
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-7 grid grid-cols-3 gap-3">
          <Stat value={formatPower(titan.power)} label="poder total" />
          <Stat value={String(titan.mythics)} label="míticos" />
          <Stat value={`C${titan.castleLevel}`} label="castillo" />
        </div>

        {titan.quote && (
          <blockquote
            className="relative mt-6 rounded-r-lg border-l-4 bg-black/25 px-5 py-3.5 text-base italic text-white/85"
            style={{ borderColor: accent }}
          >
            {titan.quote}
          </blockquote>
        )}
      </div>
    </article>
  );
}

// Una fila de tier (del #2 en adelante).
function Row({ titan, rank, accent }: { titan: Titan; rank: number; accent: string }) {
  return (
    <article className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.04] sm:p-5">
      <span className="w-6 shrink-0 text-center font-title text-2xl font-extrabold" style={{ color: accent }}>
        {rank}
      </span>
      <HexAvatar titan={titan} accent={accent} size={64} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white">
          {titan.ign}
          {titan.epiteto && (
            <span className="font-normal italic" style={{ color: accent }}>
              {" · «"}
              {titan.epiteto}»
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-white/50">
          VIP {titan.vipLevel} · {formatPower(titan.power)} poder
          {titan.mythics > 0 ? ` · ${titan.mythics} míticos` : ""}
        </p>
      </div>
    </article>
  );
}

export default function TitanesHall({ titanes }: { titanes: Titan[] }) {
  const empty = !titanes?.length;

  return (
    <section className="relative overflow-hidden bg-[#08080c] py-20 sm:py-28">
      {/* Fondo estático: brillo dorado arriba + viñeta inferior (sin canvas). */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(227,179,65,0.12), transparent 72%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,0.55), transparent 60%)" }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Header />

        {empty ? (
          <p className="mt-10 text-center text-base text-white/45">
            Aún no hay Titanes coronados. El trono espera.
          </p>
        ) : (
          <TitanesBody titanes={titanes} />
        )}
      </div>
    </section>
  );
}

function TitanesBody({ titanes }: { titanes: Titan[] }) {
  const rankOf = new Map(titanes.map((t, i) => [t.id, i + 1]));
  const [featured, ...rest] = titanes;
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    players: rest.filter((t) => t.tier === tier),
  })).filter((g) => g.players.length > 0);

  return (
    <>
      <Throne titan={featured} />

      {grouped.map(({ tier, players }) => {
        const accent = TIER_META[tier].accent;
        return (
          <div key={tier} className="mt-12">
            <div
              className="mb-4 flex items-center gap-2.5 font-hud text-sm font-bold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              <span style={{ filter: `drop-shadow(0 0 7px ${accent})` }} aria-hidden>
                ◆
              </span>
              <span>{TIER_META[tier].label}</span>
              <span className="ml-1 h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}55, transparent)` }} aria-hidden />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {players.map((t) => (
                <Row key={t.id} titan={t} rank={rankOf.get(t.id) ?? 0} accent={accent} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Beneficio de pertenecer */}
      <div className="mt-12 rounded-2xl border border-gold/20 bg-gold/[0.06] px-6 py-5">
        <p className="font-title text-base font-bold text-gold">Ser Titán no es solo el salón</p>
        <p className="mt-1.5 text-base leading-relaxed text-white/60">
          Título exclusivo en Discord · prioridad en rallies · voz en decisiones de alianza.
          El estatus se ve, pero también sirve.
        </p>
      </div>
    </>
  );
}
