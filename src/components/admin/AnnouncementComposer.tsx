"use client";

// Redactor de ANUNCIOS del panel: formulario + preview en vivo del embed +
// lista de los últimos anuncios con su estado.
//
// El preview NO reconstruye el mensaje a mano: llama a `buildPayload`, la misma
// función que usa el servidor para enviar a Discord. Así lo que se ve es
// exactamente lo que se manda.
//
// Aquí no hay ni un secreto: la URL del webhook vive solo en el servidor. Este
// componente solo conoce la clave del canal (`key`) y el id del rol a mencionar.
import { useMemo, useState } from "react";
import {
  buildPayload,
  DISCORD_LIMITS,
  type AdminAnnouncement,
  type AnnouncementDraft,
  type PublicChannel,
} from "@/lib/discord-announce";
import { labelCls, inputCls, textareaCls, btnPrimary, btnGhost } from "@/components/admin/styles";

// Color por defecto del embed (#F01E1E), en el entero decimal que pide Discord.
const DEFAULT_COLOR = 15736350;

// Entero decimal → #rrggbb para el <input type="color"> (mismo helper que en
// el panel de próximos juegos).
function intToHex(color: number): string {
  return "#" + (color & 0xffffff).toString(16).padStart(6, "0");
}

function hexToInt(hex: string): number {
  const n = parseInt(hex.replace(/^#/, ""), 16);
  return Number.isFinite(n) ? n : DEFAULT_COLOR;
}

// Contador de caracteres: se pone ámbar cerca del límite y rojo al pasarse.
function Counter({ value, max }: { value: number; max: number }) {
  const tone =
    value > max ? "text-red-400" : value > max * 0.9 ? "text-amber-300" : "text-white/30";
  return (
    <span className={`font-hud text-[10px] ${tone}`}>
      {value}/{max}
    </span>
  );
}

type Props = {
  channels: PublicChannel[];
  initialAnnouncements: AdminAnnouncement[];
  // Hora del pie del embed en el preview. La calcula el SERVIDOR y la pasa como
  // prop: si la calculáramos aquí, el HTML del servidor y el del navegador no
  // coincidirían (error de hidratación).
  nowIso: string;
};

export function AnnouncementComposer({ channels, initialAnnouncements, nowIso }: Props) {
  const [channelKey, setChannelKey] = useState(channels[0]?.key ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [pingRole, setPingRole] = useState(false);

  // Si es distinto de null estamos EDITANDO ese anuncio (PATCH), no creando.
  const [editingId, setEditingId] = useState<string | null>(null);

  const [items, setItems] = useState<AdminAnnouncement[]>(initialAnnouncements);
  const [busy, setBusy] = useState(false);
  const [busyRetryId, setBusyRetryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const channel = channels.find((c) => c.key === channelKey) ?? null;

  const draft: AnnouncementDraft = useMemo(
    () => ({
      title: title.trim(),
      body: body.trim() || null,
      linkUrl: linkUrl.trim() || null,
      imageUrl: imageUrl.trim() || null,
      color,
      pingRole,
    }),
    [title, body, linkUrl, imageUrl, color, pingRole]
  );

  // El mensaje real que se enviará a Discord.
  const payload = useMemo(
    () => buildPayload(draft, channel?.defaultRoleId, { timestamp: nowIso }),
    [draft, channel, nowIso]
  );
  const embed = payload.embeds[0];

  const tooLong = title.length > DISCORD_LIMITS.title || body.length > DISCORD_LIMITS.description;
  const canSubmit = Boolean(channelKey && title.trim() && !tooLong && !busy);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setImageUrl("");
    setLinkUrl("");
    setColor(DEFAULT_COLOR);
    setPingRole(false);
  }

  // Mete o reemplaza un anuncio en la lista, sin recargar la página.
  function upsert(item: AdminAnnouncement) {
    setItems((prev) => {
      const idx = prev.findIndex((a) => a.id === item.id);
      if (idx === -1) return [item, ...prev];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setNotice(null);

    const payloadBody = {
      channel_key: channelKey,
      title: draft.title,
      body: draft.body,
      link_url: draft.linkUrl,
      image_url: draft.imageUrl,
      color: draft.color,
      ping_role: draft.pingRole,
    };

    try {
      const res = await fetch(
        editingId ? `/api/announcements/${editingId}` : "/api/announcements",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        }
      );
      const data = (await res.json()) as {
        announcement?: AdminAnnouncement;
        error?: string;
        warning?: string;
      };

      // Aunque falle Discord, el anuncio pudo quedar guardado: lo listamos
      // igual para poder reintentarlo.
      if (data.announcement) upsert(data.announcement);

      if (!res.ok) {
        setError(data.error ?? "No se pudo publicar el anuncio.");
        return;
      }

      setNotice(
        data.warning ??
          (editingId ? "Mensaje actualizado en Discord." : "Anuncio publicado en Discord.")
      );
      resetForm();
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setBusy(false);
    }
  }

  async function retry(id: string) {
    setBusyRetryId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/announcements/${id}/retry`, { method: "POST" });
      const data = (await res.json()) as {
        announcement?: AdminAnnouncement;
        error?: string;
        warning?: string;
      };
      if (data.announcement) upsert(data.announcement);
      if (!res.ok) {
        setError(data.error ?? "No se pudo reintentar.");
        return;
      }
      setNotice(data.warning ?? "Anuncio publicado en Discord.");
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setBusyRetryId(null);
    }
  }

  // Carga un anuncio ya guardado en el formulario para editarlo.
  function edit(item: AdminAnnouncement) {
    setEditingId(item.id);
    setChannelKey(item.channelKey);
    setTitle(item.title);
    setBody(item.body ?? "");
    setImageUrl(item.imageUrl ?? "");
    setLinkUrl(item.linkUrl ?? "");
    setColor(item.color);
    setPingRole(item.pingRole);
    setError(null);
    setNotice(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        {/* ── Formulario ─────────────────────────────────── */}
        <div className="rounded-lg border border-white/10 bg-black/30 p-5">
          {editingId && (
            <div className="mb-4 flex items-center justify-between rounded-md border border-accent/30 bg-accent/10 px-3 py-2">
              <span className="font-hud text-[11px] text-accent">
                Editando un anuncio ya publicado: se modificará el mensaje que ya está en Discord.
              </span>
              <button type="button" onClick={resetForm} className="font-hud text-[10px] text-white/50 hover:text-white">
                Cancelar
              </button>
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Canal</label>
              <select
                value={channelKey}
                onChange={(e) => setChannelKey(e.target.value)}
                disabled={Boolean(editingId)}
                className={`${inputCls} disabled:opacity-50`}
              >
                {channels.map((c) => (
                  <option key={c.id} value={c.key} className="bg-[#12121a]">
                    {c.label}
                  </option>
                ))}
              </select>
              {editingId && (
                <p className="mt-1 font-hud text-[10px] text-white/30">
                  El canal no se cambia: el mensaje vive donde se publicó.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Título</label>
                <Counter value={title.length} max={DISCORD_LIMITS.title} />
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="Ej: Guerra de alianzas este sábado"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className={labelCls}>Cuerpo</label>
                <Counter value={body.length} max={DISCORD_LIMITS.description} />
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className={textareaCls}
                placeholder="Lo que quieres contar. Discord admite **negrita**, *cursiva* y saltos de línea."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Imagen (URL)</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={inputCls}
                  placeholder="https://... (opcional)"
                />
              </div>
              <div>
                <label className={labelCls}>Enlace del título (URL)</label>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className={inputCls}
                  placeholder="https://... (opcional)"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Color de la barra</label>
                <input
                  type="color"
                  value={intToHex(color)}
                  onChange={(e) => setColor(hexToInt(e.target.value))}
                  className={`${inputCls} h-10 cursor-pointer p-1`}
                />
              </div>
              <div>
                <label className={labelCls}>Mención</label>
                <label
                  className={`flex h-10 items-center gap-2 rounded-lg px-3 ring-1 transition ${
                    channel?.defaultRoleId
                      ? "cursor-pointer bg-white/5 ring-white/10"
                      : "cursor-not-allowed bg-white/[0.02] ring-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={pingRole}
                    disabled={!channel?.defaultRoleId}
                    onChange={(e) => setPingRole(e.target.checked)}
                    className="accent-brand"
                  />
                  <span className="font-hud text-[11px] text-white/70">
                    {channel?.defaultRoleId
                      ? "Avisar al rol del canal"
                      : "Este canal no tiene rol configurado"}
                  </span>
                </label>
              </div>
            </div>

            {/* Errores y avisos, siempre visibles */}
            {error && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {notice}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className={`${btnPrimary} disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span className="hud-label text-[10px]">
                  {busy
                    ? editingId
                      ? "Guardando..."
                      : "Publicando..."
                    : editingId
                      ? "Guardar cambios"
                      : "Publicar en Discord"}
                </span>
              </button>
              {!editingId && (
                <button type="button" onClick={resetForm} className={btnGhost} disabled={busy}>
                  <span className="hud-label text-[10px]">Limpiar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Preview del embed ──────────────────────────── */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 font-hud text-[9px] tracking-[0.2em] text-white/30">
            ASÍ SE VERÁ EN DISCORD
          </p>
          <div className="rounded-lg bg-[#313338] p-4 text-[#dbdee1]">
            {/* Ping: fuera del embed, que es donde notifica de verdad */}
            {payload.content && (
              <p className="mb-2 text-sm">
                <span className="rounded bg-[#5865f2]/30 px-1 py-0.5 text-[#c9cdfb]">
                  @{channel?.label ?? "rol"}
                </span>
              </p>
            )}

            <div className="flex overflow-hidden rounded-[4px] bg-[#2b2d31]">
              <div className="w-1 shrink-0" style={{ backgroundColor: intToHex(embed.color) }} />
              <div className="min-w-0 flex-1 p-3">
                <p className="break-words font-semibold text-[#00a8fc]">
                  {embed.title || <span className="text-[#dbdee1]/30">(sin título)</span>}
                </p>
                {embed.description && (
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-[#dbdee1]">
                    {embed.description}
                  </p>
                )}
                {embed.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={embed.image.url}
                    alt=""
                    className="mt-3 max-h-56 w-full rounded object-cover"
                  />
                )}
                <p className="mt-3 text-[11px] text-[#dbdee1]/50">
                  {embed.footer?.text} · hoy
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 font-hud text-[10px] text-white/25">
            El preview usa la misma función que el envío, así que no hay sorpresas.
          </p>
        </div>
      </div>

      {/* ── Anuncios recientes ───────────────────────────── */}
      <div>
        <p className="mb-3 font-hud text-[9px] tracking-[0.2em] text-white/30">
          ANUNCIOS RECIENTES
        </p>
        {items.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-black/20 px-4 py-6 text-center text-xs text-white/35">
            Todavía no has publicado ningún anuncio.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const published = Boolean(item.publishedAt);
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3"
                >
                  <span
                    className="h-8 w-1 shrink-0 rounded"
                    style={{ backgroundColor: intToHex(item.color) }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/85">{item.title}</p>
                    <p className="font-hud text-[10px] text-white/35">{item.channelLabel}</p>
                  </div>

                  {published ? (
                    <span className="rounded-md bg-emerald-400/10 px-2.5 py-1 font-hud text-[10px] text-emerald-300 ring-1 ring-emerald-400/30">
                      Publicado
                    </span>
                  ) : (
                    <span className="rounded-md bg-red-500/10 px-2.5 py-1 font-hud text-[10px] text-red-300 ring-1 ring-red-500/30">
                      Sin publicar
                    </span>
                  )}

                  {published ? (
                    <button type="button" onClick={() => edit(item)} className={btnGhost}>
                      <span className="hud-label text-[9px]">Editar</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => retry(item.id)}
                      disabled={busyRetryId === item.id}
                      className={`${btnPrimary} disabled:opacity-40`}
                    >
                      <span className="hud-label text-[9px]">
                        {busyRetryId === item.id ? "Reintentando..." : "Reintentar"}
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
