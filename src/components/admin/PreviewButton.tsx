"use client";

// Botón reutilizable de VISTA PREVIA para cualquier formulario del panel.
// Lee los valores ACTUALES de un <form> (sin guardar) y abre una mini ventana
// que muestra el contenido con el mismo render de la web pública.
//
// Uso: dale al <form> un id y coloca <PreviewButton formId="..." />.
// Por defecto lee los campos title / content / main_image. Para una intro,
// pásale `fields={{ title: "intro_title", content: "intro", image: "cover_image" }}`.
import { useState } from "react";
import { SectionContent } from "@/components/SectionContent";
import type { SectionContent as SectionData } from "@/lib/sections";

type Fields = { title?: string; content?: string; image?: string };

export function PreviewButton({
  formId,
  fields,
  label = "Vista previa",
}: {
  formId: string;
  fields?: Fields;
  label?: string;
}) {
  const [data, setData] = useState<{ title: string; content: string; image: string } | null>(null);

  const f: Required<Fields> = {
    title: fields?.title ?? "title",
    content: fields?.content ?? "content",
    image: fields?.image ?? "main_image",
  };

  const open = () => {
    const el = document.getElementById(formId) as HTMLFormElement | null;
    if (!el) return;
    const fd = new FormData(el);
    setData({
      title: String(fd.get(f.title) ?? ""),
      content: String(fd.get(f.content) ?? ""),
      image: String(fd.get(f.image) ?? ""),
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
            className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0b0b12] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <span className="hud-label text-[10px] text-accent/70">Vista previa · así se verá en la web</span>
              <button
                type="button"
                onClick={() => setData(null)}
                className="btn-hud bg-white/10 px-2.5 py-1 text-white/70 hover:text-white"
              >
                <span className="hud-label text-[10px]">✕ Cerrar</span>
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <SectionContent
                section={
                  {
                    id: "preview",
                    slug: "",
                    title: "",
                    introTitle: null,
                    intro: null,
                    introImages: [],
                    renderType: "generic",
                    blocks: [
                      {
                        id: "preview-block",
                        orderIndex: 1,
                        title: data.title,
                        content: data.content,
                        sourceUrl: null,
                        isVerified: false,
                        images: data.image ? [data.image] : [],
                        meta: {},
                      },
                    ],
                  } satisfies SectionData
                }
              />
              <p className="mt-4 text-center text-[10px] text-white/30">
                Vista aproximada. Las tablas y tier lists especiales se ven completas en la página real.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
