// Panel de admin — Anuncios: redacta un anuncio y publícalo como embed en un
// canal de Discord. Solo admin/supremo (requirePublisher).
//
// La página solo LEE lo que el navegador puede ver (canales sin webhook_url).
// Publicar, editar y reintentar pasan por /api/announcements, que vuelve a
// comprobar el rango en el servidor.
import { requirePublisher } from "@/lib/admin";
import { getChannels, getAnnouncements, SERVICE_ROLE_CONFIGURED } from "@/lib/announcements";
import { HudLabel } from "@/components/hud";
import { AnnouncementComposer } from "@/components/admin/AnnouncementComposer";

export default async function AdminAnunciosPage() {
  await requirePublisher();

  const [channels, { announcements, total }] = await Promise.all([
    getChannels(),
    getAnnouncements(20, 0),
  ]);

  const published = announcements.filter((a) => a.publishedAt).length;

  return (
    <div className="flex h-full flex-col">
      {/* Barra superior */}
      <header className="border-b border-white/10 bg-black/30 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <HudLabel>Anuncios</HudLabel>
            <h1 className="mt-0.5 font-title text-xl font-extrabold tracking-wide text-glow-brand">
              Avisar a la comunidad
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold text-glow-brand">{total}</div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">ANUNCIOS</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="font-title text-2xl font-extrabold" style={{ color: "#ffcf5a" }}>
                {published}
              </div>
              <div className="font-hud text-[8px] tracking-widest text-white/35">PUBLICADOS</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-8 py-6">
        <p className="mb-4 text-xs text-white/40">
          Lo que escribas aquí se publica como mensaje en el canal de Discord que elijas.
          Puedes editarlo después: se modifica el mensaje que ya está en el canal, no se
          manda uno nuevo.
        </p>

        {!SERVICE_ROLE_CONFIGURED ? (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-4 text-sm text-amber-100">
            <p className="font-hud">Falta la clave de servicio de Supabase.</p>
            <p className="mt-1 text-xs text-amber-100/70">
              Añade <code className="text-amber-200">SUPABASE_SERVICE_ROLE_KEY</code> a{" "}
              <code className="text-amber-200">.env.local</code> (y a las variables del deploy)
              y reinicia el servidor. Sin ella no se puede leer el canal ni guardar anuncios.
            </p>
          </div>
        ) : channels.length === 0 ? (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-4 text-sm text-amber-100">
            <p className="font-hud">No hay ningún canal configurado.</p>
            <p className="mt-1 text-xs text-amber-100/70">
              Añade una fila en la tabla <code className="text-amber-200">discord_channels</code>{" "}
              con la clave, el nombre visible y la URL del webhook del canal. La URL es secreta:
              se inserta desde el editor SQL de Supabase, nunca desde el código.
            </p>
          </div>
        ) : (
          <AnnouncementComposer
            channels={channels}
            initialAnnouncements={announcements}
            nowIso={new Date().toISOString()}
          />
        )}
      </div>
    </div>
  );
}
