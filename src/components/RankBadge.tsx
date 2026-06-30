// Insignia de rango reutilizable. Muestra el nombre del rango con su color HUD
// (Recluta gris · Veterano bronce · Fundador cian · Leyenda oro · equipo…).
// Componente puro: sirve en servidor y cliente. Reutilízalo en perfiles,
// discusión, alianzas, etc. — NO reinventes el badge.
import { RANK_LABEL, RANK_BADGE, type Rank } from "@/lib/ranks";

export function RankBadge({ rank, className = "" }: { rank: Rank; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${RANK_BADGE[rank]} ${className}`}
    >
      {RANK_LABEL[rank]}
    </span>
  );
}
