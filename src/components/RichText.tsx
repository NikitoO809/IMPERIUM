// Renderiza el texto plano de los pasos de una guía con formato HUD.
// El contenido scrapeado viene como texto con convenciones simples; aquí las
// detectamos y las maquetamos en vez de volcarlo todo como párrafos planos:
//   · Tablas        → líneas con " | " (la primera fila es la cabecera).
//   · Listas        → líneas que empiezan con "- ", "• " o "* ".
//   · Listas num.   → líneas que empiezan con "1. ", "2) ", etc.
//   · Párrafos      → el resto; cada salto de línea simple se respeta.
//   · Fichas        → bloque con prefijo __SKILLS__ (icono + nombre + explicación).
// Reutiliza el mismo look de tabla que SectionContent (HudTable).
import type { ReactNode } from "react";
import { IconList, SKILLS_PREFIX } from "@/components/IconList";

const BULLET_RE = /^[-•*]\s+/;
const NUM_RE = /^\d+[.)]\s+/;

// ── Tabla HUD a partir de filas separadas por "|" ─────────────────
function TextTable({ lines }: { lines: string[] }) {
  const rows = lines.map((l) => l.split("|").map((c) => c.trim()));
  const headers = rows[0];
  const body = rows.slice(1);
  const cols = headers.length;
  return (
    <div className="my-3 overflow-x-auto rounded border border-white/10">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-brand/20">
            {headers.map((h, i) => (
              <th
                key={i}
                className="hud-label whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold text-accent/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((cells, r) => (
            <tr
              key={r}
              className="border-b border-white/5 transition-colors odd:bg-white/[0.02] hover:bg-brand/10"
            >
              {Array.from({ length: cols }).map((_, ci) => (
                <td
                  key={ci}
                  className={`whitespace-nowrap px-3 py-2.5 ${
                    ci === 0 ? "font-semibold text-white/85" : "text-white/60"
                  }`}
                >
                  {cells[ci]?.trim() || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Un bloque (separado por línea en blanco) ──────────────────────
function Block({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  // ¿Es una tabla? (≥2 filas y la mayoría con separador "|")
  const pipeLines = lines.filter((l) => l.includes("|"));
  if (lines.length >= 2 && pipeLines.length >= Math.ceil(lines.length * 0.6)) {
    return <TextTable lines={lines} />;
  }

  // Recorre las líneas agrupando viñetas / numeradas consecutivas.
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    if (BULLET_RE.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && BULLET_RE.test(lines[i])) {
        items.push(lines[i].replace(BULLET_RE, ""));
        i++;
      }
      out.push(
        <ul key={key++} className="my-1 space-y-2">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2.5 text-base leading-relaxed text-white/70">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (NUM_RE.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && NUM_RE.test(lines[i])) {
        items.push(lines[i].replace(NUM_RE, ""));
        i++;
      }
      out.push(
        <ol key={key++} className="my-1 space-y-2">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2.5 text-base leading-relaxed text-white/70">
              <span className="hud-label mt-1 shrink-0 text-[11px] font-bold text-accent/70">
                {String(j + 1).padStart(2, "0")}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }
    // Línea normal → párrafo (se respeta el salto de línea simple).
    out.push(
      <p key={key++} className="text-base leading-relaxed text-white/70">
        {lines[i]}
      </p>
    );
    i++;
  }
  return <div className="space-y-2">{out}</div>;
}

export function RichText({ content, className = "" }: { content: string; className?: string }) {
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((b, i) =>
        b.startsWith(SKILLS_PREFIX) ? (
          <IconList key={i} raw={b.slice(SKILLS_PREFIX.length)} />
        ) : (
          <Block key={i} text={b} />
        )
      )}
    </div>
  );
}
