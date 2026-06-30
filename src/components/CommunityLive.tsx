// Sección de portada "La comunidad, en directo": presencia en vivo + métricas,
// actividad reciente (mensajes y alianzas) y Muro de Fundadores. Server
// component: trae los datos y embebe <LivePresence/> (cliente) para el contador.
import Link from "next/link";
import { getFounders, getRecentActivity, getCommunityStats } from "@/lib/community-live";
import { LivePresence } from "@/components/LivePresence";
import { RankBadge } from "@/components/RankBadge";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

export async function CommunityLive() {
  const [founders, activity, stats] = await Promise.all([
    getFounders(),
    getRecentActivity(),
    getCommunityStats(),
  ]);
  const nf = new Intl.NumberFormat("es-ES");

  return (
    <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
      <div className="max-w-2xl">
        <span className="eyebrow">La comunidad</span>
        <h2 className="font-display mt-4 text-3xl text-white sm:text-4xl">En directo</h2>
        <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-zinc-400">
          Esto no es una web muerta: hay gente dentro ahora mismo. Únete y deja tu huella.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* presencia + métricas */}
        <div className="rounded-2xl border border-white/8 bg-zinc-950/40 p-6">
          <LivePresence />
          <div className="mt-5 flex justify-around border-t border-white/8 pt-5">
            <div className="text-center">
              <div className="font-num text-2xl font-bold text-white">{nf.format(stats.members)}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Miembros</div>
            </div>
            <div className="text-center">
              <div className="font-num text-2xl font-bold text-gold">{nf.format(stats.donors)}</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">Donantes</div>
            </div>
          </div>
        </div>

        {/* actividad reciente */}
        <div className="rounded-2xl border border-white/8 bg-zinc-950/40 px-6 py-2">
          {activity.length === 0 ? (
            <p className="py-10 text-center text-sm text-zinc-500">
              La actividad de la comunidad aparecerá aquí.
            </p>
          ) : (
            activity.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-white/6 py-3.5 last:border-0"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-sm">
                  {a.kind === "post" ? "💬" : "🤝"}
                </span>
                <p className="flex-1 text-sm text-zinc-400">
                  <Link href={`/u/${a.authorId}`} className="font-semibold text-zinc-200 hover:text-white">
                    {a.authorName}
                  </Link>{" "}
                  {a.kind === "post" ? "escribió en" : "creó una alianza en"}{" "}
                  <Link
                    href={`/juegos/${a.gameSlug}/${a.kind === "post" ? "discusion" : "alianzas"}`}
                    className="font-medium text-white hover:text-gold"
                  >
                    {a.gameName}
                  </Link>
                </p>
                <span className="shrink-0 text-xs text-zinc-600">{timeAgo(a.when)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* muro de fundadores */}
      <div className="mt-5 rounded-2xl border border-white/8 bg-[radial-gradient(100%_120%_at_50%_-20%,rgba(232,181,77,.1),transparent_55%)] p-8">
        <div className="text-center">
          <div className="text-3xl">👑</div>
          <h3 className="font-display mt-2 text-2xl text-white">Muro de Fundadores</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Quienes sostienen la web, las guías y el Asistente IA. Su sitio en la historia de IMPERIUM.
          </p>
        </div>

        {founders.length > 0 ? (
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {founders.map((f) => (
              <Link
                key={f.id}
                href={`/u/${f.id}`}
                className="group flex flex-col items-center rounded-xl border border-white/8 bg-zinc-950/50 p-4 text-center transition hover:border-gold/30"
              >
                <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/15 group-hover:ring-gold/40">
                  {f.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-white/60">{f.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </span>
                <span className="mt-2.5 max-w-full truncate text-sm font-semibold text-white">{f.name}</span>
                <RankBadge rank={f.rank} className="mt-1.5 !px-2 !py-0.5 !text-[9px]" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Aún no hay Fundadores. <span className="text-gold">¿Serás el primero?</span>
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/apoyar"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
          >
            👑 Únete a los Fundadores
          </Link>
        </div>
      </div>
    </section>
  );
}
