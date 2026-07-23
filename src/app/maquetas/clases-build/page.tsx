// Vista previa de la sección "Clases Build" de Ragnarok Origin Classic.
// Renderiza el componente REAL (ClasesBuildViewer) con los mismos datos, para poder
// revisarlo mientras la sección de verdad sigue en borrador (la RLS la oculta hasta
// que un admin la publica). Vive en /maquetas y trae su propio fondo.
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ClasesBuildViewer } from "@/components/ClasesBuildViewer";
import type { Block, SectionContent } from "@/lib/sections";

export const metadata = { title: "Vista previa · Clases Build" };

const GAME = "ragnarok-origin-classic";

type GuideRow = {
  slug: string;
  title: string;
  order_index: number;
  intro_images: string[] | null;
  guide_steps: {
    id: string;
    order_index: number;
    title: string;
    content: string | null;
    source_url: string | null;
    images: string[] | null;
  }[];
};

// Arma un SectionContent con la misma forma que devolvería getSectionContent(),
// pero leyendo de las guías (que sí son públicas).
async function buildPreview(): Promise<SectionContent | null> {
  const supabase = await createClient();
  const { data: game } = await supabase.from("games").select("id").eq("slug", GAME).maybeSingle();
  if (!game) return null;

  const { data } = await supabase
    .from("guides")
    .select("slug, title, order_index, intro_images, guide_steps(id, order_index, title, content, source_url, images)")
    .eq("game_id", (game as { id: string }).id)
    .like("slug", "%build%")
    .order("order_index");

  const blocks: Block[] = [];
  let n = 0;
  for (const g of ((data ?? []) as unknown as GuideRow[]).sort((a, b) => a.order_index - b.order_index)) {
    for (const s of [...g.guide_steps].sort((a, b) => a.order_index - b.order_index)) {
      blocks.push({
        id: s.id,
        orderIndex: ++n,
        title: s.title,
        content: s.content ?? "",
        sourceUrl: s.source_url,
        isVerified: false,
        images: s.images ?? [],
        meta: {
          class: g.title.split(":")[0].trim(),
          classSlug: g.slug,
          classIcon: g.intro_images?.[0] ?? null,
          classOrder: g.order_index,
          stepOrder: s.order_index,
        },
      });
    }
  }

  return {
    id: "preview",
    slug: "clases-build",
    title: "Clases Build",
    introTitle: "Una build por clase, explicada paso a paso",
    intro:
      "Las 14 clases finales de Ragnarok Origin Classic, cada una con su build completa: el orden en el que repartir los puntos en los tres árboles de habilidades, el combo que decide una pelea, las cartas y la mascota que mejor le encajan, y los trucos concretos para PvP 5v5 y para la guerra de gremios.\n\nElige tu clase en la columna de la izquierda y muévete por las pestañas de arriba. Cada habilidad va con su icono al lado y una explicación pensada para quien acaba de empezar: si no sabes qué significa PATK, ASPD o SP, ahí te lo decimos.",
    introImages: [],
    renderType: "class-builds",
    blocks,
  };
}

export default async function VistaPreviaClasesBuild() {
  const section = await buildPreview();

  return (
    <main className="relative min-h-screen bg-[#05060a] px-4 py-10">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50rem 30rem at 20% 0%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(40rem 30rem at 90% 10%, rgba(34,224,255,0.12), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded border border-amber-400/30 bg-amber-400/5 px-4 py-3">
          <p className="hud-label text-[10px] text-amber-300/90">VISTA PREVIA — LA SECCIÓN REAL ESTÁ EN BORRADOR</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">
            Esto es el componente definitivo. La sección <strong className="text-white/85">Clases Build</strong> ya está
            creada en la base de datos, pero hasta que la publiques desde <code className="text-white/75">/admin</code>{" "}
            solo se ve aquí. Su dirección definitiva será{" "}
            <code className="text-white/75">/juegos/{GAME}/clases-build</code>.
          </p>
        </div>

        <h1 className="mb-5 font-title text-2xl font-extrabold tracking-wide text-glow-brand sm:text-3xl">
          Clases Build
        </h1>

        {!section || section.blocks.length === 0 ? (
          <p className="text-sm text-white/50">No se encontraron guías de build.</p>
        ) : (
          <ClasesBuildViewer section={section} />
        )}

        <Link
          href={`/juegos/${GAME}`}
          className="mt-8 inline-block text-sm text-white/45 transition hover:text-white"
        >
          ← Volver al juego
        </Link>
      </div>
    </main>
  );
}
