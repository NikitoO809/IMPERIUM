// Inicio — bienvenida y accesos a las secciones de la web.
import Link from "next/link";
import { Panel, HudLabel } from "@/components/hud";
import { DiscordIcon, BookIcon, ChartIcon, UsersIcon } from "@/components/icons";
import { LoginButton } from "@/components/auth/LoginButton";

const SECTIONS = [
  {
    href: "/juegos",
    icon: BookIcon,
    title: "Juegos y guías",
    desc: "Elige tu juego y sigue las guías interactivas paso a paso.",
    cta: "Explorar juegos",
  },
  {
    href: "/mi-progreso",
    icon: ChartIcon,
    title: "Mi progreso",
    desc: "Consulta tu avance en cada guía y retoma donde lo dejaste.",
    cta: "Ver mi avance",
  },
  {
    href: "/comunidad",
    icon: UsersIcon,
    title: "Comunidad",
    desc: "Mira a los demás jugadores y la clasificación en tiempo real.",
    cta: "Ver comunidad",
  },
];

export default function Inicio() {
  return (
    <main className="relative">
      {/* ───── Hero ───── */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 text-center sm:pt-20">
        <div className="rise flex justify-center">
          <HudLabel>Comunidad de Discord · ES</HudLabel>
        </div>

        <div className="rise mt-8" style={{ animationDelay: "0.05s" }}>
          <img
            src="/brand/dragon-trans.png"
            alt="Dragón de IMPERIUM"
            className="float mx-auto h-28 w-auto sm:h-40"
            style={{ filter: "drop-shadow(0 0 35px rgba(34,224,255,0.4))" }}
          />
        </div>

        <h1
          className="rise -mt-2 font-title text-5xl font-black leading-none tracking-[0.06em] text-glow-brand sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          IMPERIUM
        </h1>

        <p
          className="rise mx-auto mt-6 max-w-xl text-base text-white/65 sm:text-lg"
          style={{ animationDelay: "0.16s" }}
        >
          Guías de juego interactivas, tu progreso guardado y la comunidad jugando
          a tu lado. Empezamos por Call of Dragons.
        </p>

        <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.22s" }}>
          <LoginButton className="btn-hud flex w-full items-center justify-center gap-2.5 bg-gradient-to-r from-brand to-brand-bright px-7 py-3.5 text-white sm:w-auto">
            <DiscordIcon className="h-5 w-5" />
            <span className="font-hud font-bold tracking-[0.1em]">ENTRAR CON DISCORD</span>
          </LoginButton>
          <Link href="/juegos" className="btn-ghost flex w-full items-center justify-center bg-white/5 px-7 py-3.5 font-hud font-semibold tracking-wide text-white/85 ring-1 ring-white/10 transition hover:text-white sm:w-auto">
            Ver las guías
          </Link>
        </div>
      </section>

      {/* ───── Accesos a secciones ───── */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/40" />
          <h2 className="font-title text-lg font-extrabold tracking-[0.15em]">SECCIONES</h2>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/40" />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="block">
              <Panel corners className="sweep lift h-full">
                <div className="panel-inner flex h-full flex-col p-6">
                  <span className="hex grid h-12 w-12 place-items-center bg-brand/15 ring-1 ring-accent/20">
                    <s.icon className="h-5 w-5 text-accent" />
                  </span>
                  <h3 className="mt-4 font-title text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-hud text-sm font-semibold text-accent">
                    {s.cta} <span>▸</span>
                  </span>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
