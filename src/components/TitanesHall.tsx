// SALÓN DE LOS TITANES — el club VIP/whales de la alianza, con estilo HUD del
// sitio (panel biselado, oro imperial, fuente Orbitron) sobre el mismo fondo
// espacial que la Fama. Un "trono" para el #1 y bloques por tier
// (Diamante · Rubí · Oro). Componente de servidor; solo el fondo es cliente.
import type { CSSProperties } from "react";
import { Starfield } from "@/components/Starfield";
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

// Fondo espacial reutilizado de la Fama (radial + estrellas interactivas).
function SpaceBackground() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 0%, #0a0a1e 0%, #04040c 60%, #020207 100%)" }}
        aria-hidden
      />
      <Starfield />
    </>
  );
}

function Header() {
  return (
    <header className="text-center">
      <span className="hud-label inline-block text-[11px] tracking-[0.3em] text-accent">
        Salón de los Titanes
      </span>
      <h1 className="mt-2 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Los Titanes
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
        Los que sostienen la alianza. Sin ellos, no hay guerra.
      </p>
    </header>
  );
}

function Avatar({ titan, accent, size }: { titan: Titan; accent: string; size: "lg" | "sm" }) {
  const dim = size === "lg" ? "h-24 w-24 text-2xl" : "h-12 w-12 text-sm";
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full ${dim}`}
      style={{
        boxShadow:
          size === "lg"
            ? `0 0 0 2px ${accent}, 0 0 26px ${accent}77`
            : `0 0 0 1.5px ${accent}, 0 0 12px ${accent}55`,
        background: `radial-gradient(circle at 35% 30%, ${accent}, #06060f 80%)`,
      }}
    >
      {titan.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={titan.avatarUrl} alt={titan.ign} className="h-full w-full object-cover" />
      ) : (
        <span className="font-title font-extrabold text-white drop-shadow">{initials(titan.ign)}</span>
      )}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/25 px-2 py-3 text-center">
      <span className="block font-title text-xl font-extrabold text-gold">{value}</span>
      <span className="mt-1 block text-[10px] uppercase tracking-[0.05em] text-white/45">{label}</span>
    </div>
  );
}

// Trono del #1 — panel biselado con borde del color de su tier.
function Throne({ titan }: { titan: Titan }) {
  const accent = TIER_META[titan.tier].accent;
  return (
    <article
      className="panel panel-accent relative mt-10"
      style={{ "--accent": accent, "--brand": accent } as CSSProperties}
    >
      <div className="panel-inner p-6 sm:p-7">
        {/* Resplandor superior del tier */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: `radial-gradient(80% 100% at 50% 0%, ${accent}30, transparent 70%)` }}
          aria-hidden
        />

        <span
          className="relative inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: accent, background: `${accent}1a`, boxShadow: `inset 0 0 0 1px ${accent}55` }}
        >
          ♛ El #1 · Tier {TIER_META[titan.tier].label}
        </span>

        <div className="relative mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <Avatar titan={titan} accent={accent} size="lg" />
          <div className="min-w-0">
            <h2 className="font-title text-2xl font-extrabold tracking-wide text-white">{titan.ign}</h2>
            {titan.epiteto && (
              <p className="mt-0.5 text-sm italic" style={{ color: accent }}>
                «{titan.epiteto}»
              </p>
            )}
            <div className="mt-2.5 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-black">
                ★ VIP {titan.vipLevel}
              </span>
              {titan.isFounder && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60">
                  Fundador
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2.5">
          <Stat value={formatPower(titan.power)} label="poder total" />
          <Stat value={String(titan.mythics)} label="míticos" />
          <Stat value={`C${titan.castleLevel}`} label="castillo" />
        </div>

        {titan.quote && (
          <blockquote
            className="relative mt-4 rounded-r-lg border-l-2 bg-black/20 px-4 py-2.5 text-sm italic text-white/80"
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
    <article
      className="group flex items-center gap-3.5 rounded-lg border border-l-2 border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-transform duration-150 hover:translate-x-1"
      style={{ borderLeftColor: accent }}
    >
      <span className="w-5 text-center font-title text-lg text-white/45">{rank}</span>
      <Avatar titan={titan} accent={accent} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {titan.ign}
          {titan.epiteto && (
            <span className="font-normal italic" style={{ color: accent }}>
              {" · «"}
              {titan.epiteto}»
            </span>
          )}
        </p>
        <p className="mt-0.5 text-xs text-white/45">
          VIP {titan.vipLevel} · {formatPower(titan.power)} poder
          {titan.mythics > 0 ? ` · ${titan.mythics} míticos` : ""}
        </p>
      </div>
      <span style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent})` }} aria-hidden>
        ◆
      </span>
    </article>
  );
}

export default function TitanesHall({ titanes }: { titanes: Titan[] }) {
  if (!titanes?.length) {
    return (
      <section className="relative flex flex-col overflow-hidden py-24">
        <SpaceBackground />
        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <Header />
          <p className="mt-8 text-center text-sm text-white/45">
            Aún no hay Titanes coronados. El trono espera.
          </p>
        </div>
      </section>
    );
  }

  const rankOf = new Map(titanes.map((t, i) => [t.id, i + 1]));
  const [featured, ...rest] = titanes;
  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    players: rest.filter((t) => t.tier === tier),
  })).filter((g) => g.players.length > 0);

  return (
    <section className="relative flex flex-col overflow-hidden py-16">
      <SpaceBackground />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4">
        <Header />
        <Throne titan={featured} />

        {grouped.map(({ tier, players }) => {
          const accent = TIER_META[tier].accent;
          return (
            <div key={tier} className="mt-9">
              <div
                className="mb-3 flex items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.16em]"
                style={{ color: accent }}
              >
                <span style={{ filter: `drop-shadow(0 0 6px ${accent})` }} aria-hidden>
                  ◆
                </span>
                <span>{TIER_META[tier].label}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {players.map((t) => (
                  <Row key={t.id} titan={t} rank={rankOf.get(t.id) ?? 0} accent={accent} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Beneficio de pertenecer */}
        <div className="mt-9 rounded-xl border border-gold/20 bg-gold/[0.06] px-5 py-4">
          <p className="font-title text-sm font-bold text-gold">Ser Titán no es solo el salón</p>
          <p className="mt-1 text-sm leading-relaxed text-white/55">
            Título exclusivo en Discord · prioridad en rallies · voz en decisiones de alianza.
            El estatus se ve, pero también sirve.
          </p>
        </div>
      </div>
    </section>
  );
}
