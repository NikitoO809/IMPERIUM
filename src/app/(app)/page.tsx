// Inicio — portada de la comunidad (sistema neutro: zinc + oro único).
// Hero central (isla cliente), datos de Discord EN VIVO sin caja,
// juegos esperados (suscripción) y MMORPG con preregistro.
import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { UpcomingGames } from "@/components/UpcomingGames";
import { PreRegisterGames } from "@/components/PreRegisterGames";
import { CommunityLive } from "@/components/CommunityLive";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { DiscordIcon } from "@/components/icons";
import { getDiscordStats, DISCORD_INVITE_URL } from "@/lib/discord";
import { getUpcomingGames } from "@/lib/upcoming";
import { getPreRegisterGames } from "@/lib/preregister-games";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

// La home es la portada de la comunidad: declaramos la marca (Organization) y el
// sitio (WebSite) como datos estructurados, y fijamos su URL canónica.
export const metadata = {
  alternates: { canonical: "/" },
};

export default async function Inicio() {
  const [discord, upcoming, preregister] = await Promise.all([
    getDiscordStats(),
    getUpcomingGames(),
    getPreRegisterGames(),
  ]);
  const nf = new Intl.NumberFormat("es-ES");

  return (
    <main className="relative">
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      {/* ───── Hero (isla cliente) ───── */}
      <HomeHero
        members={discord ? nf.format(discord.memberCount) : "—"}
        online={discord ? nf.format(discord.onlineCount) : "—"}
      />

      {/* ───── Comunidad / Discord (datos en vivo, sin caja) ───── */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-8 border-y border-white/8 py-8 sm:flex-row sm:items-center sm:gap-10">
            <div>
              <span className="eyebrow">El servidor ahora mismo</span>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
                Veinte años de comunidad. Estos son los datos en vivo del Discord.
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/8 sm:ml-auto">
              <Stat value="20" label="Años" />
              <Stat value={discord ? nf.format(discord.memberCount) : "—"} label="Miembros" />
              <Stat value={discord ? nf.format(discord.onlineCount) : "—"} label="Online" live />
            </div>

            {DISCORD_INVITE_URL ? (
              <Magnetic strength={0.3} className="sm:ml-2">
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-primary"
                >
                  <DiscordIcon className="h-5 w-5" />
                  <span>Únete</span>
                </a>
              </Magnetic>
            ) : (
              <p className="text-faint text-xs sm:ml-2">
                {/* Miguel: pega tu invitación en NEXT_PUBLIC_DISCORD_INVITE para activar este botón. */}
                Invitación de Discord pendiente.
              </p>
            )}
          </div>
        </Reveal>
      </section>

      {/* ───── La comunidad en directo (presencia + actividad + Fundadores) ───── */}
      <CommunityLive />

      {/* ───── Juegos que esperamos (suscripción) ───── */}
      {upcoming.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Próximos juegos"
              title="Lo que esperamos juntos"
              sub="Apúntate y te avisamos cuando empecemos. De paso ves cuánta gente lo espera."
            />
          </Reveal>
          <Reveal className="mt-10">
            <UpcomingGames games={upcoming} />
          </Reveal>
        </section>
      )}

      {/* ───── MMORPG con preregistro (reemplaza la antigua bento) ───── */}
      <section className="mx-auto max-w-7xl px-4 pb-32 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Más esperados"
            title="MMORPG en el horizonte"
            sub="Los MMORPG más esperados según la comunidad. Entra a cada ficha y sigue sus novedades; cuando abra el preregistro oficial, lo enlazamos aquí."
          />
        </Reveal>
        <Reveal className="mt-10">
          <PreRegisterGames games={preregister} />
        </Reveal>
        <Reveal className="mt-8 flex justify-center">
          <Link href="/proximos" className="pill pill-ghost">
            <span>Ver todos los próximos</span>
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
}

// Encabezado de sección: eyebrow + display (sin degradado de texto).
function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="font-display mt-4 text-3xl text-white sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">{sub}</p>}
    </div>
  );
}

// Métrica en vivo: número monoespaciado + etiqueta.
function Stat({ value, label, live = false }: { value: string; label: string; live?: boolean }) {
  return (
    <div className="px-5 first:pl-0 last:pr-0">
      <div className="flex items-center gap-1.5">
        {live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />}
        <span className="font-num text-2xl text-white sm:text-3xl">{value}</span>
      </div>
      <span className="mt-1.5 block text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</span>
    </div>
  );
}
