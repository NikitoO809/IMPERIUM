"use client";

// Campo de imagen del panel: permite (a) pegar una URL o (b) arrastrar /
// subir un archivo desde el dispositivo. Lo subido va a Supabase Storage
// (bucket "content", público) y queda guardado en el servidor para siempre,
// aunque quien lo subió borre el archivo de su PC.
//
// Mantiene la interfaz de antes (name / defaultValue / placeholder): el valor
// final (una URL) viaja en un <input> con ese `name`, así los formularios que
// ya lo usaban siguen funcionando igual.
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputCls =
  "w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-accent/50 placeholder:text-white/30";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB (igual que el límite del bucket)

export function ImagePreview({
  name,
  defaultValue = "",
  placeholder = "https://...",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Ese archivo no es una imagen.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("La imagen pesa más de 5 MB. Usa una más ligera.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `uploads/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("content")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (upErr) {
        // Mensaje claro para el caso más común (permisos / sesión).
        setError(
          upErr.message.toLowerCase().includes("row-level") ||
            upErr.message.toLowerCase().includes("policy")
            ? "No tienes permiso para subir imágenes (¿iniciaste sesión como staff?)."
            : `No se pudo subir: ${upErr.message}`
        );
        return;
      }

      const { data } = supabase.storage.from("content").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div>
      {/* El valor real (URL) que envía el formulario */}
      <input type="hidden" name={name} value={url} />

      {/* Campo para pegar/editar la URL manualmente */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={inputCls}
        placeholder={placeholder}
      />

      {/* Zona de arrastrar / subir */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-center text-[11px] transition ${
          dragging
            ? "border-accent/60 bg-accent/10 text-accent"
            : "border-white/15 bg-white/[0.02] text-white/45 hover:border-white/30 hover:text-white/70"
        }`}
      >
        {uploading ? (
          <span className="text-accent">Subiendo imagen…</span>
        ) : (
          <>
            <span className="text-sm">⬆</span>
            <span>Arrastra una imagen aquí o haz clic para subir desde tu dispositivo</span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = ""; // permite volver a subir el mismo archivo
          }}
        />
      </div>

      {error && <p className="mt-1.5 text-[11px] text-red-300">{error}</p>}

      {/* Vista previa */}
      {url && (
        <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Vista previa"
            className="max-h-52 w-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
            }}
          />
        </div>
      )}
    </div>
  );
}
