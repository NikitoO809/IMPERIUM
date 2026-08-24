"use client";

// Banner de reclutamiento para AION 2 (portada).
// Banda a todo el ancho con el arte Elyos vs Asmodian: las dos guerreras se
// miran y el contenido va justo en el centro, tapando el logo del arte.
// Lleva cuenta atrás al acceso anticipado y CTA a Discord.
//
// ── Miguel: lo editable está aquí arriba ──────────────────────────────
// Fechas oficiales (NCSoft, anunciadas en agosto de 2026):
//   · Acceso anticipado (Founder's Pack): 30 de septiembre de 2026
//   · Apertura global (gratis, suscripción opcional 15 $): 5 de octubre de 2026
// Si NCSoft concreta la HORA exacta, cámbiala en EARLY_ACCESS_ISO.
const EARLY_ACCESS_ISO = "2026-09-30T00:00:00Z";
const FICHA_URL = "/proximos/aion-2";
// ──────────────────────────────────────────────────────────────────────

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { DiscordIcon } from "@/components/icons";
import { joinHype } from "@/app/(app)/actions";

// Clave del contador de "gente esperando" (tabla game_hype).
const HYPE_KEY = "aion-2";

// ¿Este navegador ya se apuntó? Se lee del almacenamiento del navegador. En el
// servidor no existe, así que allí la respuesta es siempre "todavía no".
function leerApuntado(): boolean {
  try {
    return window.localStorage.getItem(`hype:${HYPE_KEY}`) === "1";
  } catch {
    return false;
  }
}
const sinSuscripcion = () => () => {};

type Left = { d: number; h: number; m: number; s: number };

// Posiciones fijas de las motas de aether (fijas a propósito: si fueran
// aleatorias, el HTML del servidor y el del navegador no coincidirían).
const MOTES = [
  { l: 6, d: 0, t: 15, s: 3 }, { l: 14, d: 2.4, t: 19, s: 2 },
  { l: 23, d: 1.1, t: 16, s: 4 }, { l: 31, d: 3.6, t: 21, s: 2 },
  { l: 39, d: 0.8, t: 17, s: 3 }, { l: 47, d: 4.2, t: 22, s: 2 },
  { l: 55, d: 1.9, t: 18, s: 3 }, { l: 62, d: 3.1, t: 20, s: 2 },
  { l: 70, d: 0.4, t: 16, s: 4 }, { l: 78, d: 2.7, t: 23, s: 2 },
  { l: 86, d: 1.5, t: 17, s: 3 }, { l: 94, d: 3.9, t: 19, s: 2 },
];

export function Aion2Recruit({
  discordUrl = "",
  initialWaiting = 0,
}: {
  discordUrl?: string;
  initialWaiting?: number;
}) {
  const [left, setLeft] = useState<Left | null>(null);
  const [launched, setLaunched] = useState(false);

  // Contador "yo también lo espero": el total y si este navegador ya sumó.
  const [waiting, setWaiting] = useState(initialWaiting);
  const [apuntadoAhora, setApuntadoAhora] = useState(false);
  const apuntadoAntes = useSyncExternalStore(sinSuscripcion, leerApuntado, () => false);
  const joined = apuntadoAntes || apuntadoAhora;
  const [sending, setSending] = useState(false);
  const [pop, setPop] = useState(false);

  async function apuntarse() {
    if (joined || sending) return;
    setSending(true);

    // Token anónimo por navegador: así cada persona suma una sola vez.
    let token = "";
    try {
      token = window.localStorage.getItem("hype:token") ?? "";
      if (!token) {
        token = crypto.randomUUID();
        window.localStorage.setItem("hype:token", token);
      }
    } catch {
      token = crypto.randomUUID();
    }

    const res = await joinHype(HYPE_KEY, token);
    if (res.ok) {
      setWaiting(res.total);
      setApuntadoAhora(true);
      setPop(true);
      window.setTimeout(() => setPop(false), 1000);
      try {
        window.localStorage.setItem(`hype:${HYPE_KEY}`, "1");
      } catch {
        // Sin almacenamiento no recordamos el clic, pero el total ya se guardó.
      }
    }
    setSending(false);
  }

  useEffect(() => {
    const target = new Date(EARLY_ACCESS_ISO).getTime();
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setLaunched(true);
        setLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="a2-band" aria-labelledby="a2-title">
      {/* arte de fondo (Elyos vs Asmodian) */}
      <Image
        src="/proximos/aion-2.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="a2-art"
      />

      {/* velos: oscurecen bordes y centro para que el texto se lea */}
      <div className="a2-veil" aria-hidden />
      <div className="a2-core" aria-hidden />

      {/* motas de aether subiendo */}
      <div className="a2-motes" aria-hidden>
        {MOTES.map((m, i) => (
          <i
            key={i}
            style={{
              left: `${m.l}%`,
              width: m.s,
              height: m.s,
              animationDelay: `${m.d}s`,
              animationDuration: `${m.t}s`,
            }}
          />
        ))}
      </div>

      {/* marco dorado con esquinas */}
      <div className="a2-frame" aria-hidden>
        <span /><span /><span /><span />
      </div>

      {/* contenido */}
      <div className="a2-content">
        <span className="a2-chip">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-gold" />
          Reclutamiento abierto
        </span>

        <p className="a2-kicker">Legión IMPERIUM · Atreia</p>
        <h2 id="a2-title" className="a2-title">AION 2</h2>
        <p className="a2-claim">
          Volamos juntos desde el primer día. Estamos formando la legión de IMPERIUM para
          el lanzamiento global: asedios Reino contra Reino, mazmorras y alas al servicio del Imperio.
        </p>

        {/* cuenta atrás */}
        <div className="a2-count" role="timer" aria-live="off">
          <span className="a2-count-label">
            {launched ? "El acceso anticipado ya está abierto" : "Acceso anticipado en"}
          </span>
          {!launched && (
            <div className="a2-cells">
              <Cell v={left?.d} label="Días" />
              <Cell v={left?.h} label="Horas" />
              <Cell v={left?.m} label="Min" />
              <Cell v={left?.s} label="Seg" />
            </div>
          )}
          <span className="a2-count-note">
            30 sept. acceso anticipado con pack de fundador · 5 oct. apertura gratuita · PC (Steam y PURPLE)
          </span>
        </div>

        {/* llamadas a la acción */}
        <div className="a2-cta">
          {discordUrl ? (
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-primary a2-cta-main"
            >
              <DiscordIcon className="h-5 w-5" />
              <span>Únete a la legión</span>
            </a>
          ) : (
            <Link href={FICHA_URL} className="pill pill-primary a2-cta-main">
              <span>Quiero entrar</span>
            </Link>
          )}
          <Link href={FICHA_URL} className="pill pill-ghost">
            <span>Ver ficha de AION 2</span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* contador "yo también lo espero" */}
        <button
          type="button"
          onClick={apuntarse}
          disabled={joined || sending}
          className={`a2-hype${joined ? " is-joined" : ""}`}
          aria-live="polite"
        >
          <span className={`a2-hype-num${pop ? " is-pop" : ""}`}>{waiting}</span>
          <span className="a2-hype-text">
            {joined ? (
              <>
                <strong>Ya estás en la lista</strong>
                <em>gracias por sumarte a la legión</em>
              </>
            ) : (
              <>
                <strong>{waiting === 1 ? "persona espera AION 2" : "esperan AION 2"}</strong>
                <em>{sending ? "apuntándote…" : "pulsa para sumarte a la cuenta"}</em>
              </>
            )}
          </span>
          {pop && <span className="a2-hype-plus" aria-hidden>+1</span>}
        </button>

        {/* reclamos rápidos */}
        <ul className="a2-tags">
          <li>Elyos o Asmodian</li>
          <li>El vuelo es parte del combate</li>
          <li>Asedios Reino contra Reino</li>
          <li>Gratis + suscripción opcional de 15 $</li>
        </ul>
      </div>
    </section>
  );
}

// Celda de la cuenta atrás. Mientras el navegador no ha calculado la hora
// muestra "--" (así el servidor y el cliente pintan lo mismo).
function Cell({ v, label }: { v?: number; label: string }) {
  return (
    <div className="a2-cell">
      <span className="a2-num">{v === undefined ? "--" : String(v).padStart(2, "0")}</span>
      <span className="a2-cell-label">{label}</span>
    </div>
  );
}
