"use client";

// Escenario de las Leyendas (Salón de la Fama): monta el motor three.js
// (src/lib/fama/escenario.ts) sobre un canvas y pone debajo de cada personaje
// su nombre y su guild como botones reales (se pueden recorrer con Tab y
// disparan el gesto igual que el ratón). Si no hay WebGL, o el navegador pide
// ahorrar datos, queda la fila estática con las mismas imágenes.
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Escenario, hayWebGL } from "@/lib/fama/escenario";
import { rutaArte, type Leyenda } from "@/lib/fama/leyendas";

export function LegendsStage({ leyendas }: { leyendas: Leyenda[] }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const etiquetas = useRef<Record<string, HTMLElement | null>>({});
  const contenedor = useRef<HTMLDivElement>(null);
  const motor = useRef<Escenario | null>(null);

  // El hover NO pasa por el estado de React: cambiar de personaje volvería a
  // pintar los 19 botones. Se tocan las clases directamente, que es lo único
  // que cambia, y así el barrido rápido del ratón no cuesta ningún render.
  const marcarHover = (id: string | null) => {
    contenedor.current?.classList.toggle("is-alguno", !!id);
    for (const [clave, el] of Object.entries(etiquetas.current)) {
      el?.classList.toggle("is-on", clave === id);
    }
  };

  useEffect(() => {
    const h = host.current;
    const c = canvas.current;
    if (!h || !c) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!hayWebGL() || conn?.saveData) {
      h.classList.add("is-estatico");
      return;
    }
    h.classList.add("is-cargando");
    let esc: Escenario;
    try {
      esc = new Escenario({
        canvas: c,
        host: h,
        leyendas,
        reducirMovimiento: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        etiquetas: () => etiquetas.current,
        onHover: marcarHover,
        onListo: () => h.classList.add("is-3d"),
      });
    } catch {
      h.classList.remove("is-cargando");
      h.classList.add("is-estatico");
      return;
    }
    motor.current = esc;
    // el arte (unos 70 KB por leyenda) se pide cuando la sección se acerca
    let temporizador = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        esc.cargar();
        io.disconnect();
        // si el arte no llega (red caída, 404), que al menos se vea la fila estática
        temporizador = window.setTimeout(() => {
          if (h.classList.contains("is-3d") || motor.current !== esc) return;
          esc.destruir();
          motor.current = null;
          h.classList.remove("is-cargando");
          h.classList.add("is-estatico");
        }, 15000);
      },
      { rootMargin: "700px" }
    );
    io.observe(h);
    return () => {
      io.disconnect();
      window.clearTimeout(temporizador);
      if (motor.current === esc) esc.destruir();
      motor.current = null;
      h.classList.remove("is-cargando", "is-3d", "is-estatico");
    };
  }, [leyendas]);

  return (
    <div ref={host} className="ly-stage">
      <canvas ref={canvas} className="ly-canvas" aria-hidden />

      {/* nombre y guild bajo cada personaje; el motor los coloca en cada frame */}
      <div ref={contenedor} className="ly-etiquetas">
        {leyendas.map((l) => (
          <button
            key={l.id}
            ref={(el) => {
              etiquetas.current[l.id] = el;
            }}
            type="button"
            className="ly-etiqueta"
            style={{ "--c": l.color } as CSSProperties}
            aria-label={`${l.nombre}, ${l.guild}`}
            onPointerEnter={() => motor.current?.hover(l.id)}
            onPointerLeave={() => motor.current?.hover(null)}
            onFocus={() => motor.current?.hover(l.id)}
            onBlur={() => motor.current?.hover(null)}
          >
            <span className="ly-nombre">{l.nombre}</span>
            <span className="ly-guild">{l.guild}</span>
          </button>
        ))}
      </div>

      {/* respaldo: sin WebGL (o sin JavaScript) se ve esta fila */}
      <div className="ly-static">
        {leyendas.map((l) => (
          <figure key={l.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={rutaArte(l.id)} alt={l.nombre} loading="lazy" decoding="async" />
            <figcaption>
              <span className="ly-nombre">{l.nombre}</span>
              <span className="ly-guild">{l.guild}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
