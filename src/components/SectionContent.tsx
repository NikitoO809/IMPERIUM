// Render genérico del contenido de una sección de juego (intro + bloques).
// Mismo estilo HUD que la página de guía, pero SIN casillas de progreso.
import Image from "next/image";
import { Panel } from "@/components/hud";
import type { SectionContent as SectionData } from "@/lib/sections";

// ── Rejillas de imágenes según cantidad ──────────────────────────────────────

// 1 imagen sola (no en bloque inline) → cuadrado centrado, object-contain
function SingleImage({ src }: { src: string }) {
  return (
    <div className="mt-4 flex justify-center">
      <div className="bevel relative h-48 w-48 overflow-hidden border border-white/15 bg-black/40">
        <Image src={src} alt="" fill sizes="192px" unoptimized className="object-contain p-2" />
      </div>
    </div>
  );
}

// 2–8 imágenes → grid compacto, cuadrado, object-contain con fondo oscuro
function SmallGrid({ images }: { images: string[] }) {
  const cols = images.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4";
  return (
    <div className={`mt-4 grid gap-2 ${cols}`}>
      {images.map((src) => (
        <div key={src} className="bevel relative aspect-square overflow-hidden border border-white/10 bg-black/40">
          <Image src={src} alt="" fill sizes="(max-width: 640px) 50vw, 25vw" unoptimized className="object-contain p-1" />
        </div>
      ))}
    </div>
  );
}

// >8 imágenes → galería horizontal scrollable, iconos pequeños y nítidos
function ScrollGallery({ images }: { images: string[] }) {
  return (
    <div className="mt-4">
      <p className="mb-2 hud-label text-[9px] text-white/35">{images.length} IMÁGENES</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src) => (
          <div key={src} className="bevel relative h-16 w-16 shrink-0 overflow-hidden border border-white/10 bg-black/40">
            <Image src={src} alt="" fill sizes="64px" unoptimized className="object-contain p-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Imagen intro de sección → landscape, object-cover está bien aquí
function IntroImage({ src }: { src: string }) {
  return (
    <div className="bevel relative mt-4 aspect-video w-full overflow-hidden border border-white/10">
      <Image src={src} alt="" fill sizes="(max-width: 1024px) 100vw, 768px" unoptimized className="object-cover" />
    </div>
  );
}

// ── Tabla HUD (bloques con prefijo __TABLE__) ─────────────────────────────────

// ── Tabla de Artefactos con imágenes (prefijo __ARTIFACT_TABLE__) ─────────────

type ArtifactRow = {
  name: string;
  artifact_img: string;
  tier: string;
  types: string;
  hero_images: string[];
  hero_label: string;
  range: string;
  attributes: string;
};

const TIER_BADGE: Record<string, string> = {
  Legendary: "border-amber-400/60 text-amber-300 bg-amber-400/10",
  Epic:      "border-violet-400/60 text-violet-300 bg-violet-400/10",
  Elite:     "border-sky-400/60 text-sky-300 bg-sky-400/10",
  Advanced:  "border-emerald-400/60 text-emerald-300 bg-emerald-400/10",
};

function ArtifactTable({ raw }: { raw: string }) {
  let rows: ArtifactRow[];
  try { rows = JSON.parse(raw); } catch { return <p className="text-red-400 text-sm mt-2">Error al cargar tabla.</p>; }

  return (
    <div className="mt-4 overflow-x-auto rounded border border-white/10">
      {/* Cabecera */}
      <div className="grid grid-cols-[140px_1fr_180px_70px_1fr] gap-0 border-b border-white/10 bg-brand/20 px-3 py-2">
        {["Artefacto", "Tipo", "Héroes sugeridos", "Rango", "Atributos"].map((h) => (
          <span key={h} className="hud-label text-[9px] text-accent/70 font-semibold">{h}</span>
        ))}
      </div>

      {/* Filas */}
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-[140px_1fr_180px_70px_1fr] gap-0 items-center border-b border-white/5 px-3 py-3 odd:bg-white/[0.02] hover:bg-brand/10 transition-colors"
        >
          {/* Artefacto: imagen + nombre + tier */}
          <div className="flex items-center gap-2 pr-3">
            {row.artifact_img && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-white/15 bg-black/40">
                <Image src={row.artifact_img} alt={row.name} fill sizes="40px" unoptimized className="object-contain p-0.5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/90 leading-tight">{row.name}</p>
              <span className={`mt-0.5 inline-block rounded border px-1 py-px text-[8px] font-bold hud-label ${TIER_BADGE[row.tier] ?? "border-white/20 text-white/40"}`}>
                {row.tier}
              </span>
            </div>
          </div>

          {/* Tipo */}
          <div className="pr-3 text-xs text-white/55">{row.types || "—"}</div>

          {/* Héroes */}
          <div className="flex flex-wrap gap-1 pr-3">
            {row.hero_images.slice(0, 6).map((src, j) => (
              <div key={j} className="relative h-8 w-8 shrink-0 overflow-hidden rounded border border-white/10 bg-black/40">
                <Image src={src} alt="" fill sizes="32px" unoptimized className="object-cover" />
              </div>
            ))}
            {row.hero_label && !["Any", "Melee", "Ranged"].includes(row.hero_label) ? null : (
              row.hero_label ? <span className="self-center text-[10px] text-white/40">{row.hero_label}</span> : null
            )}
          </div>

          {/* Rango */}
          <div className="pr-3 text-xs text-white/55">{row.range || "—"}</div>

          {/* Atributos */}
          <div className="text-xs text-white/65 leading-relaxed">{row.attributes || "—"}</div>
        </div>
      ))}
    </div>
  );
}

const TIER_COLOR: Record<string, string> = {
  Legendary: "text-amber-300/90",
  Epic:      "text-violet-300/90",
  Elite:     "text-sky-300/90",
  Advanced:  "text-emerald-300/80",
};

function HudTable({ raw }: { raw: string }) {
  let data: { headers: string[]; rows: Record<string, string>[] };
  try {
    data = JSON.parse(raw);
  } catch {
    return <p className="mt-2 text-sm text-red-400">Error al cargar tabla.</p>;
  }
  const { headers, rows } = data;
  return (
    <div className="mt-4 overflow-x-auto rounded border border-white/10">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-brand/20">
            {headers.map((h) => (
              <th key={h} className="hud-label px-3 py-2 text-[9px] text-accent/70 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const tier = row["Tier"] ?? "";
            const tierClass = TIER_COLOR[tier] ?? "text-white/70";
            return (
              <tr
                key={i}
                className="border-b border-white/5 odd:bg-white/[0.02] hover:bg-brand/10 transition-colors"
              >
                {headers.map((h, ci) => (
                  <td
                    key={h}
                    className={`px-3 py-2 whitespace-nowrap ${ci === 0 ? "font-semibold text-white/90" : ci === 1 ? tierClass : "text-white/55"}`}
                  >
                    {row[h] || "—"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Selector automático
function ImageDisplay({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  if (images.length === 1) return <SingleImage src={images[0]} />;
  if (images.length <= 8) return <SmallGrid images={images} />;
  return <ScrollGallery images={images} />;
}

// ── Componente principal ──────────────────────────────────────────────────────

export function SectionContent({ section }: { section: SectionData }) {
  return (
    <div>
      {/* Bloque de introducción */}
      {(section.intro || section.introTitle) && (
        <Panel corners className="mb-6">
          <div className="panel-inner p-5">
            {section.introTitle && (
              <h2 className="mb-2 font-title text-lg font-bold text-glow-accent">
                {section.introTitle}
              </h2>
            )}
            {section.intro?.split("\n\n").map((para, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-white/65">{para}</p>
            ))}
            {section.introImages.length > 0 && <IntroImage src={section.introImages[0]} />}
          </div>
        </Panel>
      )}

      {/* Bloques de contenido */}
      <div className="space-y-3">
        {section.blocks.map((block) => (
          <Panel key={block.id}>
            <div className="panel-inner p-4">
              {/* Cabecera */}
              <div className="flex items-center gap-2">
                <span className="hud-label text-[9px] text-accent/50">
                  {String(block.orderIndex).padStart(2, "0")}
                </span>
                {block.isVerified
                  ? <span className="hud-label text-[8px] text-emerald-400/70">✓ verificado</span>
                  : <span className="hud-label text-[8px] text-white/20">sin verificar</span>}
              </div>

              {/* Contenido: tabla artefactos, tabla genérica, icono+texto, o texto normal */}
              {block.content.startsWith("__ARTIFACT_TABLE__") ? (
                <>
                  {block.title && (
                    <h3 className="mt-1 font-title text-base font-bold">{block.title}</h3>
                  )}
                  <ArtifactTable raw={block.content.slice("__ARTIFACT_TABLE__".length)} />
                </>
              ) : block.content.startsWith("__TABLE__") ? (
                <>
                  {block.title && (
                    <h3 className="mt-1 font-title text-base font-bold">{block.title}</h3>
                  )}
                  <HudTable raw={block.content.slice("__TABLE__".length)} />
                </>
              ) : block.images.length === 1 ? (
                // 1 imagen → icono a la derecha del texto (artefactos individuales)
                <div className="mt-1 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {block.title && (
                      <h3 className="font-title text-base font-bold">{block.title}</h3>
                    )}
                    {block.content.split("\n\n").map((para, i) => (
                      <p key={i} className="mt-1.5 text-sm leading-relaxed text-white/55">{para}</p>
                    ))}
                  </div>
                  <div className="bevel relative h-20 w-20 shrink-0 overflow-hidden border border-white/15 bg-black/40">
                    <Image
                      src={block.images[0]}
                      alt={block.title}
                      fill
                      sizes="80px"
                      unoptimized
                      className="object-contain p-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {block.title && (
                    <h3 className="mt-1 font-title text-base font-bold">{block.title}</h3>
                  )}
                  {block.content.split("\n\n").map((para, i) => (
                    <p key={i} className="mt-1.5 text-sm leading-relaxed text-white/55">{para}</p>
                  ))}
                  <ImageDisplay images={block.images} />
                </>
              )}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
