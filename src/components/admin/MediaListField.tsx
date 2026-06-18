"use client";

// Campo de MEDIOS MÚLTIPLES para el panel (imágenes o vídeos de un logro).
// Permite añadir varios elementos: pegar una URL (incl. enlaces de YouTube en el
// modo vídeo) o subir archivos desde el dispositivo. Lo subido va a Supabase
// Storage (bucket "content" para imágenes, "media" para vídeos, ambos públicos).
//
// El valor final viaja en un <input hidden> con `name`, una URL por línea, para
// que la Server Action lo lea con el mismo parser de líneas que el resto.
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { classifyVideo } from "@/lib/video";

type Kind = "image" | "video";

const CONF = {
  image: { bucket: "content", accept: "image/*", maxBytes: 5 * 1024 * 1024, maxLabel: "5 MB", noun: "imagen" },
  video: { bucket: "media", accept: "video/*", maxBytes: 50 * 1024 * 1024, maxLabel: "50 MB", noun: "vídeo" },
} as const;

function MediaThumb({ url, kind }: { url: string; kind: Kind }) {
  if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-md bg-black/50 object-contain ring-1 ring-white/10" />;
  }
  const v = classifyVideo(url);
  if (v.type === "embed" && v.thumb) {
    return (
      <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.thumb} alt="" className="h-full w-full object-cover" />
        <span className="absolute inset-0 grid place-items-center text-white/90">▶</span>
      </span>
    );
  }
  return (
    <span className="grid h-16 w-24 shrink-0 place-items-center rounded-md bg-black/60 text-xl text-white/60 ring-1 ring-white/10">
      🎬
    </span>
  );
}

export function MediaListField({
  name,
  kind,
  defaultUrls = [],
}: {
  name: string;
  kind: Kind;
  defaultUrls?: string[];
}) {
  const conf = CONF[kind];
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addUrl(value: string) {
    const v = value.trim();
    if (!v) return;
    setUrls((prev) => (prev.includes(v) ? prev : [...prev, v]));
    setDraft("");
  }

  function remove(idx: number) {
    setUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    const list = Array.from(files);
    const supabase = createClient();
    setUploading(true);
    try {
      for (const file of list) {
        const okType = kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/");
        if (!okType) {
          setError(`Ese archivo no es un ${conf.noun}.`);
          continue;
        }
        if (file.size > conf.maxBytes) {
          setError(`El ${conf.noun} pesa más de ${conf.maxLabel}. Usa uno más ligero.`);
          continue;
        }
        const ext = (file.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4")).toLowerCase();
        const path = `uploads/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(conf.bucket)
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) {
          setError(
            upErr.message.toLowerCase().includes("row-level") || upErr.message.toLowerCase().includes("policy")
              ? "No tienes permiso para subir (¿iniciaste sesión como staff?)."
              : `No se pudo subir: ${upErr.message}`
          );
          continue;
        }
        const { data } = supabase.storage.from(conf.bucket).getPublicUrl(path);
        setUrls((prev) => [...prev, data.publicUrl]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {/* Valor real que envía el formulario: una URL por línea */}
      <input type="hidden" name={name} value={urls.join("\n")} />

      {/* Lista de medios añadidos */}
      {urls.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {urls.map((u, i) => (
            <li key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] p-1.5 ring-1 ring-white/10">
              <MediaThumb url={u} kind={kind} />
              <span className="min-w-0 flex-1 truncate font-hud text-[11px] text-white/45">{u}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 rounded-md bg-red-500/10 px-2 py-1 text-[11px] text-red-300 ring-1 ring-red-400/20 hover:bg-red-500/20"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Añadir por URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl(draft);
            }
          }}
          placeholder={kind === "video" ? "Pega un enlace de YouTube o una URL de vídeo…" : "Pega una URL de imagen…"}
          className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-accent/50 placeholder:text-white/30"
        />
        <button
          type="button"
          onClick={() => addUrl(draft)}
          className="shrink-0 rounded-lg bg-white/5 px-3 py-2 font-hud text-[11px] text-white/70 ring-1 ring-white/10 hover:text-white"
        >
          Añadir
        </button>
      </div>

      {/* Subir archivo(s) */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-center text-[11px] transition ${
          dragging
            ? "border-accent/60 bg-accent/10 text-accent"
            : "border-white/15 bg-white/[0.02] text-white/45 hover:border-white/30 hover:text-white/70"
        }`}
      >
        {uploading ? (
          <span className="text-accent">Subiendo {conf.noun}…</span>
        ) : (
          <>
            <span className="text-sm">⬆</span>
            <span>Arrastra {conf.noun === "imagen" ? "imágenes" : "vídeos"} aquí o haz clic para subir (máx. {conf.maxLabel})</span>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={conf.accept}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="mt-1.5 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}
