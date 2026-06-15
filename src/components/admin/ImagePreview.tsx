"use client";

// Input de URL con previsualización automática de la imagen.
// Úsalo en formularios del admin en lugar de un <input> normal
// cuando quieras que el usuario vea cómo queda la imagen al pegar una URL.
import { useState } from "react";

const inputCls =
  "w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-accent/50 placeholder:text-white/30";

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

  return (
    <div>
      <input
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className={inputCls}
        placeholder={placeholder}
      />
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
