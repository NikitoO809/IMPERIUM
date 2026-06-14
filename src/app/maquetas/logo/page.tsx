// Muestra comparativa: dos formas de montar el logo en la web.
// A) dragón emblema + texto IMPERIUM nítido de la web.
// B) el logo completo tal cual (imagen).
// El negro de las imágenes se elimina con mix-blend-mode: screen.
import Link from "next/link";
import { Panel, HudLabel } from "@/components/hud";
import { DiscordIcon, ShieldIcon } from "@/components/icons";

export default function LogoPreview() {
  return (
    <main className="relative min-h-screen bg-[#04060a] pb-24">
      <div className="scanlines" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50rem 32rem at 25% 0%, rgba(124,92,255,0.16), transparent 60%), radial-gradient(40rem 30rem at 85% 5%, rgba(34,224,255,0.12), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-5 pt-12">
        <HudLabel>Muestra de logo · violeta/cian</HudLabel>
        <h1 className="mt-3 font-title text-2xl font-extrabold tracking-wide text-white sm:text-3xl">
          Dos formas de montar tu logo
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Mira las dos y dime cuál prefieres. Esa la dejo en la barra superior y
          en la portada.
        </p>

        {/* ════════ OPCIÓN A ════════ */}
        <div className="mt-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="hex grid h-7 w-7 place-items-center bg-accent font-title text-xs font-bold text-black">A</span>
            <h2 className="font-title text-lg font-bold tracking-wide text-white">
              Dragón + texto nítido de la web
            </h2>
          </div>

          {/* Barra superior */}
          <p className="hud-label mb-2 text-[10px] text-white/35">En la barra superior</p>
          <Panel>
            <div className="panel-inner flex items-center justify-between px-4 py-2.5">
              <span className="flex items-center gap-2.5">
                <img src="/brand/dragon-web.png" alt="Dragón IMPERIUM" className="h-9 w-auto" style={{ mixBlendMode: "screen" }} />
                <span className="font-title text-base font-extrabold tracking-[0.15em] text-glow-accent">IMPERIUM</span>
              </span>
              <a href="#" className="btn-hud flex items-center gap-2 bg-brand px-4 py-2 text-white">
                <DiscordIcon className="h-4 w-4" />
                <span className="hud-label text-[11px]">Entrar</span>
              </a>
            </div>
          </Panel>

          {/* En la portada */}
          <p className="hud-label mb-2 mt-6 text-[10px] text-white/35">En la portada</p>
          <Panel corners>
            <div className="panel-inner flex flex-col items-center px-6 py-12 text-center">
              <img
                src="/brand/dragon-web.png"
                alt="Dragón IMPERIUM"
                className="float h-40 w-auto"
                style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 30px rgba(34,224,255,0.35))" }}
              />
              <h3 className="mt-2 font-title text-5xl font-black tracking-[0.08em] text-glow-brand sm:text-6xl">
                IMPERIUM
              </h3>
              <span className="hud-label mt-3 text-[11px] text-accent/70">Guild Community</span>
            </div>
          </Panel>
        </div>

        {/* ════════ OPCIÓN B ════════ */}
        <div className="mt-16">
          <div className="mb-4 flex items-center gap-3">
            <span className="hex grid h-7 w-7 place-items-center bg-brand font-title text-xs font-bold text-white">B</span>
            <h2 className="font-title text-lg font-bold tracking-wide text-white">
              Logo completo tal cual (imagen)
            </h2>
          </div>

          <p className="hud-label mb-2 text-[10px] text-white/35">En la barra superior</p>
          <Panel>
            <div className="panel-inner flex items-center justify-between px-4 py-2.5">
              <img src="/brand/logo-web.png" alt="Logo IMPERIUM" className="h-10 w-auto" style={{ mixBlendMode: "screen" }} />
              <a href="#" className="btn-hud flex items-center gap-2 bg-brand px-4 py-2 text-white">
                <DiscordIcon className="h-4 w-4" />
                <span className="hud-label text-[11px]">Entrar</span>
              </a>
            </div>
          </Panel>

          <p className="hud-label mb-2 mt-6 text-[10px] text-white/35">En la portada</p>
          <Panel corners>
            <div className="panel-inner flex flex-col items-center px-6 py-12">
              <img
                src="/brand/logo-web.png"
                alt="Logo IMPERIUM"
                className="float h-56 w-auto"
                style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 30px rgba(34,224,255,0.3))" }}
              />
            </div>
          </Panel>
        </div>

        <div className="mt-12 flex items-center gap-2 text-sm text-white/50">
          <ShieldIcon className="h-4 w-4 text-accent" />
          ¿Cuál te gusta más, la <b className="text-white">A</b> o la <b className="text-white">B</b>?
        </div>
        <Link href="/" className="mt-4 inline-block text-sm text-white/45 transition hover:text-white">
          ← Volver a la web
        </Link>
      </div>
    </main>
  );
}
