// Panel de admin — gestionar una sección y sus bloques de contenido.
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff, getAdminSection } from "@/lib/admin";
import { canPublish } from "@/lib/ranks";
import { HudLabel } from "@/components/hud";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { SectionBlocksEditor } from "@/components/admin/SectionBlocksEditor";
import { PreviewButton } from "@/components/admin/PreviewButton";
import { labelCls, inputCls, textareaCls, btnPrimary, btnDanger } from "@/components/admin/styles";
import { updateSection, setSectionPublished, deleteSection } from "../../../../actions";

const RENDER_TYPES = [
  { value: "generic", label: "Solo texto / tarjetas" },
  { value: "tier-list", label: "Tier list" },
  { value: "artifact-table", label: "Tabla de artefactos" },
  { value: "behemoth", label: "Behemoths" },
  { value: "builds", label: "Builds" },
  { value: "class-tier", label: "Tier list por clase" },
];

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ gameId: string; sectionId: string }>;
}) {
  const { rank } = await requireStaff();
  const userCanPublish = canPublish(rank);
  const { gameId, sectionId } = await params;
  const data = await getAdminSection(sectionId);
  if (!data) notFound();
  const { section, game, blocks } = data;

  return (
    <div className="flex h-full flex-col">

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <nav className="mb-1 flex items-center gap-1.5 font-hud text-[10px] text-white/35">
          <Link href="/admin" className="hover:text-accent transition-colors">Panel</Link>
          <span>/</span>
          <Link href={`/admin/juegos/${gameId}`} className="hover:text-accent transition-colors">{game.name}</Link>
          <span>/</span>
          <span className="text-white/60">{section.title}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Editar sección</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              {section.title}
            </h1>
          </div>
          <span className={`font-hud text-[10px] ${section.isPublished ? "text-emerald-400/80" : "text-amber-400/70"}`}>
            {section.isPublished ? "● visible al público" : "○ oculta"}
          </span>
        </div>
      </header>

      {/* Contenido en dos columnas */}
      <div className="flex flex-1 gap-0 overflow-auto">

        {/* Col izq: configuración */}
        <div className="w-72 shrink-0 overflow-auto border-r border-white/8 px-6 py-6">
          <p className="mb-3 font-title text-[9px] font-bold tracking-widest text-white/35">
            CONFIGURACIÓN
          </p>
          <form id="section-config" action={updateSection} className="grid gap-3">
            <input type="hidden" name="id" value={section.id} />
            <div>
              <label className={labelCls}>Nombre</label>
              <input name="title" defaultValue={section.title} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Dirección web (slug)</label>
              <input name="slug" defaultValue={section.slug} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipo de contenido</label>
              <select name="render_type" defaultValue={section.renderType} className={inputCls}>
                {RENDER_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>{rt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Posición en el Hub</label>
              <input name="order_index" type="number" defaultValue={section.orderIndex} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Título introductorio</label>
              <input name="intro_title" defaultValue={section.introTitle ?? ""} className={inputCls} placeholder="Opcional" />
            </div>
            <div>
              <label className={labelCls}>Texto de introducción</label>
              <textarea name="intro" defaultValue={section.intro ?? ""} className={textareaCls} rows={3} placeholder="Opcional" />
            </div>
            <button type="submit" className={btnPrimary}>
              <span className="hud-label text-[10px]">Guardar configuración</span>
            </button>
            <PreviewButton
              formId="section-config"
              fields={{ title: "intro_title", content: "intro" }}
              label="Vista previa de la intro"
            />
          </form>

          {/* Visibilidad al público — solo admin/supremo */}
          {userCanPublish && (
            <div className="mt-6 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <p className="mb-1 font-title text-[10px] font-bold tracking-widest text-white/35">
                VISIBILIDAD
              </p>
              <p className="mb-3 text-[11px] leading-snug text-white/40">
                {section.isPublished
                  ? "Esta sección se ve en la web aunque no hayas iniciado sesión."
                  : "Oculta: solo el equipo la ve. El público no la verá en la web."}
              </p>
              <form action={setSectionPublished}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="value" value={String(!section.isPublished)} />
                <button
                  type="submit"
                  className={`btn-hud w-full px-3 py-2 ${section.isPublished ? "bg-white/8 text-white/65 hover:text-white" : "bg-brand text-white"}`}
                >
                  <span className="hud-label text-[10px]">
                    {section.isPublished ? "Ocultar al público" : "Mostrar al público"}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Zona peligrosa — solo admin/supremo */}
          {userCanPublish && (
            <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
              <p className="mb-2 font-title text-[10px] font-bold text-red-300/80">Eliminar sección</p>
              <form action={deleteSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="game_id" value={gameId} />
                <ConfirmButton
                  message={`¿Eliminar "${section.title}" y todos sus bloques?`}
                  className={btnDanger}
                >
                  <span className="hud-label text-[10px]">Eliminar</span>
                </ConfirmButton>
              </form>
            </div>
          )}
        </div>

        {/* Col der: bloques — índice + editor (master-detail) */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <SectionBlocksEditor sectionId={section.id} blocks={blocks} />
        </div>
      </div>
    </div>
  );
}
