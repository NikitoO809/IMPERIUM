// Utilidades para los vídeos de los logros. Un vídeo puede ser:
//   · un enlace de YouTube       → se incrusta con un <iframe> (reproductor YT),
//   · un enlace de Google Drive  → se incrusta con el visor de Drive (/preview),
//   · un archivo de vídeo subido a Storage (.mp4/.webm…) → <video> con controles.

// Extrae el ID de un vídeo de YouTube de las formas habituales de enlace:
// youtu.be/ID · youtube.com/watch?v=ID · /embed/ID · /shorts/ID · /live/ID
export function youtubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/|v\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

// Extrae el ID de un archivo de Google Drive de las formas habituales de enlace:
// drive.google.com/file/d/ID/... · open?id=ID · uc?id=ID · usercontent…?id=ID
export function driveId(url: string): string | null {
  if (!/(?:drive|docs)\.google\.com|drive\.usercontent\.google\.com/.test(url)) return null;
  const patterns = [/\/file\/d\/([\w-]+)/, /[?&]id=([\w-]+)/];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export type VideoKind =
  | { type: "embed"; provider: "youtube" | "drive"; embedUrl: string; thumb: string | null }
  | { type: "file"; url: string };

export function classifyVideo(url: string): VideoKind {
  const yt = youtubeId(url);
  if (yt) {
    return { type: "embed", provider: "youtube", embedUrl: `https://www.youtube.com/embed/${yt}`, thumb: youtubeThumb(yt) };
  }
  const dr = driveId(url);
  if (dr) {
    return {
      type: "embed",
      provider: "drive",
      embedUrl: `https://drive.google.com/file/d/${dr}/preview`,
      thumb: `https://drive.google.com/thumbnail?id=${dr}&sz=w1280`,
    };
  }
  return { type: "file", url };
}

// Miniatura de portada de un YouTube (para mostrar antes de reproducir).
export function youtubeThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
