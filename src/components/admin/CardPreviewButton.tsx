"use client";

// Botón de VISTA PREVIA con forma de TARJETA, para los editores que se muestran
// como cards en la web (próximos juegos, MMORPG, administradores, hitos, juego).
// Lee los valores actuales del <form> (sin guardar) y los pinta en una tarjeta
// aproximada con el estilo HUD.
//
// Uso: <CardPreviewButton formId="up-123" fields={{ image:"image", title:"name", badge:"tag", text:"blurb" }} />
import { useState } from "react";

type Fields = {
  image?: string;
  title?: string;
  badge?: string;
  subtitle?: string;
  text?: string;
  meta?: string[]; // nombres de campos extra mostrados como chips
};

type State = {
  image: string;
  title: string;
  badge: string;
  subtitle: string;
  text: string;
  meta: string[];
};

export function CardPreviewButton({
  formId,
  fields,
  variant = "card",
  label = "Vista previa",
}: {
  formId: string;
  fields: Fields;
  variant?: "card" | "person";
  label?: string;
}) {
  const [data, setData] = useState<State | null>(null);

  const open = () => {
    const el = document.getElementById(formId) as HTMLFormElement | null;
    if (!el) return;
    const fd = new FormData(el);
    const get = (n?: string) => (n ? String(fd.get(n) ?? "").trim() : "");
    setData({
      image: get(fields.image),
      title: get(fields.title),
      badge: get(fields.badge),
      subtitle: get(fields.subtitle),
      text: get(fields.text),
      meta: (fields.meta ?? []).map(get).filter(Boolean),
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="btn-hud bg-white/10 px-3 py-2 text-white/70 hover:text-white"
      >
        <span className="hud-label text-[10px]">👁 {label}</span>
      </button>

      {data && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
          onClick={() => setData(null)}
        >
          <div
            className="relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0b0b12] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="hud-label text-[10px] text-accent/70">Vista previa · así se verá la tarjeta</span>
              <button
                type="button"
                onClick={() => setData(null)}
                className="btn-hud bg-white/10 px-2.5 py-1 text-white/70 hover:text-white"
              >
                <span className="hud-label text-[10px]">✕ Cerrar</span>
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {/* Tarjeta aproximada */}
              <div className="overflow-hidden rounded-xl border border-white/12 bg-gradient-to-b from-white/[0.04] to-transparent">
                {/* Banner (solo variante card) */}
                {variant === "card" && data.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.image} alt="" className="h-40 w-full bg-black/40 object-contain" />
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    {variant === "person" && (
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/40">
                        {data.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={data.image} alt="" className="h-full w-full object-cover" />
                        )}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-title text-lg font-extrabold leading-tight text-glow-brand">
                          {data.title || <span className="text-white/30">(sin título)</span>}
                        </h3>
                        {data.badge && (
                          <span className="shrink-0 rounded-md bg-amber-400/10 px-2 py-0.5 font-hud text-[10px] text-amber-300 ring-1 ring-amber-400/30">
                            {data.badge}
                          </span>
                        )}
                      </div>
                      {data.subtitle && (
                        <p className="mt-0.5 hud-label text-[10px] text-accent/70">{data.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {data.text &&
                    data.text.split("\n\n").map((p, i) => (
                      <p key={i} className="mt-2 text-sm leading-relaxed text-white/60">{p}</p>
                    ))}

                  {data.meta.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {data.meta.map((m, i) => (
                        <span key={i} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-hud text-[10px] text-white/55">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-4 text-center text-[10px] text-white/30">
                Vista aproximada del contenido. El estilo final puede variar un poco en la web.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
