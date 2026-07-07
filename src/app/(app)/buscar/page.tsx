// Página de resultados de búsqueda: /buscar?q=...
// Server component: lee la consulta, llama a searchContent (respeta RLS) y
// muestra todos los resultados agrupados por tipo. Incluye su propia caja de
// búsqueda (formulario GET, funciona incluso sin JavaScript).
import type { Metadata } from "next";
import Link from "next/link";
import { searchContent, type SearchKind, type SearchResult } from "@/lib/search";
import { HudLabel } from "@/components/hud";
import { BookIcon, GemIcon, ShieldIcon, SearchIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca en todas las guías, secciones y héroes de IMPERIUM.",
  // Las páginas de resultados no se indexan (evita URLs de búsqueda infinitas).
  robots: { index: false, follow: true },
};

const KIND_META: Record<SearchKind, { label: string; Icon: typeof BookIcon }> = {
  guia: { label: "Guías", Icon: BookIcon },
  seccion: { label: "Secciones", Icon: GemIcon },
  heroe: { label: "Héroes", Icon: ShieldIcon },
};
const KIND_ORDER: SearchKind[] = ["guia", "seccion", "heroe"];

function ResultRow({ r }: { r: SearchResult }) {
  const { Icon } = KIND_META[r.kind];
  return (
    <Link
      href={r.url}
      className="group flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-3 transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
    >
      {r.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={r.coverImage}
          alt=""
          loading="lazy"
          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
        />
      ) : (
        <span className="hex grid h-14 w-14 shrink-0 place-items-center bg-brand/15 ring-1 ring-accent/25 transition-all group-hover:ring-accent/60">
          <Icon className="h-5 w-5 text-accent" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-title text-base font-bold text-white transition-colors group-hover:text-accent">
            {r.title}
          </h3>
          <span className="shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-px text-[10px] text-white/50">
            {r.gameName}
          </span>
        </div>
        {r.snippet && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/45">{r.snippet}</p>
        )}
      </div>

      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-accent/40 transition-all group-hover:translate-x-0.5 group-hover:text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").trim();
  const results = q ? await searchContent(q, 40) : [];

  const groups = KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_META[kind].label,
    items: results.filter((r) => r.kind === kind),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="mx-auto max-w-3xl px-4 pt-12 pb-16">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-white/45">
        <Link href="/" className="transition hover:text-accent">Inicio</Link>
        <span>/</span>
        <span className="text-white/70">Buscar</span>
      </div>

      <HudLabel>Buscador</HudLabel>
      <h1 className="mt-3 mb-6 font-title text-3xl font-extrabold tracking-wide text-glow-brand sm:text-4xl">
        Buscar en IMPERIUM
      </h1>

      {/* Caja de búsqueda (GET, sin depender de JavaScript) */}
      <form action="/buscar" method="get" className="mb-8">
        <div className="flex items-center gap-3 rounded-xl border border-white/12 bg-zinc-950/60 px-4 backdrop-blur-xl focus-within:border-accent/40">
          <SearchIcon className="h-4 w-4 shrink-0 text-accent/70" />
          <input
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="Buscar guías, secciones, héroes…"
            className="w-full bg-transparent py-3.5 text-[15px] text-white placeholder:text-white/35 focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="pill pill-primary shrink-0 !py-1.5 !px-4 !text-[13px]"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Estados */}
      {!q && (
        <p className="py-16 text-center text-sm text-white/40">
          Escribe algo arriba para buscar en todas las guías, secciones y héroes.
          <br />
          <span className="mt-2 inline-block text-white/30">
            Atajo: pulsa{" "}
            <kbd className="rounded border border-white/12 bg-white/5 px-1.5 py-0.5 font-hud text-[11px]">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="rounded border border-white/12 bg-white/5 px-1.5 py-0.5 font-hud text-[11px]">
              K
            </kbd>{" "}
            en cualquier página.
          </span>
        </p>
      )}

      {q && results.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-white/50">
            Sin resultados para <span className="text-white/80">«{q}»</span>.
          </p>
          <p className="mt-2 text-xs text-white/35">
            Prueba con menos palabras o un término más general.
          </p>
        </div>
      )}

      {q && results.length > 0 && (
        <>
          <p className="mb-6 text-xs text-white/40">
            {results.length} resultado{results.length === 1 ? "" : "s"} para{" "}
            <span className="text-white/70">«{q}»</span>
          </p>
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.kind}>
                <div className="mb-3 flex items-center gap-2">
                  <HudLabel className="!text-[10px]">{group.label}</HudLabel>
                  <span className="text-[10px] text-white/30">({group.items.length})</span>
                </div>
                <div className="space-y-2">
                  {group.items.map((r) => (
                    <ResultRow key={r.url} r={r} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
