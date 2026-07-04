// Página "Apoyar IMPERIUM": donde un Recluta se convierte en donante. Enfoque de
// APOYO (sostiene la web y el Asistente IA) con ventajas como agradecimiento.
// Pública. Está dentro de (app): no añade header/footer.
import type { Metadata } from "next";
import Link from "next/link";
import { RankBadge } from "@/components/RankBadge";
import { HudLabel } from "@/components/hud";
import {
  SUPPORT_TIERS,
  FOUNDERS_GOAL,
  KOFI_URL,
  DISCORD_INVITE,
  getDonorCount,
} from "@/lib/support";

export const metadata: Metadata = {
  title: "Apoya IMPERIUM",
  description:
    "Apoya IMPERIUM y desbloquea lo mejor: escribe en las discusiones, crea alianzas y usa el Asistente IA. Tu apoyo mantiene viva la comunidad.",
  alternates: { canonical: "/apoyar" },
};

export default async function ApoyarPage() {
  const donors = await getDonorCount();
  const pct = Math.min(100, Math.round((donors / FOUNDERS_GOAL) * 100));
  // Enlace de pago: Ko-fi si está configurado; si no, Discord; si no, nada.
  const payHref = KOFI_URL || DISCORD_INVITE || "";

  return (
    <main className="mx-auto max-w-5xl px-4 pt-12 pb-20">
      <div className="text-center">
        <HudLabel>Apoya IMPERIUM</HudLabel>
        <h1 className="mt-3 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
          Sé parte de los que lo sostienen
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
          IMPERIUM lo mantiene su gente. Con tu apoyo seguimos pagando la web y el{" "}
          <b className="text-white">Asistente IA</b> — y como agradecimiento, desbloqueas
          escribir en las discusiones, crear alianzas, más consultas a la IA y tu rango
          brillando por toda la web.{" "}
          <b className="text-white">Mirar es gratis; participar es de los nuestros.</b>
        </p>
      </div>

      {/* meta / escasez */}
      <div className="mx-auto mt-8 max-w-md panel">
        <div className="panel-inner p-5">
          <div className="flex items-baseline justify-between text-sm text-white/60">
            <span>Primeros Fundadores</span>
            <span>
              <b className="text-gold">{donors}</b> / {FOUNDERS_GOAL}
            </span>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-gold"
              style={{ width: `${Math.max(4, pct)}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs text-white/45">
            20 años de comunidad — los próximos 20 los construimos juntos.
          </p>
        </div>
      </div>

      {/* tiers */}
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {SUPPORT_TIERS.map((t) => (
          <div
            key={t.rank}
            className={`relative panel ${t.popular ? "ring-1 ring-accent/40" : ""}`}
          >
            <div className="panel-inner flex h-full flex-col p-6">
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                  Más elegido
                </span>
              )}
              <div className="flex items-center justify-between">
                <RankBadge rank={t.rank} />
              </div>
              <div className="mt-4 font-title text-4xl font-extrabold text-white">{t.price}</div>
              <div className="mt-1 text-xs text-white/45">aporte único · para siempre</div>

              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-white/75">
                {t.perks.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              {payHref ? (
                <a
                  href={payHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hud mt-6 flex w-full items-center justify-center bg-brand px-5 py-3 font-bold text-white"
                >
                  Apoyar
                </a>
              ) : (
                <span className="btn-ghost mt-6 flex w-full cursor-not-allowed items-center justify-center border border-white/15 px-5 py-3 text-white/60 opacity-60">
                  Pronto
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* cómo funciona */}
      <div className="mx-auto mt-12 max-w-2xl space-y-4">
        <div className="panel">
          <div className="panel-inner p-5">
            <h2 className="font-title text-lg font-bold text-white">¿Cómo apoyo y subo de rango?</h2>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-white/65">
              <li>Elige tu rango y pulsa <b className="text-white">&ldquo;Apoyar&rdquo;</b>.</li>
              <li>Aporta y <b className="text-white">escribe tu usuario de Discord</b> en el mensaje.</li>
              <li>Te asignamos el rango y <b className="text-white">tu perfil cambia solo</b>: badge, color y permisos. ✨</li>
            </ol>
          </div>
        </div>

        <div className="panel">
          <div className="panel-inner p-5">
            <h2 className="font-title text-lg font-bold text-white">¿Por qué el Asistente IA tiene un límite?</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Cada consulta a la IA <b className="text-white">cuesta dinero de verdad</b>. Tu apoyo es
              justo lo que la mantiene encendida para toda la comunidad — por eso, cuanto más apoyas,
              más consultas al día tienes. Es sostenible y justo. 🌱
            </p>
          </div>
        </div>
      </div>

      {!KOFI_URL && (
        <p className="mx-auto mt-8 max-w-2xl rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3 text-center text-xs text-gold/90">
          Nota para el equipo: configura <code>NEXT_PUBLIC_KOFI_URL</code> en .env.local para activar el
          pago por Ko-fi. Precios de ejemplo (3 / 8 / 20 €) — cámbialos en <code>src/lib/support.ts</code>.
        </p>
      )}

      <p className="mt-10 text-center text-sm text-white/55">
        <Link href="/comunidad" className="transition hover:text-accent">Ver la comunidad →</Link>
      </p>
    </main>
  );
}
