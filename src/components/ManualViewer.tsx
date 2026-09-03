"use client";

// Visor del Manual de Atreia.
//
// Pinta una guía entera desde sus datos y la cambia de idioma al vuelo, sin
// recargar. La elección de idioma se guarda en el navegador, así que la
// próxima vez entras directamente en el que dejaste.
//
// Todo el contenido vive en src/lib/manual/<clase>.ts — aquí solo hay pintura.
//
// Quién puede verlo lo decide la página que lo monta: el visor no sabe nada de
// permisos, solo recibe a dónde vuelve el enlace del índice.
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Bloque, Guia, Par, Seccion } from "@/lib/manual/tipos";

type Lang = "es" | "en";
type Modo = "pve" | "pvp";

const CLAVE_IDIOMA = "manual-atreia-lang";
const EVENTO = "manual-atreia-lang-cambio";

// El idioma vive en localStorage, que para React es un sistema externo. Se lee
// con useSyncExternalStore en vez de con un efecto: así no hay setState
// sincrónico al montar (que dispara renders en cascada) y el servidor pinta
// siempre en español hasta que el navegador dice otra cosa.
const idiomaStore = {
  subscribe(avisar: () => void) {
    window.addEventListener(EVENTO, avisar);
    window.addEventListener("storage", avisar);
    return () => {
      window.removeEventListener(EVENTO, avisar);
      window.removeEventListener("storage", avisar);
    };
  },
  leer(): Lang {
    try {
      return localStorage.getItem(CLAVE_IDIOMA) === "en" ? "en" : "es";
    } catch {
      return "es";
    }
  },
  guardar(nuevo: Lang) {
    try {
      localStorage.setItem(CLAVE_IDIOMA, nuevo);
    } catch {
      /* sin almacenamiento: el cambio vale para esta visita */
    }
    window.dispatchEvent(new Event(EVENTO));
  },
};

/** Convierte los **asteriscos** del contenido en negrita de verdad. */
function ricos(texto: string): React.ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
    trozo.startsWith("**") && trozo.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {trozo.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{trozo}</span>
    )
  );
}

export function ManualViewer({ guia, volverA }: { guia: Guia; volverA: string }) {
  const lang = useSyncExternalStore(idiomaStore.subscribe, idiomaStore.leer, () => "es" as Lang);
  const [modo, setModo] = useState<Modo>("pve");
  // Se lee una sección cada vez. Antes iban todas seguidas y la guía del
  // Gladiator eran once pantallas de rueda de ratón para llegar al final.
  const [activa, setActiva] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  const t = (par: Par) => par[lang];
  const acento = guia.acento;
  const sec = guia.secciones[activa];
  const esPortada = activa === 0;

  // Al cambiar de sección se vuelve arriba: si no, entras a media página.
  const irA = (i: number) => {
    setActiva(i);
    panel.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="flex h-full flex-col" style={{ ["--acento" as string]: acento }}>
      {/* Barra: título, idioma y vuelta al índice */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0d0d14]/95 px-8 py-3 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href={volverA} className="font-hud text-[10px] tracking-[0.2em] text-white/40 hover:text-white/80">
            ← {lang === "es" ? "ÍNDICE" : "INDEX"}
          </Link>
          <h1 className="font-title text-lg font-extrabold tracking-wide" style={{ color: acento }}>
            {guia.nombre}
          </h1>

          <div className="ml-auto flex items-center gap-1 border border-white/15">
            {(["es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => idiomaStore.guardar(l)}
                aria-pressed={lang === l}
                className={`px-3 py-1.5 font-hud text-[11px] tracking-[0.16em] transition-colors ${
                  lang === l ? "bg-white/90 text-black" : "text-white/50 hover:text-white"
                }`}
              >
                {l === "es" ? "ESPAÑOL" : "ENGLISH"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div ref={panel} className="flex flex-1 flex-col scroll-smooth overflow-auto">
        {/* Portada. Entera solo al entrar; luego se encoge a una banda, que el
            arte no puede comerse la pantalla en cada sección. */}
        <div
          className="relative overflow-hidden border-b border-white/10"
          style={{ background: `radial-gradient(700px 260px at 8% -30%, ${acento}22, transparent 70%)` }}
        >
          {/* El arte acompaña, no compite: se funde por la izquierda para que el texto siga leyéndose. */}
          {guia.portada.arte && (
            <>
              <Image
                src={guia.portada.arte}
                alt=""
                fill
                sizes="100vw"
                unoptimized
                priority
                className="pointer-events-none select-none object-cover object-[70%_22%] opacity-50"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0d14] via-[#0d0d14]/90 to-[#0d0d14]/20" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0d14] to-transparent" />
              <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
            </>
          )}
          <div className={`relative mx-auto w-full max-w-[1680px] px-8 ${esPortada ? "py-8" : "py-4"}`}>
            <div className="font-hud text-[10px] tracking-[0.24em]" style={{ color: acento }}>
              {t(esPortada ? guia.portada.eyebrow : sec.eyebrow).toUpperCase()}
            </div>

            {esPortada ? (
              <>
                <h2 className="mt-2 font-title text-5xl font-extrabold tracking-tight">{guia.portada.titulo}</h2>
                <p className="mt-3 max-w-[70ch] text-[18px] leading-relaxed text-white/70">
                  {ricos(t(guia.portada.lede))}
                </p>

                {guia.portada.cifras && (
                  <div className="mt-6 flex flex-wrap gap-8 border-t border-white/10 pt-5">
                    {guia.portada.cifras.map((c) => (
                      <div key={c.valor}>
                        <div className="font-title text-2xl font-extrabold" style={{ color: acento }}>
                          {c.valor}
                        </div>
                        <div className="font-hud text-[9px] tracking-[0.16em] text-white/35">
                          {t(c.etiqueta).toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <h2 className="mt-1 font-title text-3xl font-extrabold tracking-tight">{t(sec.titulo)}</h2>
            )}
          </div>
        </div>

        {/* Cuerpo: el índice manda a la sección, no salta dentro de un rollo
            infinito. En pantalla estrecha se convierte en una tira de pestañas. */}
        <div className="mx-auto flex w-full max-w-[1680px] flex-1 gap-10 px-8 pb-12">
          <nav
            className="sticky top-4 hidden w-60 shrink-0 self-start lg:block"
            aria-label={lang === "es" ? "Secciones de la guía" : "Guide sections"}
          >
            <div className="font-hud text-[10px] tracking-[0.24em] text-white/30">
              {lang === "es" ? "SECCIONES" : "SECTIONS"}
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {guia.secciones.map((s2, i) => {
                const aqui = i === activa;
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => irA(i)}
                      aria-current={aqui ? "true" : undefined}
                      className={`group relative block w-full py-2.5 pl-4 pr-3 text-left text-[14px] leading-snug transition-transform duration-200 ${
                        aqui ? "text-white" : "text-white/65 hover:translate-x-1 hover:text-white"
                      }`}
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px))",
                        background: aqui
                          ? `linear-gradient(90deg, ${acento}33, ${acento}0d 55%, transparent)`
                          : "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012))",
                      }}
                    >
                      {/* la barra de la izquierda: encendida en la que estás */}
                      <span
                        className="absolute inset-y-0 left-0 w-[3px] transition-all duration-200"
                        style={{
                          background: aqui ? acento : "rgba(255,255,255,0.14)",
                          boxShadow: aqui ? `0 0 10px ${acento}` : "none",
                        }}
                      />
                      {/* un roce de color al pasar por encima */}
                      {!aqui && (
                        <span
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          style={{ background: `linear-gradient(90deg, ${acento}26, transparent 75%)` }}
                        />
                      )}
                      <span className="relative flex items-baseline gap-2.5">
                        <span
                          className="font-mono text-[11px] tabular-nums transition-colors"
                          style={{ color: aqui ? acento : "rgba(255,255,255,0.38)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{t(s2.titulo)}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* El mismo índice, en horizontal, cuando no cabe la columna */}
            <div className="-mx-8 mb-4 flex gap-1 overflow-x-auto px-8 lg:hidden">
              {guia.secciones.map((s2, i) => {
                const aqui = i === activa;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => irA(i)}
                    aria-current={aqui ? "true" : undefined}
                    className={`btn-hud shrink-0 px-4 py-2 text-[13px] ${aqui ? "text-white" : "text-white/50"}`}
                    style={{
                      background: aqui
                        ? `linear-gradient(180deg, ${acento}59, ${acento}26)`
                        : "rgba(255,255,255,0.05)",
                      boxShadow: aqui ? `inset 0 0 0 1px ${acento}` : "inset 0 0 0 1px rgba(255,255,255,0.09)",
                    }}
                  >
                    <span className="mr-1.5 font-mono text-[11px] tabular-nums opacity-50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t(s2.titulo)}
                  </button>
                );
              })}
            </div>

            <SeccionView
              sec={sec}
              conTitulo={esPortada}
              lang={lang}
              modo={modo}
              setModo={setModo}
              acento={acento}
            />

            {/* Pasar página */}
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => irA(activa - 1)}
                disabled={activa === 0}
                className="btn-hud px-4 py-2 font-hud text-[11px] tracking-[0.16em] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:invisible"
                style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }}
              >
                ← {t(guia.secciones[Math.max(0, activa - 1)].titulo)}
              </button>
              <span className="font-mono text-[12px] text-white/25">
                {activa + 1} / {guia.secciones.length}
              </span>
              <button
                type="button"
                onClick={() => irA(activa + 1)}
                disabled={activa === guia.secciones.length - 1}
                className="btn-hud px-4 py-2 text-right font-hud text-[11px] tracking-[0.16em] transition-colors hover:brightness-110 disabled:invisible"
                style={{ background: `linear-gradient(180deg, ${acento}4d, ${acento}1a)`, boxShadow: `inset 0 0 0 1px ${acento}80`, color: "#fff" }}
              >
                {t(guia.secciones[Math.min(guia.secciones.length - 1, activa + 1)].titulo)} →
              </button>
            </div>

            {/* Las fuentes, al final del recorrido */}
            {activa === guia.secciones.length - 1 && (
              <div className="mt-8 border-l-2 py-4 pl-5" style={{ borderColor: acento }}>
                {guia.fuentes.map((f, i) => (
                  <p key={i} className={`max-w-[80ch] text-[15px] leading-relaxed text-white/60 ${i > 0 ? "mt-3" : ""}`}>
                    {ricos(t(f))}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Los bloques que llevan dentro su propia parrilla (habilidades, tarjetas,
// rotaciones…) piden la anchura entera; el texto corrido, las tablas y los
// avisos caben a media. Los subtítulos también van enteros: si entran en el
// reparto de columnas acaban al lado de la tabla que encabezan, y entonces ya
// no se sabe qué está titulando.
function ocupaTodo(b: Bloque): boolean {
  switch (b.t) {
    case "skills":
    case "especialidades":
    case "rotacion":
    case "pestanas":
    case "calculadora":
    case "fuentes":
    case "subtitulo":
      return true;
    case "tarjetas":
      return b.columnas !== 2;
    default:
      return false;
  }
}

/** Los bloques estrechos seguidos van juntos, para repartirlos en columnas. */
function enTramos(bloques: Bloque[]): { ancho: boolean; items: Bloque[] }[] {
  const tramos: { ancho: boolean; items: Bloque[] }[] = [];
  for (const b of bloques) {
    const ancho = ocupaTodo(b);
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.ancho === ancho && !ancho) ultimo.items.push(b);
    else tramos.push({ ancho, items: [b] });
  }
  return tramos;
}

function SeccionView({
  sec,
  conTitulo,
  lang,
  modo,
  setModo,
  acento,
}: {
  sec: Seccion;
  /** La banda de arriba ya lo enseña, salvo en la primera sección. */
  conTitulo: boolean;
  lang: Lang;
  modo: Modo;
  setModo: (m: Modo) => void;
  acento: string;
}) {
  const t = (par: Par) => par[lang];
  const bloques = sec.porModo ? [...sec.bloques, ...sec.porModo[modo]] : sec.bloques;

  return (
    <section className="pb-8 pt-5">
      {conTitulo && (
        <>
          <div className="font-hud text-[10px] tracking-[0.24em]" style={{ color: acento }}>
            {t(sec.eyebrow).toUpperCase()}
          </div>
          <h3 className="mb-3 mt-1.5 font-title text-[26px] font-extrabold tracking-wide">{t(sec.titulo)}</h3>
        </>
      )}

      {sec.intro?.map((p, i) => (
        <p key={i} className={`max-w-[80ch] text-[17px] leading-relaxed text-white/70 ${i > 0 ? "mt-3" : ""}`}>
          {ricos(t(p))}
        </p>
      ))}

      {sec.porModo && (
        <div className="mt-6 inline-flex border border-white/15">
          {(["pve", "pvp"] as Modo[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModo(m)}
              aria-pressed={modo === m}
              className={`px-6 py-2 font-hud text-xs tracking-[0.16em] transition-colors ${
                modo === m ? "text-black" : "text-white/50 hover:text-white"
              }`}
              style={modo === m ? { background: m === "pvp" ? acento : "#ffcf5a" } : undefined}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-5">
        {enTramos(bloques).map((tramo, i) =>
          tramo.ancho ? (
            <BloqueView key={i} b={tramo.items[0]} lang={lang} acento={acento} modo={modo} />
          ) : (
            // Dos columnas que se llenan por altura: sin huecos muertos al lado
            // de una tabla larga.
            <div key={i} className="xl:columns-2 xl:gap-5">
              {tramo.items.map((b, j) => (
                <div key={j} className="mb-5 break-inside-avoid last:mb-0 xl:mb-5">
                  <BloqueView b={b} lang={lang} acento={acento} modo={modo} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}

function BloqueView({ b, lang, acento, modo }: { b: Bloque; lang: Lang; acento: string; modo: Modo }) {
  const t = (par: Par) => par[lang];
  const colorModo = modo === "pvp" ? acento : "#ffcf5a";

  // El juego no está en español: leyendo en castellano hay que ver también
  // cómo se llama la habilidad en pantalla, que es lo que vas a buscar.
  const enElJuego = (nombre: Par, ko: string) => (lang === "es" ? `${nombre.en} · ${ko}` : ko);

  switch (b.t) {
    case "parrafo":
      return <p className="max-w-[80ch] text-[17px] leading-relaxed text-white/70">{ricos(t(b.texto))}</p>;

    case "subtitulo":
      return <h4 className="font-title text-[22px] font-bold tracking-wide">{t(b.texto)}</h4>;

    case "stats":
      return (
        <div className="border-t border-white/10">
          {b.filas.map((f, i) => (
            <div key={i} className="grid grid-cols-[1fr_110px_64px] items-center gap-4 border-b border-white/[0.06] py-3">
              <div>
                <div className="text-[16px]">{t(f.nombre)}</div>
                <div className="mt-0.5 text-[13px] text-white/45">{t(f.nota)}</div>
              </div>
              <div className="h-1.5 bg-white/10">
                <div className="h-full" style={{ width: `${f.pct}%`, background: f.top ? acento : "#7fa8c9" }} />
              </div>
              <div className="text-right font-mono text-[15px] tabular-nums" style={{ color: f.top ? acento : undefined }}>
                {lang === "es" ? f.pct.toString().replace(".", ",") : f.pct}%
              </div>
            </div>
          ))}
        </div>
      );

    case "tabla":
      return (
        <div className="overflow-x-auto border border-white/10 bg-black/20">
          <table className="w-full min-w-[420px] text-[15px]">
            <thead>
              <tr className="bg-white/[0.04]">
                {b.cabeceras.map((c, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2.5 font-hud text-[11px] tracking-[0.12em] text-white/50 ${
                      i === 0 && b.primeraNum ? "w-16 text-right" : "text-left"
                    }`}
                  >
                    {t(c).toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.filas.map((fila, i) => (
                <tr key={i} className="border-t border-white/[0.06]">
                  {fila.map((celda, j) => (
                    <td
                      key={j}
                      className={`px-4 py-2.5 align-top text-white/80 ${
                        j === 0 && b.primeraNum ? "text-right font-mono tabular-nums text-white/40" : ""
                      }`}
                    >
                      {ricos(t(celda))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "fuentes":
      return (
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {b.items.map((f, i) => (
            <div key={i} className="bg-[#12121a] p-5">
              <div className="font-mono text-2xl" style={{ color: "#7fa8c9" }}>
                {f.valor}
              </div>
              <div className="mt-2 font-title text-[17px] font-bold">{t(f.titulo)}</div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-white/60">{ricos(t(f.texto))}</p>
            </div>
          ))}
        </div>
      );

    case "tarjetas":
      return (
        <div className={`grid gap-4 ${b.columnas === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {b.items.map((c, i) => (
            <div key={i} className="border border-white/10 bg-[#12121a] p-5">
              <div className="font-title text-lg font-bold">{t(c.titulo)}</div>
              {c.sub && <div className="mt-0.5 text-[13px] text-white/45">{t(c.sub)}</div>}
              {c.ordenada ? (
                <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[15px] text-white/75 marker:text-white/30">
                  {c.puntos.map((p, j) => (
                    <li key={j}>{ricos(t(p))}</li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-3 flex flex-col gap-2 text-[15px] text-white/75">
                  {c.puntos.map((p, j) => (
                    <li key={j} className="relative pl-4">
                      <span className="absolute left-0 top-[7px] h-1.5 w-1.5 rotate-45" style={{ background: acento }} />
                      {ricos(t(p))}
                    </li>
                  ))}
                </ul>
              )}
              {c.nota && <p className="mt-3 border-t border-white/[0.06] pt-3 text-[13px] text-white/50">{t(c.nota)}</p>}
            </div>
          ))}
        </div>
      );

    case "skills":
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {b.items.map((s, i) => (
            <div key={i} className="border-l-2 bg-[#12121a] p-4" style={{ borderColor: colorModo }}>
              <span className="inline-block bg-white/[0.06] px-2 py-0.5 font-mono text-[11px]" style={{ color: colorModo }}>
                {t(s.orden)}
              </span>
              <div className="mt-2.5 flex items-center gap-3">
                {s.icono && (
                  <Image
                    src={s.icono}
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                    className="h-11 w-11 shrink-0 border border-white/10 bg-black/40 object-contain"
                  />
                )}
                <div className="min-w-0">
                  <div className="font-title text-lg font-bold">{t(s.nombre)}</div>
                  <div className="mt-0.5 font-mono text-xs text-white/35">{enElJuego(s.nombre, s.ko)}</div>
                </div>
              </div>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-white/70 marker:text-white/25">
                {s.puntos.map((p, j) => (
                  <li key={j}>{ricos(t(p))}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "especialidades":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {b.items.map((sk, i) => {
            // A un nivel aparecen varios efectos a la vez (alternativas) y en
            // los otros, uno solo. Si el juego obliga a elegir entre los del
            // mismo nivel no está en ninguna fuente: no se afirma aquí.
            const alternativas = sk.opciones.filter((o) => o.alternativa);
            const fijas = sk.opciones.filter((o) => !o.alternativa);
            return (
              <div key={i} className="border-l-2 bg-[#12121a] p-4" style={{ borderColor: colorModo }}>
                <div className="flex items-center gap-3">
                  {sk.icono && (
                    <Image
                      src={sk.icono}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 shrink-0 border border-white/10 bg-black/40 object-contain"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-title text-[17px] font-bold">{t(sk.nombre)}</div>
                    <div className="font-mono text-xs text-white/35">{enElJuego(sk.nombre, sk.ko)}</div>
                  </div>
                  {sk.anillo !== undefined && (
                    <div className="ml-auto shrink-0 text-right">
                      <div className="font-mono text-[15px] tabular-nums" style={{ color: acento }}>
                        {lang === "es" ? String(sk.anillo).replace(".", ",") : sk.anillo}%
                      </div>
                      <div className="font-hud text-[9px] tracking-[0.14em] text-white/35">
                        {lang === "es" ? "EN EL ANILLO" : "ON THE RING"}
                      </div>
                    </div>
                  )}
                </div>

                {sk.nota && <p className="mt-2.5 text-[14px] leading-relaxed text-white/60">{ricos(t(sk.nota))}</p>}

                {alternativas.length > 0 && (
                  <>
                    <div className="mt-3.5 font-hud text-[10px] tracking-[0.16em] text-white/35">
                      {lang === "es" ? `NIVEL ${alternativas[0].nivel}` : `LEVEL ${alternativas[0].nivel}`}
                    </div>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {alternativas.map((o, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 border border-white/[0.07] px-3 py-2 text-[15px]"
                          style={o.recomendada ? { borderColor: `${colorModo}66`, background: `${colorModo}14` } : undefined}
                        >
                          <span
                            className="mt-px shrink-0 font-mono text-[12px]"
                            style={{ color: o.recomendada ? colorModo : "rgba(255,255,255,0.3)" }}
                          >
                            {o.recomendada ? "✓" : j + 1}
                          </span>
                          <span className={o.recomendada ? "text-white" : "text-white/65"}>{ricos(t(o.efecto))}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {fijas.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1.5 border-t border-white/[0.06] pt-2.5">
                    {fijas.map((o, j) => (
                      <li key={j} className="flex gap-2.5 text-[14px] leading-snug text-white/60">
                        <span className="shrink-0 font-mono text-[12px] text-white/30">
                          {lang === "es" ? "nv" : "lv"} {o.nivel}
                        </span>
                        <span>{ricos(t(o.efecto))}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      );

    case "rotacion":
      return (
        <div className="border border-white/10 bg-[#12121a] p-6">
          <div className="font-title text-lg font-bold">{t(b.titulo)}</div>
          <div className="mt-0.5 text-[14px] text-white/45">{t(b.cuando)}</div>
          <div className="mt-4 flex flex-wrap items-stretch gap-2">
            {b.pasos.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-3 border-l-2 bg-white/[0.04] py-2 pl-3 pr-4"
                  style={{
                    borderColor: colorModo,
                    borderLeftWidth: p.clave ? 3 : 2,
                    background: p.clave ? `${colorModo}1f` : undefined,
                  }}
                >
                  <span className="font-mono text-[11px] text-white/30">{i + 1}</span>
                  {p.icono && (
                    <Image
                      src={p.icono}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      className="h-7 w-7 shrink-0 border border-white/10 bg-black/40 object-contain"
                    />
                  )}
                  <span className="text-[16px]">
                    {t(p.texto)}
                    {p.nota && <em className="mt-0.5 block text-[12px] not-italic text-white/45">{t(p.nota)}</em>}
                  </span>
                </div>
                {i < b.pasos.length - 1 && <span className="text-white/25">→</span>}
              </div>
            ))}
          </div>
        </div>
      );

    case "aviso":
      return (
        <div className="border-l-2 py-4 pl-5" style={{ borderColor: acento, background: `${acento}0d` }}>
          {b.parrafos.map((p, i) => (
            <p key={i} className={`max-w-[80ch] text-[16px] leading-relaxed text-white/75 ${i > 0 ? "mt-2.5" : ""}`}>
              {ricos(t(p))}
            </p>
          ))}
        </div>
      );

    case "pestanas":
      return <Pestanas items={b.items} lang={lang} acento={acento} modo={modo} />;

    case "calculadora":
      return <Calculadora lang={lang} acento={acento} />;
  }
}

function Pestanas({
  items,
  lang,
  acento,
  modo,
}: {
  items: { titulo: Par; bloques: Bloque[] }[];
  lang: Lang;
  acento: string;
  modo: Modo;
}) {
  const [activa, setActiva] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-white/10">
        {items.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiva(i)}
            aria-selected={activa === i}
            role="tab"
            className={`-mb-px border-b-2 px-4 py-2.5 text-[15px] transition-colors ${
              activa === i ? "text-white" : "border-transparent text-white/40 hover:text-white/80"
            }`}
            style={activa === i ? { borderColor: acento } : undefined}
          >
            {p.titulo[lang]}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {enTramos(items[activa].bloques).map((tramo, i) =>
          tramo.ancho ? (
            <BloqueView key={i} b={tramo.items[0]} lang={lang} acento={acento} modo={modo} />
          ) : (
            <div key={i} className="xl:columns-2 xl:gap-5">
              {tramo.items.map((b, j) => (
                <div key={j} className="mb-5 break-inside-avoid last:mb-0 xl:mb-5">
                  <BloqueView b={b} lang={lang} acento={acento} modo={modo} />
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── La calculadora de maestría ──────────────────────────────────────
// Experiencia ACUMULADA necesaria para completar cada nivel, medida por la
// comunidad coreana. Iniciación llega a 50; Profesional, a 70 tras el parche.
const INI = [
  0, 26, 54, 86, 120, 152, 185, 220, 256, 294, 334, 376, 420, 466, 514, 568, 627, 689, 755, 824, 896,
  1009, 1128, 1253, 1384, 1522, 1667, 1818, 1977, 2144, 2319, 2505, 2703, 2913, 3137, 3375, 3628,
  3897, 4183, 4487, 4810, 5154, 5519, 5907, 6320, 6759, 7226, 7722, 8249, 8809,
];
const PRO = [
  0, 602, 1223, 1862, 2522, 3202, 3903, 4625, 5370, 6138, 6930, 7750, 8600, 9481, 10394, 11339,
  12319, 13334, 14386, 15475, 16612, 17798, 19034, 20325, 21671, 23075, 24540, 26122, 27715, 29378,
  31113, 32922, 34810, 36780, 38833, 40976, 43211, 45541, 47973, 50510, 53155, 55916, 58795, 61797,
  64930, 68198, 71604, 75160, 78869, 82734, 87307, 92077, 97049, 102239, 107652, 113294, 119184,
  125327, 131730, 138414, 145796, 153490, 161521, 169898, 178629, 187742, 197247, 207155, 217497, 228283,
];

const PIEZAS = [
  { exp: 618, es: "Cuerno de dragón refinado, robusto", en: "Refined dragon horn, sturdy" },
  { exp: 868, es: "Cuerno de dragón refinado, preciso", en: "Refined dragon horn, precise" },
  { exp: 439, es: "Cuerno de dragón refinado, afilado", en: "Refined dragon horn, sharp" },
  { exp: 383, es: "Cuerno de dragón refinado, sólido", en: "Refined dragon horn, solid" },
  { exp: 600, es: "Guarda de oricalco de maestro", en: "Master's orichalcum guard" },
  { exp: 240, es: "Guarda de oricalco de artesano", en: "Artisan's orichalcum guard" },
  { exp: 84, es: "Guarda de oricalco", en: "Orichalcum guard" },
  { exp: 20, es: "Lingote de oricalco", en: "Orichalcum ingot" },
];

function Calculadora({ lang, acento }: { lang: Lang; acento: string }) {
  const [rango, setRango] = useState<"pro" | "ini">("pro");
  const [desde, setDesde] = useState(50);
  const [hasta, setHasta] = useState(70);
  const [exp, setExp] = useState(618);
  const [tasa, setTasa] = useState(100);

  const tabla = rango === "pro" ? PRO : INI;
  const tope = tabla.length - 1;
  const d = Math.min(Math.max(1, desde), tope);
  const h = Math.min(Math.max(1, hasta), tope);
  const falta = tabla[h] - tabla[d];
  // Un intento fallido entrega el 30% de lo que daría el acierto.
  const media = (tasa / 100) * exp + (1 - tasa / 100) * exp * 0.3;
  const intentos = falta > 0 ? Math.ceil(falta / media) : 0;
  const num = (n: number) => Math.round(n).toLocaleString(lang === "es" ? "es-ES" : "en-US");

  const et = {
    rango: { es: "Rango", en: "Tier" },
    tramo: { es: "Vas del nivel… al nivel", en: "From level… to level" },
    pieza: { es: "Qué fabricas", en: "What you are crafting" },
    exito: { es: "Cuántas te salen bien", en: "How many succeed" },
    fallo: {
      es: "Fallar no es tirar el material: un intento fallido te da igualmente el **30%** de la experiencia. Baja este control a tu tasa real y el cálculo cuenta también los fallos.",
      en: "Failing is not wasting materials: a failed attempt still gives you **30%** of the experience. Drop this to your real rate and the maths counts the failures too.",
    },
    veces: { es: "veces que tienes que fabricarlo", en: "times you have to craft it" },
    intentos: { es: "intentos, contando los fallos", en: "attempts, failures included" },
    malRango: { es: "el nivel de destino tiene que ser mayor", en: "the target level must be higher" },
    falta: { es: "Experiencia que te falta", en: "Experience still needed" },
    porIntento: { es: "Por intento, de media", en: "Per attempt, on average" },
    elTramo: { es: "Tramo", en: "Range" },
  };

  return (
    <div className="grid gap-8 border border-white/10 bg-[#12121a] p-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="font-hud text-[10px] tracking-[0.14em] text-white/40">{et.rango[lang].toUpperCase()}</span>
          <select
            value={rango}
            onChange={(e) => setRango(e.target.value as "pro" | "ini")}
            className="mt-1.5 w-full border border-white/15 bg-black/40 px-3 py-2 text-[15px]"
          >
            <option value="pro">{lang === "es" ? "Profesional (1 – 70)" : "Professional (1 – 70)"}</option>
            <option value="ini">{lang === "es" ? "Iniciación (1 – 50)" : "Beginner (1 – 50)"}</option>
          </select>
        </label>

        <label className="block">
          <span className="font-hud text-[10px] tracking-[0.14em] text-white/40">{et.tramo[lang].toUpperCase()}</span>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number" min={1} max={tope} value={desde}
              onChange={(e) => setDesde(Number(e.target.value))}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-[15px] tabular-nums"
            />
            <input
              type="number" min={1} max={tope} value={hasta}
              onChange={(e) => setHasta(Number(e.target.value))}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-[15px] tabular-nums"
            />
          </div>
        </label>

        <label className="block">
          <span className="font-hud text-[10px] tracking-[0.14em] text-white/40">{et.pieza[lang].toUpperCase()}</span>
          <select
            value={exp}
            onChange={(e) => setExp(Number(e.target.value))}
            className="mt-1.5 w-full border border-white/15 bg-black/40 px-3 py-2 text-[15px]"
          >
            {PIEZAS.map((p) => (
              <option key={p.exp} value={p.exp}>
                {p[lang]} — {p.exp} exp
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-hud text-[10px] tracking-[0.14em] text-white/40">
            {et.exito[lang].toUpperCase()}: <span className="font-mono text-white/70">{tasa}%</span>
          </span>
          <input
            type="range" min={10} max={100} step={5} value={tasa}
            onChange={(e) => setTasa(Number(e.target.value))}
            className="mt-2 w-full"
            style={{ accentColor: acento }}
          />
          <span className="mt-2 block text-xs leading-relaxed text-white/35">{ricos(et.fallo[lang])}</span>
        </label>
      </div>

      <div className="border-l-2 bg-black/30 p-6" style={{ borderColor: acento }}>
        <div className="font-mono text-5xl tabular-nums" style={{ color: h <= d ? "#e8736b" : acento }}>
          {falta > 0 ? num(intentos) : "0"}
        </div>
        <div className="mt-2 text-sm text-white/45">
          {h <= d ? et.malRango[lang] : tasa === 100 ? et.veces[lang] : et.intentos[lang]}
        </div>
        <div className="mt-5 h-1.5 bg-white/10">
          <div
            className="h-full transition-[width] duration-300"
            style={{ width: `${falta > 0 ? Math.min(100, (tabla[d] / tabla[h]) * 100) : 0}%`, background: acento }}
          />
        </div>
        <dl className="mt-6 border-t border-white/10 text-sm">
          {[
            [et.falta[lang], falta > 0 ? num(falta) : "—"],
            [et.porIntento[lang], num(media)],
            [et.elTramo[lang], `${rango === "pro" ? "Prof." : "Ini."} ${d} → ${h}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] py-2.5">
              <dt className="text-white/40">{k}</dt>
              <dd className="font-mono tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
