// Lista de fichas con icono + nombre + explicación (habilidades, mascotas, cartas...).
// Resuelve el problema de tener los iconos sueltos al final del paso: cada icono
// queda pegado al texto que lo explica, que es lo que necesita quien no conoce el juego.
// Se usa con el prefijo mágico __SKILLS__ dentro del content de un paso o bloque.
import Image from "next/image";

export const SKILLS_PREFIX = "__SKILLS__";

type IconItem = {
  name: string;
  img?: string;
  tag?: string; // prioridad ("Al máximo", "1 punto") o etiqueta corta
  desc?: string;
};

export function IconList({ raw }: { raw: string }) {
  let items: IconItem[];
  try {
    items = JSON.parse(raw);
  } catch {
    return <p className="my-2 text-sm text-red-400">Error al cargar la lista.</p>;
  }
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="my-3 space-y-2">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex gap-3 rounded border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-brand/5"
        >
          {it.img && (
            <div className="bevel relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-black/40">
              <Image src={it.img} alt={it.name} fill sizes="56px" unoptimized className="object-contain p-1" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-title text-sm font-bold text-white/90">{it.name}</h4>
              {it.tag && (
                <span className="hud-label rounded border border-accent/40 bg-accent/10 px-1.5 py-px text-[9px] text-accent">
                  {it.tag}
                </span>
              )}
            </div>
            {it.desc && <p className="mt-1.5 text-sm leading-relaxed text-white/65">{it.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
