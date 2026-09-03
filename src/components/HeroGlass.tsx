"use client";

// Hero de la portada — marco grande con el emblema arcano 3D de fondo
// (HeroEmblem), insignia + título + reclamo en el centro, borde de vidrio
// acanalado, una tarjeta de cristal con los miembros en vivo y la entrada con
// Discord, y una pestaña en la esquina inferior derecha que sale del marco
// hacia las guías. La pestaña se recorta del marco con clip-path (se
// recalcula al cambiar de tamaño): así el fondo de la página se ve a través,
// con las curvas invertidas.
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { HeroEmblem } from "@/components/HeroEmblem";

const NAME = "IMPERIUM";
import { LoginButton } from "@/components/auth/LoginButton";
import { ArrowUpRight } from "@/components/ui/GlassCard";
import { DiscordIcon } from "@/components/icons";

const R = 28; // radio de las esquinas del marco
const C = 24; // radio de las curvas de la pestaña

// Contorno del marco (en px) con la pestaña recortada abajo a la derecha.
// Sin pestaña (móvil), es un rectángulo redondeado normal.
function framePath(w: number, h: number, tw: number, th: number) {
  const right =
    tw > 0 && th > 0
      ? `V${h - th - C} A${C},${C} 0 0 1 ${w - C},${h - th} H${w - tw + C} A${C},${C} 0 0 0 ${w - tw},${h - th + C} V${h - C} A${C},${C} 0 0 1 ${w - tw - C},${h}`
      : `V${h - R} A${R},${R} 0 0 1 ${w - R},${h}`;
  return `path("M${R},0 H${w - R} A${R},${R} 0 0 1 ${w},${R} ${right} H${R} A${R},${R} 0 0 1 0,${h - R} V${R} A${R},${R} 0 0 1 ${R},0 Z")`;
}

export function HeroGlass({ members, online }: { members: string; online: string }) {
  const box = useRef<HTMLDivElement>(null);
  const tab = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => {
      const t = tab.current;
      el.style.clipPath = framePath(el.offsetWidth, el.offsetHeight, t?.offsetWidth ?? 0, t?.offsetHeight ?? 0);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (tab.current) ro.observe(tab.current);
    update();
    return () => ro.disconnect();
  }, []);

  return (
    <section className="sh-wrap">
      <div className="sh-frame">
        <div ref={box} className="sh-hero">
          <HeroEmblem />
          <div className="sh-tone" aria-hidden />
          <div className="sh-flute" aria-hidden />

          <div className="sh-mid">
            <span className="sh-badge">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2l1.9 5.8L19.8 9l-4.7 3.5 1.7 5.9L12 15l-4.8 3.4 1.7-5.9L4.2 9l5.9-1.2z" />
              </svg>
              Comunidad de Discord · ES
            </span>
            {/* cuatro capas del mismo texto: halo, base oscura, cara metálica
                letra a letra y destello — el lector de pantalla solo oye el nombre */}
            <h1 className="sh-title" aria-label={NAME}>
              <span className="sh-word" aria-hidden>
                <span className="sh-word-halo">{NAME}</span>
                <span className="sh-word-depth">{NAME}</span>
                <span className="sh-word-face">
                  {NAME.split("").map((ch, i) => (
                    <span key={i} className="sh-letter" style={{ "--i": i } as CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
                <span className="sh-word-sheen">{NAME}</span>
              </span>
            </h1>
            <span className="sh-orn" aria-hidden>
              <i />
              <b />
              <i />
            </span>
            <p className="sh-claim">
              Una comunidad que juega junta. Guías paso a paso, tu progreso guardado y
              gente con quien jugar.
            </p>
          </div>

          <div className="sh-stat">
            <b>{members}</b>
            <span>Miembros en Discord</span>
            <em>
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
              {online} en línea ahora
            </em>
            <LoginButton className="pill pill-primary">
              <DiscordIcon className="h-5 w-5" />
              <span>Entrar con Discord</span>
              <span className="icon-badge"><ArrowUpRight className="h-4 w-4" /></span>
            </LoginButton>
          </div>
        </div>

        <Link ref={tab} href="/juegos" className="sh-doc">
          <span className="sh-doc-circ" aria-hidden><ArrowUpRight /></span>
          <span>
            <span className="sh-doc-t">Ver las guías</span>
            <span className="sh-doc-s">Call of Dragons, ROOC y más ›</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
