// Barra flotante para cambiar entre maquetas. Visible en cada variante.
import Link from "next/link";

export const VARIANTS = [
  { slug: "neon", n: "01", label: "Neón HUD" },
  { slug: "constelacion", n: "02", label: "Constelación" },
  { slug: "imperial", n: "03", label: "Imperial" },
  { slug: "retro", n: "04", label: "Retro" },
];

export function VariantNav({ current }: { current: string }) {
  return (
    <div className="fixed inset-x-0 bottom-4 z-[80] flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/70 px-2 py-2 backdrop-blur-md">
        <Link
          href="/maquetas"
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/60 transition hover:text-white"
          title="Volver a la galería"
        >
          ← Galería
        </Link>
        <span className="mx-1 h-4 w-px bg-white/15" />
        {VARIANTS.map((v) => {
          const active = v.slug === current;
          return (
            <Link
              key={v.slug}
              href={`/maquetas/${v.slug}`}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                active
                  ? "bg-white text-black"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="opacity-50">{v.n}</span> {v.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
