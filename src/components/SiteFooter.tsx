// Pie de página del sitio — lenguaje "IMPERIUM": off-black + oro imperial,
// material glass, emblema del dragón y HUD sobrio (corchetes de esquina,
// live-dot, hex). Columnas de navegación reales + CTA de Discord.
import Link from "next/link";
import { DiscordIcon } from "@/components/icons";

type FLink = { href: string; label: string };

const EXPLORAR: FLink[] = [
  { href: "/", label: "Inicio" },
  { href: "/juegos", label: "Juegos" },
  { href: "/proximos", label: "Próximos" },
  { href: "/fama", label: "Salón de la Fama" },
];

const COMUNIDAD: FLink[] = [
  { href: "/comunidad", label: "Comunidad" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/apoyar", label: "Apoyar el proyecto" },
];

function FooterCol({ title, links }: { title: string; links: FLink[] }) {
  return (
    <div>
      <h3 className="hud-label mb-4 flex items-center gap-2 text-[11px] text-gold">
        <span className="hex h-2.5 w-2.5 bg-gold/70" aria-hidden />
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-[13px] text-white/55 transition-colors hover:text-white"
            >
              <span className="text-gold/50 transition-transform duration-200 group-hover:translate-x-0.5">›</span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Corchetes HUD en las cuatro esquinas (oro).
function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const base = "pointer-events-none absolute h-4 w-4 border-gold/50";
  const map = {
    tl: "left-4 top-4 border-l-2 border-t-2",
    tr: "right-4 top-4 border-r-2 border-t-2",
    bl: "left-4 bottom-4 border-l-2 border-b-2",
    br: "right-4 bottom-4 border-r-2 border-b-2",
  } as const;
  return <span aria-hidden className={`${base} ${map[pos]}`} />;
}

export function SiteFooter() {
  const discord = process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "";
  const year = 2026; // fecha del proyecto

  return (
    <footer className="relative isolate mt-24 overflow-hidden">
      {/* ── Fondo ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base off-black + luz cenital dorada */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_130%_at_50%_-10%,rgba(227,179,65,0.10),transparent_60%)] bg-[#0a0a0b]" />
        {/* rejilla de puntos dorada muy sutil, desvanecida */}
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_90%_at_50%_0%,#000_30%,transparent_75%)] bg-[radial-gradient(rgba(227,179,65,0.10)_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* emblema del dragón como marca de agua */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/dragon-trans.png"
          alt=""
          className="tint-emblem absolute -bottom-16 -right-10 h-[380px] w-auto opacity-[0.05]"
        />
        {/* línea dorada superior + rombo central */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold shadow-[0_0_10px_rgba(227,179,65,0.6)]" />
      </div>

      {/* corchetes de esquina */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1.1fr]">
          {/* Marca */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/dragon-trans.png" alt="Dragón de IMPERIUM" className="tint-emblem h-9 w-auto" />
              <span
                className="font-display text-2xl font-bold tracking-tight text-transparent"
                style={{
                  backgroundImage: "linear-gradient(180deg,#fff 0%,#f2dda9 55%,#e3b341 120%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                IMPERIUM
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/50">
              Comunidad de gamers en Discord: guías interactivas, comunidad viva y los juegos que están por venir.
            </p>
            {discord && (
              <a
                href={discord}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-primary mt-6 !py-2.5 !pl-5 !text-[13px]"
              >
                <DiscordIcon className="h-4 w-4" />
                <span>Únete a Discord</span>
              </a>
            )}
          </div>

          {/* Navegación */}
          <FooterCol title="Explorar" links={EXPLORAR} />
          <FooterCol title="Comunidad" links={COMUNIDAD} />

          {/* Estado del sistema */}
          <div>
            <h3 className="hud-label mb-4 flex items-center gap-2 text-[11px] text-gold">
              <span className="hex h-2.5 w-2.5 bg-gold/70" aria-hidden />
              Estado
            </h3>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2.5">
                <span className="live-dot h-2 w-2 rounded-full bg-gold" aria-hidden />
                <span className="hud-label text-[11px] text-white/80">
                  Sistema: <span className="text-gold">Online</span>
                </span>
              </div>
              <p className="mt-2.5 font-num text-[11px] text-white/40">v0.1 · Comunidad de Discord</p>
            </div>
          </div>
        </div>

        {/* separador */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* barra inferior */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="hud-label text-[10px] text-white/35">
            © {year} IMPERIUM · Comunidad de Discord
          </p>
          <p className="hud-label text-[10px] text-white/35">
            Sitio creado por{" "}
            <a
              href="https://miguelflx.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold tracking-[0.12em] text-gold transition-all hover:text-brand-bright"
            >
              NikitoO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
