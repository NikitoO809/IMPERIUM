"use client";

// Muro de LOGROS de la comunidad (web pública). Diseño compacto tipo GALERÍA:
// una rejilla de tarjetas pequeñas (portada + juego + título), para que quepan
// muchos logros sin acaparar la pantalla. Al pulsar "Ver todo" se abre el logro
// completo en una ventana (modal) con descripción, todas las imágenes y vídeos.
import { useEffect, useState } from "react";
import type { Achievement } from "@/lib/community";
import { classifyVideo } from "@/lib/video";

// Fecha legible en español: "14 de junio de 2026".
function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d} de ${meses[m - 1]} de ${y}`;
}

// Imagen de portada de la tarjeta: 1ª imagen del logro; si no hay, la miniatura
// del 1er vídeo de YouTube; si tampoco, null (se pinta un fondo decorativo).
function coverFor(a: Achievement): string | null {
  if (a.images.length > 0) return a.images[0];
  for (const v of a.videos) {
    const c = classifyVideo(v);
    if (c.type === "embed" && c.thumb) return c.thumb;
  }
  return null;
}

// ── Tarjeta compacta (portada) ────────────────────────────────────
function AchievementTile({ a, onOpen }: { a: Achievement; onOpen: () => void }) {
  const cover = coverFor(a);
  const date = formatDate(a.achievedOn);
  const nImg = a.images.length;
  const nVid = a.videos.length;

  return (
    <div className="bevel group relative flex flex-col overflow-hidden bg-white/[0.02] ring-1 ring-white/10 transition hover:ring-white/25 lift">
      {/* Portada */}
      <div className="relative h-36 w-full overflow-hidden bg-black/50">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={a.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${a.accent}33, #0a0a16)` }}
          />
        )}
        {/* Velo + acento HUD */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
        <div className="scanlines absolute inset-0 opacity-20" />

        {/* Chip del juego (arriba-izq) */}
        {a.game && (
          <span
            className="absolute left-2 top-2 rounded-md px-2 py-0.5 font-hud text-[9px] uppercase tracking-wider backdrop-blur-sm"
            style={{ background: `${a.accent}33`, color: "#fff", boxShadow: `inset 0 0 0 1px ${a.accent}88` }}
          >
            {a.game}
          </span>
        )}

        {/* Contadores de medios (arriba-der) */}
        {(nImg > 0 || nVid > 0) && (
          <div className="absolute right-2 top-2 flex gap-1">
            {nImg > 0 && (
              <span className="rounded bg-black/60 px-1.5 py-0.5 font-hud text-[9px] text-white/80">📷 {nImg}</span>
            )}
            {nVid > 0 && (
              <span className="rounded bg-black/60 px-1.5 py-0.5 font-hud text-[9px] text-white/80">▶ {nVid}</span>
            )}
          </div>
        )}

        {/* Título sobre la portada */}
        <h2 className="absolute inset-x-0 bottom-0 line-clamp-2 px-3 pb-2 font-title text-sm font-extrabold leading-tight text-white">
          {a.title}
        </h2>
      </div>

      {/* Pie: autor + fecha + botón */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          {a.authorName && (
            <p className="flex items-center gap-1.5 truncate">
              {a.authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.authorAvatar} alt="" className="h-4 w-4 shrink-0 rounded-full object-cover ring-1 ring-white/20" />
              ) : null}
              <span className="truncate font-hud text-[11px] text-white/55">{a.authorName}</span>
            </p>
          )}
          {date && <p className="truncate font-hud text-[10px] text-white/35">{date}</p>}
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="btn-hud shrink-0 px-2.5 py-1 text-[10px] font-semibold"
          style={{ color: a.accent }}
        >
          Ver todo
        </button>
      </div>
    </div>
  );
}

// ── Un vídeo dentro del detalle ───────────────────────────────────
function VideoTile({ url, accent }: { url: string; accent: string }) {
  const [playing, setPlaying] = useState(false);
  const video = classifyVideo(url);

  // Archivo subido a Storage → reproductor nativo dentro de la propia web.
  if (video.type === "file") {
    return (
      <div className="overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
        <video src={video.url} controls className="max-h-80 w-full bg-black object-contain" />
      </div>
    );
  }

  // YouTube → NO se incrusta. Algunos vídeos (música con derechos de autor)
  // tienen bloqueada la reproducción embebida y mostrarían "Vídeo no disponible".
  // En su lugar, la miniatura es un enlace que abre YouTube en otra pestaña.
  if (video.provider === "youtube") {
    return (
      <a
        href={video.watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/v relative block aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-white/10"
      >
        {video.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={video.thumb} alt="Vídeo" className="h-full w-full object-cover opacity-80 transition group-hover/v:scale-105 group-hover/v:opacity-100" />
        ) : (
          <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}33, #0a0a16)` }} />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span
            className="grid h-14 w-14 place-items-center rounded-full ring-2 transition group-hover/v:scale-110"
            style={{ background: `${accent}cc`, boxShadow: `0 0 24px ${accent}aa`, borderColor: accent }}
          >
            <span className="ml-1 text-xl text-black">▶</span>
          </span>
        </span>
        {/* Aviso de que se abrirá en YouTube */}
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-hud text-[9px] uppercase tracking-wider text-white/85 backdrop-blur-sm">
          Ver en YouTube ↗
        </span>
      </a>
    );
  }

  // Google Drive → su visor sí permite incrustar; se reproduce dentro de la web.
  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
        <iframe
          src={video.embedUrl}
          title="Vídeo del logro"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group/v relative aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-white/10"
    >
      {video.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={video.thumb} alt="Vídeo" className="h-full w-full object-cover opacity-80 transition group-hover/v:scale-105 group-hover/v:opacity-100" />
      ) : (
        <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}33, #0a0a16)` }} />
      )}
      <span className="absolute inset-0 grid place-items-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-full ring-2 transition group-hover/v:scale-110"
          style={{ background: `${accent}cc`, boxShadow: `0 0 24px ${accent}aa`, borderColor: accent }}
        >
          <span className="ml-1 text-xl text-black">▶</span>
        </span>
      </span>
    </button>
  );
}

// ── Modal de detalle: el logro completo ───────────────────────────
function AchievementModal({
  a,
  onClose,
  onImage,
}: {
  a: Achievement;
  onClose: () => void;
  onImage: (url: string) => void;
}) {
  const date = formatDate(a.achievedOn);
  return (
    <div onClick={onClose} className="fixed inset-0 z-40 grid place-items-start justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm sm:p-8">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bevel relative w-full max-w-3xl bg-[#0a0a16] ring-1 ring-white/15"
        style={{ boxShadow: `0 0 0 1px ${a.accent}33, 0 0 40px ${a.accent}22` }}
      >
        {/* Cabecera */}
        <div className="flex items-start gap-3 border-b border-white/10 p-5">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
              {a.game && (
                <span className="rounded-md px-2 py-0.5 font-hud uppercase tracking-wider" style={{ background: `${a.accent}1f`, color: a.accent, boxShadow: `inset 0 0 0 1px ${a.accent}55` }}>
                  {a.game}
                </span>
              )}
              {date && <span className="font-hud text-white/40">{date}</span>}
              {a.authorName && (
                <span className="flex items-center gap-1.5">
                  {a.authorAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.authorAvatar} alt="" className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20" />
                  ) : null}
                  <span className="font-hud text-white/55">{a.authorName}</span>
                </span>
              )}
            </div>
            <h2 className="font-title text-xl font-extrabold leading-tight tracking-wide sm:text-2xl" style={{ color: a.accent, textShadow: `0 0 14px ${a.accent}66` }}>
              {a.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 hover:bg-white/20"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          {a.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">{a.description}</p>
          )}

          {a.videos.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {a.videos.map((v, i) => (
                <VideoTile key={i} url={v} accent={a.accent} />
              ))}
            </div>
          )}

          {a.images.length > 0 && (
            <div className={`grid gap-2 ${a.images.length === 1 ? "" : "sm:grid-cols-2"}`}>
              {a.images.map((img, i) => (
                <button key={i} type="button" onClick={() => onImage(img)} className="group/i overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10 transition hover:ring-accent/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={a.title} className="max-h-72 w-full object-contain transition group-hover/i:scale-[1.02]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lightbox de imagen a pantalla completa ────────────────────────
function Lightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 backdrop-blur-sm">
      <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-lg text-white/80 ring-1 ring-white/20 hover:bg-white/20" aria-label="Cerrar">
        ✕
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="max-h-[90vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

export function CommunityAchievements({ achievements }: { achievements: Achievement[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const open = achievements.find((a) => a.id === openId) ?? null;

  // Cerrar con la tecla Escape (primero el lightbox, luego el modal).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else if (openId) setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, openId]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <AchievementTile key={a.id} a={a} onOpen={() => setOpenId(a.id)} />
        ))}
      </div>

      {open && (
        <AchievementModal a={open} onClose={() => setOpenId(null)} onImage={setLightbox} />
      )}
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}
